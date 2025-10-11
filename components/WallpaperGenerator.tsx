import React, { useState } from 'react';
import { Group } from '../types';
import { generateWallpaper } from '../services/geminiService';
import { Icon } from './common/Icon';
import Spinner from './common/Spinner';

interface WallpaperGeneratorProps {
  group: Group;
}

const allSuggestions = {
  skz: {
    memberPrompts: [
      { name: "Bang Chan", prompt: "A photorealistic portrait of Bang Chan as his avatar Wolf Chan, leading his pack under a full moon." },
      { name: "Lee Know", prompt: "Anime fan art of Lee Know with his quirky charm, surrounded by his three cats Sooni, Doongi, and Dori." },
      { name: "Changbin", prompt: "A powerful digital painting of Changbin embodying his 'Dwaekki' (pig-rabbit) persona with a dark, confident aura." },
      { name: "Hyunjin", prompt: "A dramatic and artistic digital painting of Hyunjin, dancing gracefully like his ferret avatar." },
      { name: "Han", prompt: "A cute anime scene of Han as a happy Quokka, enjoying a giant slice of cheesecake." },
      { name: "Felix", prompt: "A photorealistic image of Felix with his sunshine personality, glowing freckles, and baking brownies in a cozy kitchen." },
      { name: "Seungmin", prompt: "A dandy and sweet portrait of Seungmin, like a loyal puppy, studying in a library with a DAY6 album nearby." },
      { name: "I.N", prompt: "The charming maknae I.N as a Fennec Fox, smiling brightly in a field of flowers, rendered in a soft anime style." },
    ],
    eraPrompts: [
      { era: "ODDINARY", prompts: [
          { name: "Maniac Vibe", prompt: "The members as eccentric scientists in a strange laboratory, inspired by the 'Maniac' music video." },
          { name: "Venom Concept", prompt: "A dark, spider-themed concept with webs and shadows, capturing the feel of 'Venom'." },
          { name: "Charmer Aesthetic", prompt: "A hypnotic, snake-charmer theme with mystical elements and captivating poses." },
        ] 
      },
      { era: "MAXIDENT", prompts: [
          { name: "Case 143 Love", prompt: "A cute, slightly chaotic scene of the members as heart-stealing detectives for 'Case 143'." },
          { name: "Heart Monsters", prompt: "The members fighting or befriending giant, fluffy heart monsters from the music video." },
          { name: "Pink & Blue", prompt: "A bright, pop-art style wallpaper using the pink and blue color scheme of the era." },
        ] 
      },
      { era: "★★★★★ (5-STAR)", prompts: [
          { name: "S-Class Heroes", prompt: "The members as confident, high-fashion superheroes in a bustling cityscape, like in 'S-Class'." },
          { name: "Outer Space", prompt: "A cosmic theme with the members floating among stars and planets." },
          { name: "Super Bowl Party", prompt: "A fun, energetic party scene with a luxurious 'Super Bowl' feast." },
        ] 
      },
      { era: "樂-STAR (ROCK-STAR)", prompts: [
          { name: "LALALALA Rock", prompt: "Stray Kids as a legendary rock band performing on a massive stage with fireworks for 'LALALALA'." },
          { name: "Conductor Hyunjin", prompt: "Hyunjin as the dramatic orchestra conductor from the 'LALALALA' music video." },
          { name: "Behind the Scenes", prompt: "A candid, backstage rockstar concept with instruments and stage equipment." },
        ] 
      },
    ]
  },
  txt: {
    memberPrompts: [
        { name: "Soobin", prompt: "A soft, dreamy painting of Soobin the giant bunny, shyly peeking from behind a giant loaf of bread." },
        { name: "Yeonjun", prompt: "The legendary trainee Yeonjun as a fashionable fox, striking a dynamic pose in a high-fashion outfit." },
        { name: "Beomgyu", prompt: "Mischievous Beomgyu as a playful bear, holding an acoustic guitar in a magical forest." },
        { name: "Taehyun", prompt: "The mature and magical Taehyun, like a wise cat, performing a dazzling card trick under spotlights." },
        { name: "Huening Kai", prompt: "A cheerful anime illustration of Huening Kai surrounded by his favorite plushies, with a chaotic laugh bubble." },
    ],
    eraPrompts: [
        { era: "The Dream Chapter", prompts: [
            { name: "CROWN Horns", prompt: "A fantasy illustration of the members with glowing horns, discovering their unique powers." },
            { name: "9 and Three Quarters", prompt: "The members running into a magical train station, ready for an adventure." },
            { name: "Magic Island", prompt: "A serene scene on a mystical island from 'Magic Island', with floating lights." },
        ]},
        { era: "The Chaos Chapter", prompts: [
            { name: "0X1=Lovesong Anguish", prompt: "An emotional, grunge-aesthetic scene capturing the raw feeling of '0X1=Lovesong'." },
            { name: "Anti-Romantic", prompt: "A minimalist, melancholic wallpaper about heartbreak in the 'Anti-Romantic' style." },
            { name: "Frost Kingdom", prompt: "The members as ice princes in a frozen, mythical kingdom, from the 'Frost' concept." },
        ]},
        { era: "The Name Chapter", prompts: [
            { name: "Sugar Rush Ride", prompt: "A dreamy, ethereal scene of the members in Neverland for 'Sugar Rush Ride'." },
            { name: "Devil by the Window", prompt: "A tempting, dark academia concept inspired by 'Devil by the Window'." },
            { name: "Chasing That Feeling", prompt: "The members in a retro, synth-wave city, 'Chasing That Feeling'." },
        ]},
    ]
  },
  enhypen: {
    memberPrompts: [
        { name: "Jungwon", prompt: "Leader Jungwon with his iconic dimples, embodying a chic and cute cat in a stylish suit." },
        { name: "Heeseung", prompt: "The ace Heeseung as a graceful deer in an enchanted forest, looking ethereal." },
        { name: "Jay", prompt: "Passionate Jay as a soaring eagle, dressed in a high-fashion, rock-inspired outfit." },
        { name: "Jake", prompt: "The lovable Jake as a happy golden retriever, playing in a sunny field with his dog Layla." },
        { name: "Sunghoon", prompt: "The 'Ice Prince' Sunghoon as a penguin, figure skating gracefully on a frozen, starlit lake." },
        { name: "Sunoo", prompt: "Sunshine Sunoo as a desert fox, taking a perfect selfie with a bright, contagious smile." },
        { name: "Ni-ki", prompt: "Dance prodigy Ni-ki as a powerful puma, captured mid-air in a dynamic dance move." },
    ],
    eraPrompts: [
        { era: "BORDER", prompts: [
            { name: "Given-Taken Thrones", prompt: "The members as young, elegant vampires sitting on ornate thrones, from 'Given-Taken'." },
            { name: "Debut Ethereal", prompt: "An ethereal, dreamlike concept celebrating their debut." },
            { name: "Let Me In", prompt: "A mysterious scene of the members beckoning from behind a grand, slightly open door." },
        ]},
        { era: "DIMENSION", prompts: [
            { name: "Tamed-Dashed Rugby", prompt: "An energetic, youthful scene of the members playing rugby on a bright, sunny day." },
            { name: "Go Big or Go Home", prompt: "A fun party scene with confetti and vibrant colors for 'Go Big or Go Home'." },
            { name: "Upper Side Dreamin'", prompt: "A luxurious, high-society concept with the members in fancy attire." },
        ]},
        { era: "BLOOD", prompts: [
            { name: "Bite Me Vampires", prompt: "The members as charming, dark vampires in a gothic castle for 'Bite Me'." },
            { name: "Sacrifice Fantasy", prompt: "A dark fantasy concept showing the members' powerful and sacrificial bonds." },
            { name: "Sweet Venom Myth", prompt: "A modern take on ancient myths, with sleek outfits and a 'Sweet Venom' allure." },
        ]},
    ]
  }
};


const loadingMessages = [
    "Conjuring some magic...",
    "Painting with starlight...",
    "Mixing colors of the cosmos...",
    "Asking the muses for inspiration...",
    "Generating a masterpiece...",
];

const styleOptions = [
    { id: 'photorealistic', name: 'Photorealistic' },
    { id: 'anime', name: 'Anime Fan Art' },
    { id: 'painting', name: 'Digital Painting' },
];


const WallpaperGenerator: React.FC<WallpaperGeneratorProps> = ({ group }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('photorealistic');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  
  const suggestions = allSuggestions[group.id as keyof typeof allSuggestions];

  const handleSuggestionClick = (suggestionPrompt: string) => {
    setPrompt(suggestionPrompt);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);

    const messageInterval = setInterval(() => {
        setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    }, 2000);

    try {
      const imageUrl = await generateWallpaper(prompt, group, selectedStyle);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
      clearInterval(messageInterval);
    }
  };
  
  const handleDownload = () => {
      if (!generatedImage) return;
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `kpop-universe-${group.id}-${Date.now()}.jpeg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-center">AI Wallpaper Generator</h2>
      <p className="text-center text-white/80 mb-6 max-w-md">
        Create a unique iPhone wallpaper for <strong className="text-[var(--accent-color)]">{group.name}</strong>. Describe the vibe, colors, or members you want to see!
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {styleOptions.map((style) => (
          <button
            key={style.id}
            onClick={() => setSelectedStyle(style.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
              selectedStyle === style.id
                ? 'bg-[var(--accent-color)] text-[var(--primary-color)]'
                : 'bg-black/50 text-white/80 hover:bg-white/20'
            }`}
          >
            {style.name}
          </button>
        ))}
      </div>

      <form onSubmit={handleGenerate} className="w-full max-w-lg flex flex-col sm:flex-row items-center gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'a dreamy, cyberpunk vibe'"
          className="flex-grow w-full bg-white/10 border border-white/20 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !prompt.trim()} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--accent-color)] text-[var(--primary-color)] font-bold py-3 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
          {isLoading ? <Spinner/> : <Icon icon="sparkles" className="w-5 h-5"/>}
          Generate
        </button>
      </form>

      <div className="mt-8 w-full max-w-lg text-left">
          <h3 className="text-lg font-semibold text-white/90 mb-3 text-center">Need ideas? Try one of these!</h3>
          
          {suggestions && (
            <>
              {/* Member Prompts */}
              <div className="mb-4">
                  <h4 className="font-bold text-[var(--accent-color)] mb-2">Member Spotlight</h4>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {suggestions.memberPrompts.map((p) => (
                          <button 
                              key={p.name} 
                              onClick={() => handleSuggestionClick(p.prompt)}
                              title={p.prompt}
                              className="flex-shrink-0 px-3 py-1.5 text-sm bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-colors whitespace-nowrap"
                          >
                              {p.name}
                          </button>
                      ))}
                  </div>
              </div>
              
              {/* Era Prompts */}
              {suggestions.eraPrompts.map(era => (
                  <div key={era.era} className="mb-4">
                      <h4 className="font-bold text-[var(--accent-color)] mb-2">{era.era} Era</h4>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                          {era.prompts.map((p, i) => (
                              <button
                                  key={`${era.era}-${i}`}
                                  onClick={() => handleSuggestionClick(p.prompt)}
                                  title={p.prompt}
                                  className="flex-shrink-0 px-3 py-1.5 text-sm bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-colors whitespace-nowrap"
                              >
                                  {p.name}
                              </button>
                          ))}
                      </div>
                  </div>
              ))}
            </>
          )}
      </div>

      <div className="mt-8 w-full flex justify-center items-center h-96">
        {isLoading && (
            <div className="text-center">
                <Spinner large={true} />
                <p className="mt-4 text-white/80 animate-pulse">{loadingMessage}</p>
            </div>
        )}
        {error && <p className="text-red-400 text-center">{error}</p>}
        {generatedImage && (
            <div className="flex flex-col items-center gap-4">
                <img src={generatedImage} alt="Generated wallpaper" className="max-h-96 rounded-2xl shadow-2xl border-2 border-[var(--accent-color)]"/>
                <button 
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 bg-white/20 text-white font-bold py-2 px-6 rounded-full hover:bg-white/30 transition-colors"
                >
                    <Icon icon="download" className="w-5 h-5"/>
                    Download
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default WallpaperGenerator;