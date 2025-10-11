import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Group, Song } from '../types';
import { useData } from '../contexts/DataContext';
import { fileToBase64 } from '../utils/file';
import { Icon } from './common/Icon';
import Modal from './common/Modal';

const getStoredPlayerState = (groupId: string) => {
  const storedState = localStorage.getItem(`musicPlayerState-${groupId}`);
  if (storedState) {
    try {
      const parsed = JSON.parse(storedState);
      if (typeof parsed.currentSongIndex === 'number' && typeof parsed.isPlaying === 'boolean' && typeof parsed.currentTime === 'number') {
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse music player state:", e);
    }
  }
  return { currentSongIndex: null, isPlaying: false, currentTime: 0 };
};

const MusicPlayer: React.FC<{ group: Group }> = ({ group }) => {
  const { data, updateSongs } = useData();
  const { songs } = data;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lyricsView, setLyricsView] = useState<'playlist' | 'lyrics'>('playlist');
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [lyricsInput, setLyricsInput] = useState('');
  
  const groupSongs = songs.filter(song => song.groupId === group.id);
  const currentSong = currentSongIndex !== null ? groupSongs[currentSongIndex] : null;

  // Effect to LOAD state on mount or group change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.pause(); // Stop playback when switching groups

    const storedState = getStoredPlayerState(group.id);
    const indexIsValid = storedState.currentSongIndex !== null && storedState.currentSongIndex < groupSongs.length;
    
    if (indexIsValid) {
      const songToLoad = groupSongs[storedState.currentSongIndex];
      setCurrentSongIndex(storedState.currentSongIndex);
      setIsPlaying(storedState.isPlaying);
      audio.src = songToLoad.src;
      
      const onMetadataLoaded = () => {
        if (audio) {
          audio.currentTime = storedState.currentTime;
          setCurrentTime(storedState.currentTime);
        }
      };
      
      if (audio.readyState >= 1) { // Already has metadata
        onMetadataLoaded();
      } else {
        audio.addEventListener('loadedmetadata', onMetadataLoaded, { once: true });
      }
    } else {
      setCurrentSongIndex(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      audio.src = '';
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group.id, songs]);

  // Effect to SAVE state
  const saveState = useCallback(() => {
    if (currentSongIndex !== null) {
      const stateToSave = {
        currentSongIndex,
        isPlaying,
        currentTime: audioRef.current?.currentTime || 0
      };
      localStorage.setItem(`musicPlayerState-${group.id}`, JSON.stringify(stateToSave));
    }
  }, [group.id, currentSongIndex, isPlaying]);

  useEffect(() => {
    window.addEventListener('beforeunload', saveState);
    return () => {
      saveState();
      window.removeEventListener('beforeunload', saveState);
    };
  }, [saveState]);

  // Effect to control PLAYBACK based on state
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentSong) {
      if (isPlaying) {
        audio.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, currentSong]);
  
  const playNext = useCallback(() => {
      if (groupSongs.length === 0) return;
      const nextIndex = (currentSongIndex ?? -1) < groupSongs.length - 1 ? (currentSongIndex ?? -1) + 1 : 0;
      setCurrentSongIndex(nextIndex);
      setIsPlaying(true);
      setLyricsView('lyrics');
  }, [currentSongIndex, groupSongs.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playNext]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    
    const processResults = await Promise.all(filesArray.map(async (file) => {
        // FIX: Add a type guard to ensure 'file' is a File object before processing.
        // This resolves multiple TypeScript errors where properties like '.type' and '.name'
        // were being accessed on an 'unknown' type.
        if (file instanceof File && file.type === "audio/mpeg") {
            const src = await fileToBase64(file);
            const songTitle = file.name.replace(/\.mp3$/i, '').trim();

            const existingSongData = data.songs.find(s => 
                s.title.toLowerCase() === songTitle.toLowerCase() && 
                s.groupId === group.id && 
                !s.src
            );
            
            const newSong: Song = {
                id: `${Date.now()}-${file.name}`,
                title: songTitle,
                artist: group.name,
                src,
                groupId: group.id,
                lyrics: existingSongData ? existingSongData.lyrics : '',
            };
            
            return { newSong, idToRemove: existingSongData?.id };
        }
        return null;
    }));
    
    // FIX: Replaced the problematic type predicate with a simpler filter.
    // TypeScript can correctly infer the type after filtering out null values,
    // which resolves the confusing type error.
    const validResults = processResults.filter(r => r !== null);
    
    if (validResults.length > 0) {
        const newSongs = validResults.map(r => r.newSong);
        const idsToRemove = validResults.map(r => r.idToRemove).filter((id): id is string => id !== undefined);

        const otherSongs = data.songs.filter(s => !idsToRemove.includes(s.id));
        updateSongs([...otherSongs, ...newSongs]);
    }
  };
  
  const playSong = (index: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newSong = groupSongs[index];
    audio.src = newSong.src;
    setCurrentSongIndex(index);
    setIsPlaying(true);
    setLyricsView('lyrics');
  };

  const togglePlayPause = () => {
    if (currentSongIndex === null && groupSongs.length > 0) {
        playSong(0);
        return;
    }
    setIsPlaying(!isPlaying);
  };
  
  const playPrev = () => {
      if (groupSongs.length === 0) return;
      const prevIndex = (currentSongIndex ?? 0) > 0 ? (currentSongIndex ?? 0) - 1 : groupSongs.length - 1;
      playSong(prevIndex);
  };
  
  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (audio) {
          audio.currentTime = Number(event.target.value);
          setCurrentTime(audio.currentTime);
      }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleEditLyrics = () => {
    if (!currentSong) return;
    setEditingSong(currentSong);
    setLyricsInput(currentSong.lyrics || '');
  };

  const handleSaveLyrics = () => {
    if (!editingSong) return;
    const updatedSongsList = songs.map(s => 
      s.id === editingSong.id ? { ...s, lyrics: lyricsInput } : s
    );
    updateSongs(updatedSongsList);
    setEditingSong(null);
  };

  return (
    <div>
        {editingSong && (
            <Modal onClose={() => setEditingSong(null)}>
            <div className="bg-black/80 backdrop-blur-md border border-white/20 p-6 rounded-lg text-white w-[90vw] max-w-lg">
                <h3 className="text-xl font-bold mb-4">Edit Lyrics for "{editingSong.title}"</h3>
                <textarea
                value={lyricsInput}
                onChange={(e) => setLyricsInput(e.target.value)}
                placeholder="Enter song lyrics here..."
                className="w-full h-64 bg-white/10 p-2 rounded-md border border-white/20 focus:ring-2 focus:ring-[var(--accent-color)] focus:outline-none"
                />
                <div className="flex justify-end gap-4 mt-4">
                <button onClick={() => setEditingSong(null)} className="py-2 px-4 rounded-md bg-white/20 hover:bg-white/30 transition-colors">Cancel</button>
                <button onClick={handleSaveLyrics} className="py-2 px-4 rounded-md bg-[var(--accent-color)] text-[var(--primary-color)] font-bold hover:opacity-90 transition-opacity">Save Lyrics</button>
                </div>
            </div>
            </Modal>
        )}

        <audio ref={audioRef} />
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{group.name} Music Hub</h2>
            <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 bg-[var(--accent-color)] text-[var(--primary-color)] font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
            <Icon icon="upload" className="w-5 h-5" />
            Upload MP3
            </button>
            <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/mpeg"
            className="hidden"
            multiple
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Player UI */}
            <div className="md:col-span-1 bg-black/50 p-4 rounded-lg border border-white/20 shadow-lg flex flex-col items-center justify-center text-center">
               <div className="w-24 h-24 bg-[var(--accent-color)] rounded-full flex items-center justify-center mb-4">
                  <Icon icon="music" className="w-12 h-12 text-[var(--primary-color)]"/>
               </div>
               <h3 className="font-bold text-lg text-white truncate">{currentSong?.title || 'No Song Selected'}</h3>
               <p className="text-white/70 mb-4">{currentSong?.artist || '---'}</p>
               
               <div className="w-full">
                    <input type="range" value={currentTime} max={duration || 0} onChange={handleSeek} className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]" />
                    <div className="flex justify-between text-xs text-white/70 mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
               </div>
               
               <div className="flex items-center gap-4 mt-4">
                    <button onClick={playPrev} className="text-white/80 hover:text-white transition-colors"><Icon icon="prev" className="w-6 h-6"/></button>
                    <button onClick={togglePlayPause} className="w-12 h-12 rounded-full bg-[var(--accent-color)] flex items-center justify-center text-[var(--primary-color)] hover:opacity-90">
                        <Icon icon={isPlaying ? 'pause' : 'play'} className="w-8 h-8"/>
                    </button>
                    <button onClick={playNext} className="text-white/80 hover:text-white transition-colors"><Icon icon="next" className="w-6 h-6"/></button>
               </div>
            </div>
            
            {/* Playlist / Lyrics Panel */}
            <div className="md:col-span-2 bg-black/50 p-4 rounded-lg border border-white/20 shadow-lg">
                <div className="flex border-b border-white/20 mb-4">
                    <button onClick={() => setLyricsView('playlist')} className={`px-4 py-2 font-semibold transition-colors ${lyricsView === 'playlist' ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' : 'text-white/70 hover:text-white'}`}>
                        Playlist
                    </button>
                    <button onClick={() => setLyricsView('lyrics')} className={`px-4 py-2 font-semibold transition-colors ${lyricsView === 'lyrics' ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' : 'text-white/70 hover:text-white'}`}>
                        Lyrics
                    </button>
                </div>

                <div className="max-h-[42vh] overflow-y-auto pr-2">
                    {lyricsView === 'playlist' ? (
                        groupSongs.length > 0 ? (
                            <ul className="space-y-2">
                                {groupSongs.map((song, index) => (
                                    <li key={song.id} 
                                        onClick={() => playSong(index)}
                                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${currentSongIndex === index ? 'bg-[var(--accent-color)]/50' : 'hover:bg-white/10'}`}>
                                        <span className="text-sm text-white/70 w-5">{index + 1}</span>
                                        <div className="flex-grow">
                                            <p className="font-semibold text-white truncate">{song.title}</p>
                                            <p className="text-xs text-white/70">{song.artist}</p>
                                        </div>
                                        {currentSongIndex === index && isPlaying && <Icon icon="play" className="w-4 h-4 text-[var(--accent-color)] animate-pulse"/>}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-10 text-white/70">
                                <p>No songs uploaded for {group.name} yet.</p>
                                <p>Click "Upload MP3" to add your first track!</p>
                            </div>
                        )
                    ) : (
                        <div>
                            {currentSong ? (
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-lg text-white">{currentSong.title}</h4>
                                        <button onClick={handleEditLyrics} className="flex items-center gap-1 text-sm text-[var(--accent-color)] hover:underline">
                                            <Icon icon="sparkles" className="w-4 h-4" />
                                            <span>{currentSong.lyrics ? 'Edit' : 'Add'} Lyrics</span>
                                        </button>
                                    </div>
                                    <p className="whitespace-pre-wrap text-white/90 leading-relaxed">
                                        {currentSong.lyrics || "No lyrics have been added for this song yet."}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-10 text-white/70">
                                    <p>Play a song to see its lyrics.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default MusicPlayer;