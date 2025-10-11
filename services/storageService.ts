import { Group, GalleryImage, ChatMessage, AppView, Song } from '../types';
import { GROUPS } from '../constants';

const STORAGE_KEY = 'kpopFanUniverseData';

export interface AppData {
  groups: Group[];
  galleryImages: GalleryImage[];
  chatHistory: Record<string, ChatMessage[]>;
  songs: Song[];
  uiState: {
    selectedGroupId: string;
    currentView: AppView;
  };
}

export const getStoredData = (): AppData | null => {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.error("Failed to parse data from localStorage:", error);
        localStorage.removeItem(STORAGE_KEY);
    }
    return null;
};

export const saveData = (data: AppData) => {
    try {
        const dataString = JSON.stringify(data);
        localStorage.setItem(STORAGE_KEY, dataString);
    } catch (error) {
        console.error("Failed to save data to localStorage:", error);
    }
};

export const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
}

// Initialize with defaults if no data is present
export const initializeData = (): AppData => {
  const storedData = getStoredData();
  if (storedData) {
    // Ensure data structure is up-to-date, merge with defaults if needed
    return {
      groups: storedData.groups || GROUPS,
      galleryImages: storedData.galleryImages || [],
      chatHistory: storedData.chatHistory || {},
      songs: storedData.songs || [],
      uiState: storedData.uiState || { selectedGroupId: GROUPS[0].id, currentView: AppView.PROFILES },
    };
  }
  return {
    groups: GROUPS,
    galleryImages: [],
    chatHistory: {},
    songs: [],
    uiState: {
      selectedGroupId: GROUPS[0].id,
      currentView: AppView.PROFILES
    },
  };
};