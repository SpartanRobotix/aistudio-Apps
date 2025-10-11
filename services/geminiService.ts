
// FIX: Removed `Chat` from imports as it's no longer used.
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Member, Group, ChatMessage, QuizQuestion, Album } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: The `chatInstances` and `getChatInstance` are removed because we are switching
// to the stateless `generateContentStream` API which is more suitable for how
// this application manages chat history.
// const chatInstances: { [key: string]: Chat } = {};

// This function dynamically creates the system instruction for the AI.
// It generates a specific, detailed persona for individual member chats,
// or a broader instruction for moderating a group chat.
const getSystemInstruction = (group: Group, member?: Member): string => {
    // If a specific member is provided, create a persona-based instruction for a solo chat.
    if (member) {
        return `You are ${member.name} (nicknames: ${member.nicknames.join(', ')}) from the K-POP group ${group.name}. Embody his persona perfectly.
        Your personality is: ${member.personality}.
        Your MBTI is ${member.mbti}.
        Your representative animal is a ${member.animal}.
        An iconic thing you might say is: "${member.iconicLine}".
        A fun fact about you is: ${member.funFact}.
        You must respond to the user as if you are ${member.name}. Keep your responses relatively short and conversational, like a text message. Use your nicknames occasionally. Do not use markdown.`;
    }
    
    // If no member is specified, create an instruction for a group chat experience.
    const memberProfiles = group.members.map(m => `- ${m.name} (${m.nicknames[0]}): Personality is ${m.personality}. He might say something like "${m.iconicLine}".`).join('\n');
    return `You are a chat moderator for the K-POP group ${group.name}.
    You must facilitate a group chat experience where different members of ${group.name} respond to the user.
    Here are the member personalities and details:
    ${memberProfiles}
    Your responses should be from different members, clearly indicating who is talking (e.g., "Hyunjin: ...", "Felix: ...").
    The members should interact with each other and the user. Keep responses engaging and true to their personalities and unique ways of speaking.`;
};

/*
FIX: This function is removed as it relies on the `Chat` object which has private
properties for history and config that we cannot manipulate as needed.
const getChatInstance = (group: Group, member?: Member): Chat => {
    const key = member ? `${group.id}-${member.id}` : `${group.id}-group`;
    if (!chatInstances[key]) {
        chatInstances[key] = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: getSystemInstruction(group, member),
            },
        });
    }
    // Update system instruction in case it has changed (e.g., user customization in the future)
    chatInstances[key].config.systemInstruction = getSystemInstruction(group, member);
    return chatInstances[key];
};
*/

// FIX: Refactored to use `ai.models.generateContentStream`.
// This resolves errors from attempting to access private properties `config` and `history` on a `Chat` instance,
// and also fixes the incorrect arguments passed to `sendMessageStream`.
// The new approach is stateless and sends the entire conversation history with each request,
// which fits the application's architecture of persisting chat history in the UI.
// The primary function for handling chat requests.
// It accepts the conversation history and, crucially, an optional 'member' object.
// If 'member' is provided, it initiates a solo chat. Otherwise, it's a group chat.
export const getChatResponseStream = async (history: ChatMessage[], group: Group, member?: Member) => {
    const contents = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    return ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            // The system instruction is dynamically generated based on whether it's a group or solo chat.
            systemInstruction: getSystemInstruction(group, member),
        },
    });
};


export const generateWallpaper = async (prompt: string, group: Group, style: string): Promise<string> => {
    const groupSpecifics = {
        'skz': "a vibrant, modern style with dynamic visuals, strong contrasts, and bright accents, creating an energetic and performance-oriented atmosphere.",
        'txt': "a bright, imaginative, and fantastical style, incorporating elements of nature with soft, light color palettes.",
        'enhypen': "an elegant, polished, and thematic style, often with a storytelling feel, using a rich and harmonious color palette.",
    };
    
    const stylePrefixes: { [key: string]: string } = {
        photorealistic: `high-fashion, photorealistic concept photo`,
        anime: `beautiful, high-quality anime fan art illustration`,
        painting: `detailed, expressive digital painting in a fan art style`,
    };

    const styleDescription = stylePrefixes[style] || stylePrefixes['photorealistic'];

    // Updated prompt to be less likely to trigger safety filters by focusing on the artistic concept.
    const fullPrompt = `A 4K phone wallpaper for the K-POP group ${group.name}. The image is a ${styleDescription}, inspired by the theme: "${prompt}". The art should capture the group's signature aesthetic: ${groupSpecifics[group.id as keyof typeof groupSpecifics]}. Emphasize the overall mood and style rather than creating exact portraits of the members.`;
    
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '9:16',
            },
        });

        if (response?.generatedImages?.[0]?.image?.imageBytes) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            console.error("Failed to generate wallpaper. The API returned no images. Full response:", JSON.stringify(response, null, 2));
            throw new Error("The AI was unable to create an image. This might be due to a restrictive safety filter or a temporary issue. Please try a different or more general prompt.");
        }
    } catch(error) {
        console.error("Error calling the generateImages API:", error);
        if (error instanceof Error && error.message.startsWith("The AI was unable")) {
            throw error;
        }
        throw new Error("An error occurred while communicating with the image generation service. Please try again later.");
    }
};

export const generateQuiz = async (group: Group): Promise<QuizQuestion[]> => {
    const prompt = `Create a fun, multiple-choice quiz with 5 questions for a "biggest fan" questionnaire about the K-POP group ${group.name}. The questions should cover member details, song trivia, and iconic moments. Ensure one option is correct and the others are plausible but incorrect.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        correctAnswer: { type: Type.STRING }
                    },
                    required: ["question", "options", "correctAnswer"]
                }
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        const quizData = JSON.parse(jsonText);
        return quizData as QuizQuestion[];
    } catch (e) {
        console.error("Failed to parse quiz JSON:", e);
        throw new Error("Could not generate a valid quiz.");
    }
};

export const rewriteFunFact = async (fact: string, memberName: string): Promise<string> => {
    const prompt = `You are a K-POP fan blog writer. Rewrite this fun fact about ${memberName} to be more exciting and engaging for a fan, but keep the core information the same. Keep it concise (1-2 sentences). Original fact: "${fact}"`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text.trim();
};

export const generateIntroduction = async (member: Member, groupName: string): Promise<string> => {
    const prompt = `You are a K-POP fan blog writer. Write a short, exciting, and personal introduction (2-3 sentences) for ${member.name} from the group ${groupName}. Capture their essence using these details:
- Personality: ${member.personality}
- Role: ${member.role}
- A fun fact: ${member.funFact}
- An iconic line they've said: "${member.iconicLine}"
The tone should be engaging and informal, perfect for a fan who wants to get to know them. Keep it concise.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text.trim();
};

export const generateLyricsForAlbum = async (group: Group, album: Album): Promise<{ title: string; lyrics: string; }[]> => {
    const tracklistString = album.tracklist.map(t => `"${t}"`).join(', ');

    const groupSpecifics = {
        'skz': "a powerful, edgy, performance-focused aesthetic with industrial or dystopian elements.",
        'txt': "a dreamy, magical, and ethereal aesthetic from a cohesive fictional universe.",
        'enhypen': "a dark, elegant, and vampiric aesthetic.",
    };

    const prompt = `You are a creative songwriter for the K-POP group ${group.name}.
    Their general aesthetic is ${groupSpecifics[group.id as keyof typeof groupSpecifics]}.
    Generate plausible song lyrics for every song on their album "${album.title}", released in the "${album.era}" era.
    The tracklist is: ${tracklistString}.
    For each song, provide lyrics that fit the song title and the group's overall concept. The lyrics should be formatted with verses and choruses, using newline characters (\\n).
    Return the result as a JSON array of objects, where each object has a "title" key (matching the tracklist) and a "lyrics" key.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "The title of the song." },
                        lyrics: { type: Type.STRING, description: "The generated lyrics for the song." }
                    },
                    required: ["title", "lyrics"]
                }
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        const lyricsData = JSON.parse(jsonText);
        if (Array.isArray(lyricsData) && lyricsData.length > 0) {
            return lyricsData as { title: string; lyrics: string; }[];
        }
        throw new Error("AI returned invalid or empty lyrics data.");
    } catch (e) {
        console.error("Failed to parse lyrics JSON:", e);
        throw new Error("Could not generate valid lyrics.");
    }
};
