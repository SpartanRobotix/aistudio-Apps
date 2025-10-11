
import React, { useState, useRef, useMemo } from 'react';
import { Group, Album, Song } from '../types';
import { useData } from '../contexts/DataContext';
import { fileToBase64 } from '../utils/file';
import { Icon } from './common/Icon';
import Spinner from './common/Spinner';
import { generateLyricsForAlbum } from '../services/geminiService';

const Discography: React.FC<{ group: Group }> = ({ group }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: 'releaseDate' | 'title'; direction: 'ascending' | 'descending' }>({ key: 'releaseDate', direction: 'descending' });
  const { data, updateGroups, updateSongs } = useData();
  const albumArtInputRef = useRef<HTMLInputElement>(null);
  const [editingAlbum, setEditingAlbum] = useState<string | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState<Record<string, boolean>>({});

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const handleAlbumArtUploadClick = (albumTitle: string) => {
    setEditingAlbum(albumTitle);
    albumArtInputRef.current?.click();
  };

  const handleAlbumArtFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editingAlbum) {
      const base64 = await fileToBase64(file);
      const updatedGroups = data.groups.map(g => {
        if (g.id === group.id) {
          return {
            ...g,
            discography: g.discography.map(album => 
              album.title === editingAlbum ? { ...album, albumArtUrl: base64 } : album
            ),
          };
        }
        return g;
      });
      updateGroups(updatedGroups);
      setEditingAlbum(null);
    }
  };

  const handleGenerateLyrics = async (album: Album) => {
    if (lyricsLoading[album.title]) return;

    setLyricsLoading(prev => ({ ...prev, [album.title]: true }));

    try {
        const generatedLyrics = await generateLyricsForAlbum(group, album);

        const updatedSongs: Song[] = [...data.songs];

        generatedLyrics.forEach(item => {
            // Find a song that might already have audio, or might be a placeholder
            const songIndex = updatedSongs.findIndex(s => s.title.toLowerCase() === item.title.toLowerCase() && s.groupId === group.id);
            
            if (songIndex !== -1) {
                // Update existing song (whether it has audio or not) with new lyrics
                updatedSongs[songIndex] = { ...updatedSongs[songIndex], lyrics: item.lyrics };
            } else {
                // Create a new song entry, but without audio data (src is empty)
                const newSong: Song = {
                    id: `${Date.now()}-${item.title}`,
                    title: item.title,
                    artist: group.name,
                    src: '', // This is a placeholder, to be filled by music player upload
                    groupId: group.id,
                    lyrics: item.lyrics,
                };
                updatedSongs.push(newSong);
            }
        });

        updateSongs(updatedSongs);

    } catch (error) {
        console.error(`Failed to generate lyrics for ${album.title}:`, error);
    } finally {
        setLyricsLoading(prev => ({ ...prev, [album.title]: false }));
    }
  };

  const lowerCaseQuery = searchQuery.toLowerCase();

  const filteredDiscography = useMemo(() => (searchQuery
    ? group.discography.filter(album =>
        album.title.toLowerCase().includes(lowerCaseQuery) ||
        album.tracklist.some(track => track.toLowerCase().includes(lowerCaseQuery))
      )
    : [...group.discography]), [group.discography, lowerCaseQuery, searchQuery]);
    
  const sortedDiscography = useMemo(() => {
    const sortableItems = [...filteredDiscography];
    sortableItems.sort((a, b) => {
      if (sortConfig.key === 'releaseDate') {
        const dateA = new Date(a.releaseDate).getTime();
        const dateB = new Date(b.releaseDate).getTime();
        return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
      } else { // 'title'
        return sortConfig.direction === 'ascending'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });
    return sortableItems;
  }, [filteredDiscography, sortConfig]);

  const sortOptions = [
    { label: 'Newest First', config: { key: 'releaseDate', direction: 'descending' } },
    { label: 'Oldest First', config: { key: 'releaseDate', direction: 'ascending' } },
    { label: 'Title (A-Z)', config: { key: 'title', direction: 'ascending' } },
    { label: 'Title (Z-A)', config: { key: 'title', direction: 'descending' } },
  ] as const;


  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-4 text-white">{group.name} Discography</h2>
      <input type="file" ref={albumArtInputRef} onChange={handleAlbumArtFileChange} accept="image/*" className="hidden"/>
      
      <div className="mb-8 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for a song or album..."
          className="w-full bg-black/30 border border-white/20 rounded-full py-3 px-5 pl-12 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all text-white"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {sortOptions.map(option => (
          <button
            key={option.label}
            onClick={() => setSortConfig(option.config)}
            className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
              sortConfig.key === option.config.key && sortConfig.direction === option.config.direction
                ? 'bg-[var(--accent-color)] text-[var(--primary-color)]'
                : 'bg-black/30 text-white/80 hover:bg-white/20'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {sortedDiscography.length > 0 ? (
        <div className="relative">
          <div className="absolute left-4 sm:left-1/2 w-0.5 h-full bg-white/30 -translate-x-1/2"></div>
          
          {sortedDiscography.map((album, index) => (
            <div key={album.title + index} className="relative mb-8 pl-10 sm:pl-0">
              <div className="absolute top-8 left-4 sm:left-1/2 w-4 h-4 rounded-full bg-[var(--accent-color)] border-2 border-black/50 -translate-x-1/2"></div>
              
              <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? 'sm:ml-auto sm:pl-8' : 'sm:pr-8 sm:text-right'}`}>
                <div className="bg-black/50 p-4 rounded-lg border border-white/20 shadow-lg transform hover:scale-105 hover:border-[var(--accent-color)] transition-all duration-300">
                  <div className={`flex items-start gap-4 ${index % 2 !== 0 ? 'sm:flex-row-reverse' : ''}`}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleAlbumArtUploadClick(album.title)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAlbumArtUploadClick(album.title); }}
                      className="relative group/albumart flex-shrink-0 cursor-pointer"
                      title={`Change ${album.title} album art`}
                      aria-label={`Change ${album.title} album art`}
                    >
                      <img src={album.albumArtUrl} alt={album.title} className="w-24 h-24 object-cover rounded-md" />
                      <div
                        className="absolute inset-0 w-full h-full bg-black/50 rounded-md flex items-center justify-center opacity-0 group-hover/albumart:opacity-100 transition-opacity pointer-events-none"
                       >
                         <Icon icon="camera" className="w-6 h-6"/>
                       </div>
                    </div>

                    <div className="flex-grow">
                      <p className="font-semibold text-xs uppercase tracking-wider text-[var(--accent-color)]">{album.era}</p>
                      <p className="text-sm text-white/70">{album.releaseDate}</p>
                      <h3 className="font-bold text-lg text-white mt-1">{album.title}</h3>
                      <details className={`mt-2 ${index % 2 !== 0 ? 'sm:text-left' : ''}`} open={!!searchQuery}>
                        <summary className="cursor-pointer text-[var(--accent-color)] text-sm font-semibold">Tracklist</summary>
                        <ol className="mt-2 list-decimal list-inside text-white/90 text-sm space-y-1">
                          {album.tracklist.map((track, trackIndex) => (
                            <li key={trackIndex} className={
                              searchQuery && track.toLowerCase().includes(lowerCaseQuery) ? 'text-[var(--accent-color)] font-bold' : ''
                            }>
                              {track}
                            </li>
                          ))}
                        </ol>
                      </details>
                      <div className={`mt-3 flex ${index % 2 !== 0 ? 'sm:justify-end' : 'sm:justify-start'}`}>
                        <button
                            onClick={() => handleGenerateLyrics(album)}
                            disabled={lyricsLoading[album.title]}
                            className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-color)] hover:text-white disabled:opacity-50 disabled:cursor-wait transition-colors"
                        >
                            {lyricsLoading[album.title] ? (
                                <>
                                    <Spinner />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Icon icon="sparkles" className="w-4 h-4" />
                                    <span>Generate Lyrics</span>
                                </>
                            )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-white/70">
            <p>No results found for "{searchQuery}".</p>
            <p>Try searching for another song or album.</p>
        </div>
      )}
    </div>
  );
};

export default Discography;
