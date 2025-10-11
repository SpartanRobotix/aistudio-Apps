
import React, { useRef, useState } from 'react';
import { Member } from '../types';
import Modal from './common/Modal';
import { Icon } from './common/Icon';
import { useData } from '../contexts/DataContext';
import { fileToBase64 } from '../utils/file';
import { rewriteFunFact, generateIntroduction } from '../services/geminiService';
import Spinner from './common/Spinner';

interface ProfileModalProps {
  member: Member;
  groupId: string;
  onClose: () => void;
  onStartChat: (member: Member) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ member, groupId, onClose, onStartChat }) => {
  const { data, updateGroups } = useData();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isGeneratingIntro, setIsGeneratingIntro] = useState(false);
  const group = data.groups.find(g => g.id === groupId);

  const handleChatClick = () => {
      onClose();
      onStartChat(member);
  };

  const handleAvatarUploadClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      const updatedGroups = data.groups.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            members: g.members.map(m => 
              m.id === member.id ? { ...m, avatarUrl: base64 } : m
            ),
          };
        }
        return g;
      });
      updateGroups(updatedGroups);
    }
  };
  
  const handleRewriteFact = async () => {
      setIsRewriting(true);
      try {
          const newFact = await rewriteFunFact(member.funFact, member.name);
          const updatedGroups = data.groups.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    members: g.members.map(m => 
                        m.id === member.id ? { ...m, funFact: newFact } : m
                    ),
                };
            }
            return g;
          });
          updateGroups(updatedGroups);
      } catch (error) {
          console.error("Failed to rewrite fun fact:", error);
          // Optionally, show an error message to the user
      } finally {
          setIsRewriting(false);
      }
  };

  const handleGenerateIntro = async () => {
    if (!group) return;
    setIsGeneratingIntro(true);
    try {
        const newIntro = await generateIntroduction(member, group.name);
        const updatedGroups = data.groups.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    members: g.members.map(m => 
                        m.id === member.id ? { ...m, introduction: newIntro } : m
                    ),
                };
            }
            return g;
        });
        updateGroups(updatedGroups);
    } catch (error) {
        console.error("Failed to generate introduction:", error);
    } finally {
        setIsGeneratingIntro(false);
    }
  };

  return (
    <Modal onClose={onClose}>
        <div className="relative w-full max-w-lg mx-auto">
            <div className="bg-black/60 rounded-2xl shadow-xl border border-white/20 p-6 text-white">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div 
                        className="relative group/avatar flex-shrink-0 cursor-pointer"
                        onClick={handleAvatarUploadClick}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAvatarUploadClick(); }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Change ${member.name}'s avatar`}
                        title={`Change ${member.name}'s avatar`}
                    >
                        <img src={member.avatarUrl} alt={member.name} className="w-32 h-32 object-cover rounded-full shadow-lg border-2 border-[var(--accent-color)]"/>
                        <div 
                            className="absolute inset-0 w-full h-full bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none"
                        >
                            <Icon icon="camera" className="w-8 h-8"/>
                        </div>
                        <input type="file" ref={avatarInputRef} onChange={handleAvatarFileChange} accept="image/*" className="hidden"/>
                    </div>

                    <div className="text-center sm:text-left w-full">
                        <h2 className="text-3xl font-bold text-[var(--accent-color)]">{member.name} {member.animal}</h2>
                        <p className="text-white/80 italic">"{member.nicknames.join(', ')}"</p>
                        <p className="text-white/80">{member.role}</p>
                        <div className="mt-4 space-y-2 text-sm">
                            <p><strong className="font-semibold text-white/90">Born:</strong> {member.birthDate}</p>
                            <p><strong className="font-semibold text-white/90">MBTI:</strong> {member.mbti}</p>
                            <p><strong className="font-semibold text-white/90">Personality:</strong> {member.personality}</p>
                            
                            <div>
                                <strong className="font-semibold text-white/90">AI Intro:</strong>
                                {isGeneratingIntro ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <Spinner />
                                        <span className="text-white/70 animate-pulse text-xs">Generating...</span>
                                    </div>
                                ) : member.introduction ? (
                                    <div className="flex items-start gap-2 mt-1">
                                        <p className="flex-grow italic text-white/90">"{member.introduction}"</p>
                                        <button onClick={handleGenerateIntro} disabled={isGeneratingIntro} className="flex-shrink-0 p-1 rounded-full text-[var(--accent-color)] hover:bg-white/10 disabled:opacity-50" title="Regenerate with AI">
                                            <Icon icon="sparkles" className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={handleGenerateIntro} disabled={isGeneratingIntro} className="mt-1 flex items-center gap-1 text-sm text-[var(--accent-color)] hover:underline disabled:opacity-50">
                                        <Icon icon="sparkles" className="w-4 h-4" />
                                        <span>Generate Intro</span>
                                    </button>
                                )}
                            </div>

                            <div className="flex items-start gap-2 pt-1">
                                <p className="flex-grow"><strong className="font-semibold text-white/90">Fun Fact:</strong> {member.funFact}</p>
                                <button onClick={handleRewriteFact} disabled={isRewriting} className="flex-shrink-0 p-1 rounded-full text-[var(--accent-color)] hover:bg-white/10 disabled:opacity-50" title="Rewrite with AI">
                                    {isRewriting ? <Spinner /> : <Icon icon="sparkles" className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleChatClick}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-[var(--accent-color)] text-[var(--primary-color)] font-bold py-3 rounded-lg hover:opacity-90 transition-opacity duration-300"
                    >
                    <Icon icon="chat" className="w-5 h-5" />
                    Chat with {member.name}
                </button>
            </div>
        </div>
    </Modal>
  );
};

export default ProfileModal;
