
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
      { name: "Bang Chan", prompt: "Hyper-realistic 3D render of a producer resembling Bang Chan in a futuristic music studio. Cinematic lighting from holographic interfaces illuminates his focused expression. A subtle wolf emblem glows on his headphones." },
      { name: "Lee Know", prompt: "Cinematic 3D render of a dancer with sharp features like Lee Know, executing a powerful, graceful move. Ethereal, glowing cat-like apparitions swirl around him in a dark, minimalist space." },
      { name: "Changbin", prompt: "Dynamic 3D render of a rapper inspired by Changbin, on a gritty, rain-slicked city stage under neon lights. His energy is palpable as he performs, with 'Dwaekki' graffiti art subtly visible in the background." },
      { name: "Hyunjin", prompt: "An artistic, hyper-realistic 3D portrait of a dramatic prince who looks like Hyunjin, with flowing hair and a tear glistening on his cheek. He's surrounded by impossibly beautiful, glowing digital roses." },
      { name: "Han", prompt: "Energetic, hyper-realistic 3D render of a creative genius resembling Han, sitting on a floating island made of giant cheesecake slices. Musical notes and witty remarks materialize as glowing text around him." },
      { name: "Felix", prompt: "A breathtaking, photorealistic 3D scene of a character with Felix's sunshine-like aura and freckles that shimmer like pixie dust. He's surrounded by golden light, with deep bass soundwaves rendered as visible, shimmering particles in the air." },
      { name: "Seungmin", prompt: "Soft-focus, hyper-realistic 3D render of a vocalist similar to Seungmin in a cozy, sunlit room. He sings into a vintage microphone, and the sound waves transform into delicate, glowing flower petals." },
      { name: "I.N", prompt: "Charming, hyper-realistic 3D render of the youngest member of a group, inspired by I.N, with a playful smile. He's in a whimsical, dream-like environment with subtle fennec fox motifs and glowing bread floating gently in the background." },
    ],
    eraPrompts: [
      { era: "ODDINARY", prompts: [
          { name: "Maniac Lab", prompt: "Fanart scene inspired by the 'Maniac' MV, showing the members as eccentric scientists with mismatched outfits and wild hair, surrounded by bubbling beakers and loose screws in a surreal, slightly tilted laboratory." },
          { name: "Venom's Web", prompt: "Dark, intricate fanart depicting the members with spider-like motifs in their outfits, caught in a giant, glowing web. High contrast, dramatic shadows, inspired by 'Venom'." },
          { name: "Charmer's Flute", prompt: "Mystical fanart of the members as captivating snake charmers, with glowing eyes and intricate patterns. A large, stylized serpent is coiled around them, evoking the 'Charmer' aesthetic." },
        ] 
      },
      { era: "MAXIDENT", prompts: [
          { name: "Case 143 Detectives", prompt: "Cute, chaotic fanart of the members as clumsy but determined 'love detectives' from the 'Case 143' MV, chasing after a giant, fluffy pink heart monster." },
          { name: "Heart Monster Pop-Art", prompt: "A vibrant, pop-art style fanart piece featuring the pink and blue heart monsters from the MAXIDENT era, with the members' silhouettes inside the hearts." },
          { name: "Graphic Style", prompt: "A stylish graphic fanart piece using the bold pink, blue, and black color palette of the MAXIDENT album art, with abstract shapes and the members' names integrated." },
        ] 
      },
      { era: "★★★★★ (5-STAR)", prompts: [
          { name: "S-Class Superheroes", prompt: "Epic fanart of Stray Kids as high-fashion superheroes, standing triumphantly on a Seoul skyscraper, overlooking the city they protect. 'S-Class' inspired, with unique powers hinted for each member." },
          { name: "Cosmic Voyage", prompt: "Cosmic fanart inspired by the '5-STAR' visuals, with the members as constellations or celestial beings floating gracefully through a star-filled galaxy." },
          { name: "Super Bowl Feast", prompt: "Energetic fanart of a luxurious 'Super Bowl' celebration, with the members enjoying a ridiculously lavish feast. Confident, playful, and a bit chaotic." },
        ] 
      },
      { era: "樂-STAR (ROCK-STAR)", prompts: [
          { name: "Rockstar Performance", prompt: "High-octane fanart of Stray Kids as a legendary rock band mid-performance on a massive, electrifying stage. Pyrotechnics, lasers, and a massive cheering crowd, capturing the energy of 'LALALALA'." },
          { name: "Conductor Hyunjin", prompt: "Dramatic fanart painting focusing on Hyunjin as the passionate orchestra conductor from the 'LALALALA' intro, with explosive energy and musical notes flying around him." },
          { name: "Backstage Moment", prompt: "Candid-style fanart of the members backstage after a concert, looking exhausted but happy, surrounded by instruments and stage equipment. A quieter, more intimate rockstar moment." },
        ] 
      },
    ]
  },
  txt: {
    memberPrompts: [
      { name: "Soobin", prompt: "Soft, pastel-colored fanart of Soobin's representative animal, a shy giant bunny, peeking over a mountain of bread. Gentle, cozy, and dreamy aesthetic." },
      { name: "Yeonjun", prompt: "Fashion magazine cover style fanart of Yeonjun's representative animal, a desert fox, dressed in a trendy, avant-garde outfit. Confident '4th Gen It Boy' energy, with bold typography." },
      { name: "Beomgyu", prompt: "Chaotic and cute fanart of Beomgyu's representative animal, a mischievous bear, playing an electric guitar in a glowing, magical forest. He's the energetic mood-maker of the group." },
      { name: "Taehyun", prompt: "Cool and composed fanart of Taehyun's representative animal, a clever cat, performing a magic trick with glowing cards. The background is a library, reflecting his mature, intelligent personality." },
      { name: "Huening Kai", prompt: "Adorable fanart of Huening Kai's representative animal, a penguin, happily buried in a mountain of plushies. His dolphin-like laugh is visualized as musical notes. Innocent, bright, and musical." },
    ],
    eraPrompts: [
        { era: "The Dream Chapter", prompts: [
            { name: "CROWN's Magic", prompt: "Ethereal fanart of the members with glowing horns from 'CROWN', set in a magical, starlit landscape from The Dream Chapter." },
            { name: "Run Away", prompt: "Whimsical fanart of the members discovering the magic door from '9 and Three Quarters (Run Away)', with an enchanted forest visible through the doorway." },
            { name: "Magic Island", prompt: "Serene, painterly fanart of the members around a campfire on the mystical 'Magic Island', with a giant, friendly ghost whale in the starry sky above." },
        ]},
        { era: "The Chaos Chapter", prompts: [
            { name: "0X1=Lovesong", prompt: "Emotional fanart in a pop-punk, grunge aesthetic for '0X1=Lovesong', showing the members looking angsty in a beat-up car under a dramatic, stormy sky." },
            { name: "Anti-Romantic", prompt: "A minimalist, melancholic fanart piece with a single rose losing its petals in a stark, cold room, capturing the 'Anti-Romantic' vibe." },
            { name: "Frost Princes", prompt: "Dynamic action fanart of the members as powerful ice princes battling in a frozen, mythical kingdom, from the 'Frost' concept." },
        ]},
        { era: "The Name Chapter", prompts: [
            { name: "Sugar Rush Ride", prompt: "Dreamy, pastel fanart of the members in a Peter Pan-inspired Neverland for 'Sugar Rush Ride', with sparkling fairy dust and a sweet, tempting atmosphere." },
            { name: "Temptation", prompt: "Seductive fanart inspired by the 'The Name Chapter: Temptation' concept photos, with the members as alluring fallen angels in a lush, green paradise." },
            { name: "Chasing That Feeling", prompt: "Retro-futuristic fanart of the members in a neon-lit, 80s-inspired city, capturing the synth-wave aesthetic of 'Chasing That Feeling'." },
        ]},
    ]
  },
  enhypen: {
    memberPrompts: [
      { name: "Jungwon", prompt: "Fanart of Jungwon's representative animal, a chic but cute black cat, displaying his signature dimples. The cat wears a small, elegant leader's crown." },
      { name: "Heeseung", prompt: "Majestic fanart of Heeseung's representative animal, a noble deer, with glowing antlers in a moonlit, magical forest. The 'ace' of the group." },
      { name: "Jay", prompt: "Fierce fanart of Jay's representative animal, an eagle, with a rock-and-roll edge, wearing a tiny leather jacket. Captures his passionate, high-energy 'RAS' personality." },
      { name: "Jake", prompt: "Heartwarming fanart of Jake's representative animal, a happy golden retriever (like his dog Layla), playing in a sunny field in Australia. Sweet, kind, and loyal vibe." },
      { name: "Sunghoon", prompt: "Elegant fanart of Sunghoon's representative animal, a penguin, figure skating gracefully on a frozen lake under the stars. The 'Ice Prince' leaving shimmering trails on the ice." },
      { name: "Sunoo", prompt: "Bright and bubbly fanart of Sunoo's representative animal, a desert fox, taking a perfect selfie. The scene is filled with sunshine, sparkles, and aegyo." },
      { name: "Ni-ki", prompt: "Dynamic fanart of Ni-ki's representative animal, a sleek black puma, captured mid-leap in a powerful dance move under a single, dramatic spotlight. The 'dance prodigy' maknae." },
    ],
    eraPrompts: [
        { era: "BORDER", prompts: [
            { name: "Given-Taken", prompt: "Gothic fanart of the members as newly-turned, elegant vampires in an old, grand library, with light streaming from a high window, capturing the 'Given-Taken' dilemma." },
            { name: "Let Me In", prompt: "Mysterious fanart of a single member beckoning the viewer into a fantastical, carnival-like world from 'Let Me In (20 Cube)'." },
            { name: "Debut Liminality", prompt: "Ethereal fanart depicting the members standing on a surreal, shifting border between light and dark, day and night, symbolizing their debut concept." },
        ]},
        { era: "DIMENSION", prompts: [
            { name: "Tamed-Dashed", prompt: "High-energy, bright fanart of the members in retro rugby uniforms, caught mid-action in a dynamic game on a sunny beach, capturing the 'Tamed-Dashed' youthful freedom." },
            { name: "Go Big or Go Home", prompt: "Confetti-filled fanart of the members having the time of their lives at a vibrant, chaotic house party, inspired by 'Go Big or Go Home'." },
            { name: "Dilemma", prompt: "Surrealist fanart inspired by 'Dimension: Dilemma', with members in a strange, MC Escher-like space with floating doors and conflicting visual themes." },
        ]},
        { era: "BLOOD", prompts: [
            { name: "Bite Me", prompt: "Darkly romantic fanart of the members as ancient, alluring vampires in a gothic ballroom, with intricate, dark fantasy outfits from the 'Bite Me' era." },
            { name: "Sweet Venom", prompt: "Modern fantasy fanart of the members as mythological beings with a 'sweet but deadly' allure, in a sleek, neon-lit urban setting. Inspired by 'Sweet Venom'." },
            { name: "Sacrifice", prompt: "Dramatic fanart depicting the powerful, unbreakable bond between the members, with themes of sacrifice and dark fantasy elements from 'Sacrifice (Eat Me Up)'." },
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
