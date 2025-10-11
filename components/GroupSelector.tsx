
import React from 'react';
import { Group } from '../types';

interface GroupSelectorProps {
  groups: Group[];
  selectedGroup: Group | null;
  onSelect: (group: Group) => void;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({ groups, selectedGroup, onSelect }) => {
  return (
    <nav className="flex justify-center items-center gap-2 md:gap-4 my-8 p-2 bg-black/30 backdrop-blur-md rounded-full border border-white/20">
      {groups.map((group) => {
        const isSelected = selectedGroup?.id === group.id;
        const groupThemeStyle = {
          backgroundColor: isSelected ? group.theme.accent : 'transparent',
          color: isSelected ? (group.id === 'enhypen' ? group.theme.primary : group.theme.secondary) : 'white',
        };

        return (
          <button
            key={group.id}
            onClick={() => onSelect(group)}
            className={`px-4 py-2 text-sm md:px-6 md:py-2 md:text-base font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white`}
            style={groupThemeStyle}
          >
            {group.name} {group.emojis}
          </button>
        );
      })}
    </nav>
  );
};

export default GroupSelector;
