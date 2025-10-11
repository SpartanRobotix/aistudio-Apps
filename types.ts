export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  background: string;
}

export interface Member {
  id: string;
  name: string;
  birthDate: string;
  nationality: string;
  role: string;
  animal: string;
  personality: string;
  funFact: string;
  avatarUrl: string;
  nicknames: string[];
  mbti: string;
  iconicLine: string;
  introduction: string;
}

export interface Album {
  title: string;
  releaseDate: string;
  era: string;
  albumArtUrl: string;
  tracklist: string[];
}

export interface Group {
  id: string;
  name: string;
  emojis: string;
  theme: Theme;
  members: Member[];
  discography: Album[];
}

export enum AppView {
  PROFILES = 'PROFILES',
  CHAT = 'CHAT',
  GALLERY = 'GALLERY',
  WALLPAPER = 'WALLPAPER',
  DISCOGRAPHY = 'DISCOGRAPHY',
  QUIZ = 'QUIZ',
  MUSIC = 'MUSIC',
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  senderName?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  uploadedAt: string;
  groupId: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  src: string;
  groupId: string;
  lyrics: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}