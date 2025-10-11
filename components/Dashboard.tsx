import React from 'react';
import { Group, AppView, Member } from '../types';
import Profiles from './Profiles';
import Chat from './Chat';
import Gallery from './Gallery';
import WallpaperGenerator from './WallpaperGenerator';
import Discography from './Discography';
import Quiz from './Quiz';
import MusicPlayer from './MusicPlayer';
import { Icon } from './common/Icon';

interface DashboardProps {
  group: Group;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedMember: Member | null;
  setSelectedMember: (member: Member | null) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ group, currentView, setCurrentView, selectedMember, setSelectedMember }) => {
  const navItems = [
    { view: AppView.PROFILES, label: 'Profiles', icon: 'users' as const },
    { view: AppView.DISCOGRAPHY, label: 'Discography', icon: 'discography' as const },
    { view: AppView.CHAT, label: 'AI Chat', icon: 'chat' as const },
    { view: AppView.GALLERY, label: 'Gallery', icon: 'gallery' as const },
    { view: AppView.WALLPAPER, label: 'AI Wallpaper', icon: 'wallpaper' as const },
    { view: AppView.QUIZ, label: 'Fan Quiz', icon: 'quiz' as const },
    { view: AppView.MUSIC, label: 'Music Hub', icon: 'music' as const },
  ];

  const handleProfileSelect = (member: Member) => {
    setSelectedMember(member);
  };

  const handleChatFromProfile = (member: Member) => {
    setSelectedMember(member);
    setCurrentView(AppView.CHAT);
  }

  return (
    <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-4 md:p-6 mt-6">
      <div className="flex justify-center border-b border-white/20 mb-6 overflow-x-auto pb-2">
        <nav className="flex space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
          {navItems.map((item) => {
            const isSelected = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={`flex flex-col sm:flex-row items-center gap-2 px-3 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors duration-300 ${
                  isSelected ? 'border-[var(--accent-color)] text-[var(--accent-color)]' : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                <Icon icon={item.icon} className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="min-h-[60vh] transition-opacity duration-300">
        {currentView === AppView.PROFILES && <Profiles group={group} onProfileSelect={handleProfileSelect} onChatSelect={handleChatFromProfile} />}
        {currentView === AppView.DISCOGRAPHY && <Discography group={group} />}
        {currentView === AppView.CHAT && <Chat group={group} initialMember={selectedMember} />}
        {currentView === AppView.GALLERY && <Gallery group={group} />}
        {currentView === AppView.WALLPAPER && <WallpaperGenerator group={group} />}
        {currentView === AppView.QUIZ && <Quiz group={group} />}
        {currentView === AppView.MUSIC && <MusicPlayer group={group} />}
      </div>
    </div>
  );
};

export default Dashboard;