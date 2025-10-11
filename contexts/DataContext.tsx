import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Group, GalleryImage, ChatMessage, AppView, Song } from '../types';
import { initializeData, saveData, AppData } from '../services/storageService';

interface DataContextType {
  data: AppData;
  updateGroups: (updatedGroups: Group[]) => void;
  updateGalleryImages: (updatedImages: GalleryImage[]) => void;
  updateChatHistory: (chatKey: string, messages: ChatMessage[]) => void;
  updateUiState: (newState: Partial<AppData['uiState']>) => void;
  updateSongs: (updatedSongs: Song[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(initializeData);

  const handleUpdate = useCallback((newData: AppData) => {
    setData(newData);
    saveData(newData);
  }, []);

  const updateGroups = (updatedGroups: Group[]) => {
    handleUpdate({ ...data, groups: updatedGroups });
  };

  const updateGalleryImages = (updatedImages: GalleryImage[]) => {
    handleUpdate({ ...data, galleryImages: updatedImages });
  };

  const updateChatHistory = (chatKey: string, messages: ChatMessage[]) => {
    const newChatHistory = { ...data.chatHistory, [chatKey]: messages };
    handleUpdate({ ...data, chatHistory: newChatHistory });
  };
  
  const updateUiState = (newState: Partial<AppData['uiState']>) => {
    handleUpdate({ ...data, uiState: { ...data.uiState, ...newState } });
  };

  const updateSongs = (updatedSongs: Song[]) => {
    handleUpdate({ ...data, songs: updatedSongs });
  };

  return (
    <DataContext.Provider value={{ data, updateGroups, updateGalleryImages, updateChatHistory, updateUiState, updateSongs }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};