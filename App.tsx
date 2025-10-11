import React, { useEffect, useRef } from 'react';
import { Group, AppView, Member } from './types';
import GroupSelector from './components/GroupSelector';
import Dashboard from './components/Dashboard';
import { useData } from './contexts/DataContext';
import { fileToBase64 } from './utils/file';
import { Icon } from './components/common/Icon';
import { resetToDefaults } from './services/storageService';

const App: React.FC = () => {
  const { data, updateGroups, updateUiState } = useData();
  const { groups, uiState } = data;
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const selectedGroup = groups.find(g => g.id === uiState.selectedGroupId) || groups[0];
  
  useEffect(() => {
    // If the group from state isn't found (e.g., data corruption/reset), default to the first group
    if (!groups.find(g => g.id === uiState.selectedGroupId)) {
      updateUiState({ selectedGroupId: groups[0].id });
    }
  }, [groups, uiState.selectedGroupId, updateUiState]);


  const handleGroupSelect = (group: Group) => {
    updateUiState({ selectedGroupId: group.id, currentView: AppView.PROFILES });
    setSelectedMember(null);
  };

  const handleViewChange = (view: AppView) => {
    updateUiState({ currentView: view });
  };

  const handleBackgroundUploadClick = () => {
    backgroundInputRef.current?.click();
  };

  const handleBackgroundFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedGroup) {
      const base64 = await fileToBase64(file);
      const updatedGroups = groups.map(g => 
        g.id === selectedGroup.id ? { ...g, theme: { ...g.theme, background: base64 } } : g
      );
      updateGroups(updatedGroups);
    }
  };

  const backgroundStyle = selectedGroup ? {
    backgroundImage: `url(${selectedGroup.theme.background})`,
  } : {};
  
  const themeStyle = selectedGroup ? {
      '--primary-color': selectedGroup.theme.primary,
      '--secondary-color': selectedGroup.theme.secondary,
      '--accent-color': selectedGroup.theme.accent,
      '--gradient': selectedGroup.theme.gradient,
  } as React.CSSProperties : {};


  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-fixed transition-all duration-500"
      style={backgroundStyle}
    >
      <div 
        className="min-h-screen w-full bg-black/50 backdrop-blur-sm"
        style={themeStyle}
      >
        <main className="container mx-auto p-4 text-white max-w-4xl">
          <header className="text-center my-6 relative">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              JAZZYS
            </h1>
            <p className="text-white/80 mt-2">SKZ_TXT & ENHYPEN HUB</p>
            <div className="absolute top-0 right-0 flex gap-2">
                <button 
                  onClick={handleBackgroundUploadClick} 
                  className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                  aria-label={`Change ${selectedGroup.name} background`}
                  title={`Change ${selectedGroup.name} background`}
                >
                    <Icon icon="camera" className="w-5 h-5"/>
                </button>
                <input type="file" ref={backgroundInputRef} onChange={handleBackgroundFileChange} accept="image/*" className="hidden"/>
                 <button 
                  onClick={resetToDefaults} 
                  className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                  aria-label="Reset all customizations"
                  title="Reset all customizations"
                >
                    <Icon icon="reset" className="w-5 h-5"/>
                </button>
            </div>
          </header>

          <GroupSelector 
            groups={groups} 
            selectedGroup={selectedGroup}
            onSelect={handleGroupSelect} 
          />
          
          {selectedGroup && (
            <Dashboard 
              group={selectedGroup}
              currentView={uiState.currentView}
              setCurrentView={handleViewChange}
              selectedMember={selectedMember}
              setSelectedMember={setSelectedMember}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;