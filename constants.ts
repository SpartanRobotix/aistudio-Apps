import { Group } from './types';

export const GROUPS: Group[] = [
  {
    id: 'skz',
    name: 'Stray Kids',
    emojis: '❤️‍🔥🐺',
    theme: {
      primary: '#1a1a1a',
      secondary: '#ffffff',
      accent: '#ff4757',
      gradient: 'linear-gradient(135deg, #ff4757 0%, #000000 100%)',
      background: 'https://images.alphacoders.com/135/1351147.jpeg'
    },
    members: [
      { id: 'bangchan', name: 'Bang Chan', birthDate: '1997-10-03', nationality: 'Korean-Australian', role: 'Leader, Producer, Vocalist, Rapper', animal: 'Wolf (Wolf Chan)', personality: 'Caring, responsible, hardworking, a bit goofy. Acts like a protective pack leader for his members.', funFact: 'He trained for 7 years and put the Stray Kids members together himself.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/10/Stray_Kids_Rock_Star_Rock_Roll_Teaser_Bang_Chan_1.jpg', nicknames: ['Chris', 'Kangaroo'], mbti: 'ENFJ', iconicLine: "I'm gonna make you feel, like you've never felt before.", introduction: '' },
      { id: 'leeknow', name: 'Lee Know', birthDate: '1998-10-25', nationality: 'Korean', role: 'Dancer, Vocalist', animal: 'Cat (Leebit)', personality: 'Savage, funny, with a quirky and eccentric personality. Shows affection in his own unique, often teasing way.', funFact: 'He was a backup dancer for BTS and has three cats: Sooni, Doongi, and Dori.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/10/Stray_Kids_Rock_Star_Rock_Roll_Teaser_Lee_Know_1.jpg', nicknames: ['Lino', 'Bundle-Know'], mbti: 'ISFP', iconicLine: "You know? I know. We know. Lee Know.", introduction: '' },
      { id: 'changbin', name: 'Changbin', birthDate: '1999-08-11', nationality: 'Korean', role: 'Rapper, Producer', animal: 'Pabbit (Dwaekki)', personality: 'Loves dark concepts but is actually very cheerful and talkative. Acts tough but is a softie inside. Confidence is his key trait.', funFact: 'His motto is "Let\'s live with a positive mind, enjoy life."', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/10/Stray_Kids_Rock_Star_Rock_Roll_Teaser_Changbin_1.jpg', nicknames: ['Binnie', 'Dwaekki'], mbti: 'ENFP', iconicLine: "I love dark.", introduction: '' },
      { id: 'hyunjin', name: 'Hyunjin', birthDate: '2000-03-20', nationality: 'Korean', role: 'Dancer, Rapper, Visual', animal: 'Ferret (Jiniret)', personality: 'Dramatic, passionate, and artistic. Very emotional and puts his heart into everything he does. Known for his captivating stage presence.', funFact: 'He is allergic to cat fur but loves his dog Kkami.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/10/Stray_Kids_Rock_Star_Rock_Roll_Teaser_Hyunjin_1.jpg', nicknames: ['Jinnie', 'Drama Llama'], mbti: 'INFP', iconicLine: "You make Stray Kids STAY.", introduction: '' },
      { id: 'han', name: 'Han', birthDate: '2000-09-14', nationality: 'Korean', role: 'Rapper, Vocalist, Producer', animal: 'Quokka (Han Quokka)', personality: 'All-rounder, funny, and a bit of a scaredy-cat. Can switch from energetic to serious in seconds. Known for his witty remarks.', funFact: 'He used to live and study in Malaysia and has a fear of ghosts.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/10/Stray_Kids_Rock_Star_Rock_Roll_Teaser_Han_1.jpg', nicknames: ['J.ONE', 'Squirrel'], mbti: 'ISTP', iconicLine: "Cheesecake~ It's so delicious!", introduction: '' },
      { id: 'felix', name: 'Felix', birthDate: '2000-09-15', nationality: 'Korean-Australian', role: 'Dancer, Rapper', animal: 'Chick (BbokAri)', personality: 'Sunshine personality, known for his shockingly deep voice. Very sweet, caring, and loves baking brownies for the members.', funFact: 'His freckles are his charming point and he is a master of mosquito noises.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/10/Stray_Kids_Rock_Star_Rock_Roll_Teaser_Felix_1.jpg', nicknames: ['Yongbok', 'Haengbokie'], mbti: 'ESFJ', iconicLine: "Cooking like a chef, I'm a 5-star Michelin.", introduction: '' },
      { id: 'seungmin', name: 'Seungmin', birthDate: '2000-09-22', nationality: 'Korean', role: 'Vocalist', animal: 'Puppy (PuppyM)', personality: 'Savage yet sweet. Loves to tease his members. Very diligent, a clean freak, and loves his vocal practice.', funFact: 'He dreamed of being a baseball player when he was young and is a huge fan of the band DAY6.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/10/Stray_Kids_Rock_Star_Rock_Roll_Teaser_Seungmin_1.jpg', nicknames: ['Minnie', 'Dandy Boy'], mbti: 'ISFJ', iconicLine: "My Day~", introduction: '' },
      { id: 'in', name: 'I.N', birthDate: '2001-02-08', nationality: 'Korean', role: 'Vocalist, Maknae', animal: 'Fennec Fox (FoxI.Ny)', personality: 'Clumsy but charming. Was very shy but has become more outgoing. The beloved youngest member who gets away with everything.', funFact: 'He had braces for over 5 years and loves to sing trot music.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/10/Stray_Kids_Rock_Star_Rock_Roll_Teaser_IN_1.jpg', nicknames: ['Ayen', 'Fennec Fox'], mbti: 'INFP', iconicLine: "Bread is good.", introduction: '' },
    ],
    discography: [
      { title: 'GO生 (GO LIVE)', releaseDate: '2020-06-17', era: 'GO LIVE / IN LIFE', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/3/33/Stray_Kids_-_Go_Live.png', tracklist: ["God's Menu", "Easy", "Pacemaker"] },
      { title: 'IN生 (IN LIFE)', releaseDate: '2020-09-14', era: 'GO LIVE / IN LIFE', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/9/91/Stray_Kids_-_In_Life.png', tracklist: ["Back Door", "B Me", "Any"] },
      { title: 'NOEASY', releaseDate: '2021-08-23', era: 'NOEASY', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e4/Stray_Kids_-_Noeasy.png', tracklist: ["Thunderous", "Domino", "Ssick", "The View"] },
      { title: 'ODDINARY', releaseDate: '2022-03-18', era: 'ODDINARY', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Stray_Kids_-_Oddinary.png', tracklist: ["Venom", "Maniac", "Charmer", "Freeze"] },
      { title: 'MAXIDENT', releaseDate: '2022-10-07', era: 'MAXIDENT', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b2/Stray_Kids_-_Maxident.png', tracklist: ["Case 143", "Chill", "Give Me Your TMI"] },
      { title: '★★★★★ (5-STAR)', releaseDate: '2023-06-02', era: '5-STAR', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Stray_Kids_-_5-Star.png', tracklist: ["S-Class", "Item", "Super Bowl", "Topline (feat. Tiger JK)"] },
      { title: '樂-STAR (ROCK-STAR)', releaseDate: '2023-11-10', era: 'ROCK-STAR', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c5/Stray_Kids_-_Rock-Star.png', tracklist: ["MEGAVERSE", "LALALALA", "BLIND SPOT", "COMFLEX", "Cover Me", "Leave"] },
    ]
  },
  {
    id: 'txt',
    name: 'TOMORROW X TOGETHER',
    emojis: '💙✨',
    theme: {
      primary: '#82c9ff',
      secondary: '#1e3a8a',
      accent: '#ffffff',
      gradient: 'linear-gradient(135deg, #82c9ff 0%, #ffffff 100%)',
      background: 'https://images6.alphacoders.com/134/1343750.jpeg'
    },
    members: [
      { id: 'soobin', name: 'Soobin', birthDate: '2000-12-05', nationality: 'Korean', role: 'Leader, Vocalist', animal: 'Rabbit', personality: 'Shy but sweet. A caring leader who is a bit clumsy. Loves bread and has a soft spot for his members.', funFact: 'He can\'t live without almond milk and is known for his very stretchy skin.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/09/TXT_The_Name_Chapter_Freefall_Reality_Soobin_1.jpg', nicknames: ['Giant Bunny', 'Cucumber'], mbti: 'ISFP', iconicLine: "This is my bread shuttle.", introduction: '' },
      { id: 'yeonjun', name: 'Yeonjun', birthDate: '1999-09-13', nationality: 'Korean', role: 'Rapper, Dancer, Vocalist', animal: 'Fox', personality: 'Playful and energetic. Known as the "4th Gen It Boy". A fashionista who loves to eat and is a master of dad jokes.', funFact: 'He is the oldest member but acts like the youngest sometimes. He was BigHit\'s "Legendary Trainee".', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/09/TXT_The_Name_Chapter_Freefall_Reality_Yeonjun_1.jpg', nicknames: ['YJ', '4th Gen It Boy'], mbti: 'ENFP', iconicLine: "YEONJUN IS HERE!", introduction: '' },
      { id: 'beomgyu', name: 'Beomgyu', birthDate: '2001-03-13', nationality: 'Korean', role: 'Vocalist, Dancer, Center', animal: 'Bear', personality: 'Mischievous and the mood-maker of the group. Very talkative and has a bright, energetic personality.', funFact: 'He is very good at playing the guitar and writes his own songs. He is from Daegu.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/09/TXT_The_Name_Chapter_Freefall_Reality_Beomgyu_1.jpg', nicknames: ['Gyu', 'Bamgyu'], mbti: 'ISFP', iconicLine: "Because I'm Beomgyu.", introduction: '' },
      { id: 'taehyun', name: 'Taehyun', birthDate: '2002-02-05', nationality: 'Korean', role: 'Vocalist, Dancer', animal: 'Cat', personality: 'Calm, composed, and very mature for his age. Passionate and logical. The "brain" of the group.', funFact: 'He used to make educational videos on how to speak English and is a talented magician.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/09/TXT_The_Name_Chapter_Freefall_Reality_Taehyun_1.jpg', nicknames: ['Genius Taehyun', 'Terry'], mbti: 'ESTP', iconicLine: "Who is the king? Who is the boss?", introduction: '' },
      { id: 'hueningkai', name: 'Huening Kai', birthDate: '2002-08-14', nationality: 'Korean-American', role: 'Vocalist, Maknae', animal: 'Penguin', personality: 'Cheerful, optimistic, and loves plushies. Has a very infectious and chaotic laugh.', funFact: 'He can play many instruments, including piano and drums, and comes from a very musical family.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/09/TXT_The_Name_Chapter_Freefall_Reality_Huening_Kai_1.jpg', nicknames: ['Hyuka', 'Kai'], mbti: 'ISTP', iconicLine: "WOOOW!", introduction: '' },
    ],
    discography: [
        { title: 'The Dream Chapter: Star', releaseDate: '2019-03-04', era: 'The Dream Chapter', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/0/05/The_Dream_Chapter_Star.png', tracklist: ["Blue Orangeade", "Crown", "Our Summer"] },
        { title: 'The Dream Chapter: Magic', releaseDate: '2019-10-21', era: 'The Dream Chapter', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Tomorrow_X_Together_-_The_Dream_Chapter_Magic.png', tracklist: ["9 and Three Quarters (Run Away)", "Roller Coaster", "Angel or Devil"] },
        { title: 'Minisode1: Blue Hour', releaseDate: '2020-10-26', era: 'Minisode', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/6/62/TXT_-_Minisode1_Blue_Hour.png', tracklist: ["Ghosting", "We Lost the Summer", "Way Home"] },
        { title: 'The Chaos Chapter: Freeze', releaseDate: '2021-05-31', era: 'The Chaos Chapter', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e5/The_Chaos_Chapter_Freeze.png', tracklist: ["0X1=Lovesong (I Know I Love You) feat. Seori", "Anti-Romantic", "Magic"] },
        { title: 'The Name Chapter: Temptation', releaseDate: '2023-01-27', era: 'The Name Chapter', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/3/33/The_Name_Chapter_Temptation.png', tracklist: ["Sugar Rush Ride", "Devil by the Window", "Tinnitus (Wanna Be a Rock)"] },
        { title: 'The Name Chapter: FREEFALL', releaseDate: '2023-10-13', era: 'The Name Chapter', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b5/Txt_-_the_name_chapter_freefall.png', tracklist: ["Chasing That Feeling", "Growing Pain", "Back for More (TXT Ver.)", "Dreamer", "Deep Down"] },
    ]
  },
  {
    id: 'enhypen',
    name: 'ENHYPEN',
    emojis: '🤍🩸',
    theme: {
      primary: '#f1f2f6',
      secondary: '#a40000',
      accent: '#bfa06b', // gold
      gradient: 'linear-gradient(135deg, #f1f2f6 0%, #bfa06b 100%)',
      background: 'https://images2.alphacoders.com/134/1341178.jpeg'
    },
    members: [
      { id: 'jungwon', name: 'Jungwon', birthDate: '2004-02-09', nationality: 'Korean', role: 'Leader, Vocalist, Dancer', animal: 'Cat', personality: 'Chic but cute. A responsible leader with a quiet strength. Known for his dimples.', funFact: 'He was a Taekwondo athlete for 4 years.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/11/Enhypen_Orange_Blood_KSANA_Concept_Photos_Jungwon_1.jpg', nicknames: ['Yang Garden', 'Wonie'], mbti: 'ISTJ', iconicLine: "Let's go, let's go, let's go!", introduction: '' },
      { id: 'heeseung', name: 'Heeseung', birthDate: '2001-10-15', nationality: 'Korean', role: 'Vocalist, Dancer', animal: 'Deer', personality: 'The ace of the group. Very talented and confident, but also has a playful side. The oldest member.', funFact: 'He is close with the members of TXT as they trained together.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/11/Enhypen_Orange_Blood_KSANA_Concept_Photos_Heeseung_1.jpg', nicknames: ['Heedeungie', 'Ace'], mbti: 'INTP', iconicLine: "It's Heeseung, what can I do?", introduction: '' },
      { id: 'jay', name: 'Jay', birthDate: '2002-04-20', nationality: 'Korean-American', role: 'Rapper, Dancer', animal: 'Eagle', personality: 'Passionate and energetic. Can be a bit embarrassing for his members due to his high energy. Very fashionable.', funFact: 'He was born in Seattle, USA, and is known for his phrase "Resentment, Anger, and Shame".', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/11/Enhypen_Orange_Blood_KSANA_Concept_Photos_Jay_1.jpg', nicknames: ['Jongsaeng', 'Angry Bird'], mbti: 'ENFP', iconicLine: "RAS.", introduction: '' },
      { id: 'jake', name: 'Jake', birthDate: '2002-11-15', nationality: 'Korean-Australian', role: 'Rapper, Vocalist', animal: 'Dog', personality: 'Sweet and clumsy. A very lovable and kind-hearted person. He is the group\'s happy virus.', funFact: 'He has a dog named Layla and is known for his Australian accent.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/11/Enhypen_Orange_Blood_KSANA_Concept_Photos_Jake_1.jpg', nicknames: ['Jakey', 'Sim Jaeyun'], mbti: 'ISTJ', iconicLine: "Aussie Aussie Aussie, Oi Oi Oi!", introduction: '' },
      { id: 'sunghoon', name: 'Sunghoon', birthDate: '2002-12-08', nationality: 'Korean', role: 'Vocalist, Dancer, Visual', animal: 'Penguin', personality: 'Calm and composed, the "Ice Prince". Has a surprisingly goofy side. Very hardworking and disciplined.', funFact: 'He was a professional figure skater before becoming an idol and won multiple awards.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/11/Enhypen_Orange_Blood_KSANA_Concept_Photos_Sunghoon_1.jpg', nicknames: ['Ice Prince', 'Hoonding'], mbti: 'ISTJ', iconicLine: "I'm... handsome.", introduction: '' },
      { id: 'sunoo', name: 'Sunoo', birthDate: '2003-06-24', nationality: 'Korean', role: 'Vocalist', animal: 'Desert Fox', personality: 'Bright and energetic, the group\'s sunshine. Full of aegyo (cuteness) and loves taking selfies.', funFact: 'He is known for his expressive facials on stage and is the "selfie master" of the group.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/11/Enhypen_Orange_Blood_KSANA_Concept_Photos_Sunoo_1.jpg', nicknames: ['Ddeonu', 'Sunshine'], mbti: 'ENFP', iconicLine: "Did you see my aegyo?", introduction: '' },
      { id: 'ni-ki', name: 'Ni-ki', birthDate: '2005-12-09', nationality: 'Japanese', role: 'Dancer, Rapper, Maknae', animal: 'Puma', personality: 'The dance prodigy and youngest member. Can be mischievous and savage but is also very dedicated to his craft.', funFact: 'He was a backup dancer for SHINee and is considered one of the best dancers of the 4th generation.', avatarUrl: 'https://dbkpop.com/wp-content/uploads/2023/11/Enhypen_Orange_Blood_KSANA_Concept_Photos_Ni-ki_1.jpg', nicknames: ['Nishimura Riki', 'Dance Prodigy'], mbti: 'ENTJ', iconicLine: "It's my stage.", introduction: '' }
    ],
    discography: [
      { title: 'BORDER : DAY ONE', releaseDate: '2020-11-30', era: 'BORDER', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/07/ENHYPEN_-_BORDER_-_DAY_ONE.png/220px-ENHYPEN_-_BORDER_-_DAY_ONE.png', tracklist: ["Intro : Walk the Line", "Given-Taken", "Let Me In (20 CUBE)", "10 Months", "Flicker", "Outro : Cross the Line"] },
      { title: 'BORDER : CARNIVAL', releaseDate: '2021-04-26', era: 'BORDER', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cb/ENHYPEN_-_BORDER_-_CARNIVAL.png/220px-ENHYPEN_-_BORDER_-_CARNIVAL.png', tracklist: ["Intro : The Invitation", "Drunk-Dazed", "FEVER", "Not For Sale", "Mixed Up", "Outro : The Wormhole"] },
      { title: 'DIMENSION : DILEMMA', releaseDate: '2021-10-12', era: 'DIMENSION', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/Enhypen_Dimension_Dilemma.jpeg/220px-Enhypen_Dimension_Dilemma.jpeg', tracklist: ["Intro : Whiteout", "Tamed-Dashed", "Upper Side Dreamin'", "Just a Little Bit", "Go Big or Go Home", "Blockbuster", "Attention, please!", "Interlude : Question"] },
      { title: 'MANIFESTO : DAY 1', releaseDate: '2022-07-04', era: 'MANIFESTO', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Enhypen_-_Manifesto_-_Day_1.png/220px-Enhypen_-_Manifesto_-_Day_1.png', tracklist: ["Walk the Line", "Future Perfect (Pass the MIC)", "ParadoXXX Invasion", "TFW (That Feeling When)", "SHOUT OUT", "Foreshadow"] },
      { title: 'DARK BLOOD', releaseDate: '2023-05-22', era: 'BLOOD', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Enhypen_-_Dark_Blood.png/220px-Enhypen_-_Dark_Blood.png', tracklist: ["Fate", "Bite Me", "Sacrifice (Eat Me Up)", "Chaconne", "Bills", "Karma"] },
      { title: 'ORANGE BLOOD', releaseDate: '2023-11-17', era: 'BLOOD', albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Enhypen_-_Orange_Blood.png/220px-Enhypen_-_Orange_Blood.png', tracklist: ["Mortal", "Sweet Venom", "Still Monster", "Blind", "Orange Flower (You Complete Me)"] }
    ]
  }
];