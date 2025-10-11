import React, { useState } from 'react';
import { Group, Member } from '../types';
import ProfileModal from './ProfileModal';

interface ProfilesProps {
  group: Group;
  onProfileSelect: (member: Member) => void;
  onChatSelect: (member: Member) => void;
}

const Profiles: React.FC<ProfilesProps> = ({ group, onProfileSelect, onChatSelect }) => {
  const [activeModalMember, setActiveModalMember] = useState<Member | null>(null);

  const handleCardClick = (member: Member) => {
    onProfileSelect(member);
    setActiveModalMember(member);
  };
  
  const handleCloseModal = () => {
      setActiveModalMember(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6 text-white">{group.name} Members</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {group.members.map((member) => (
          <div
            key={member.id}
            onClick={() => handleCardClick(member)}
            className="cursor-pointer group perspective"
          >
            <div className="relative w-full aspect-square preserve-3d group-hover:rotate-y-180 duration-500 transition-transform">
                <div className="absolute w-full h-full backface-hidden">
                    <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover rounded-xl shadow-lg border-2 border-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_var(--accent-color)]"/>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl text-center">
                        <p className="text-white font-bold text-sm sm:text-base truncate">{member.name}</p>
                        <p className="text-white/80 text-xs sm:text-sm truncate">{member.role}</p>
                    </div>
                </div>
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-black/50 backdrop-blur-md rounded-xl border-2 border-[var(--accent-color)] flex flex-col justify-center items-center p-2">
                    <h3 className="text-lg font-bold text-center text-[var(--accent-color)]">{member.name}</h3>
                    <p className="text-center text-sm text-white">{member.role}</p>
                    <p className="text-4xl mt-2">{member.animal}</p>
                </div>
            </div>
          </div>
        ))}
      </div>
      {activeModalMember && <ProfileModal member={activeModalMember} groupId={group.id} onClose={handleCloseModal} onStartChat={onChatSelect} />}
    </div>
  );
};

export default Profiles;