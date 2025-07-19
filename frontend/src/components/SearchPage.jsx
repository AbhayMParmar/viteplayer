import React, { useState, useEffect, useCallback } from 'react';
import { assets } from '../assets/assets';
import { UserData } from '../context/User';
import { SongData } from '../context/song';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSongLoading, setIsSongLoading] = useState(false);
  const { user } = UserData();
  const { 
    setSelectedSong, 
    setIsPlaying, 
    fetchSingleSong, 
    song: currentSong,
    isPlaying: isCurrentlyPlaying 
  } = SongData();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllSongs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/song/all', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setSongs(response.data);
        setFilteredSongs(searchQuery ? response.data : []);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setError('Failed to load songs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAllSongs();
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSongs([]);
    } else {
      const filtered = songs.filter(
        (song) =>
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.singer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.album.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  }, [searchQuery, songs]);

  const handleSongClick = useCallback(
    async (song) => {
      if (isSongLoading) return;
      
      // If the clicked song is already the current playing song
      if (currentSong?._id === song._id) {
        // Just toggle play/pause if needed
        setIsPlaying(!isCurrentlyPlaying);
        navigate('/');
        return;
      }

      setIsSongLoading(true);
      setError(null);
      try {
        await fetchSingleSong(song._id);
        setSelectedSong(song._id);
        setIsPlaying(true);
        navigate('/');
      } catch (error) {
        console.error('Error fetching song:', error);
        setError('Failed to load song. Please try again.');
      } finally {
        setIsSongLoading(false);
      }
    },
    [fetchSingleSong, setSelectedSong, setIsPlaying, navigate, isSongLoading, currentSong, isCurrentlyPlaying]
  );

  const featuredSong = songs.length > 0 ? songs[Math.floor(Math.random() * songs.length)] : null;

  return (
    <div className="p-4 sm:p-6 text-white h-full overflow-y-auto">
      <div className="relative mb-6 sm:mb-8 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search songs, artists, albums..."
          className="w-full bg-[#282828] rounded-full py-3 sm:py-3 pl-4 pr-10 text-white focus:outline-none 
                    hover:bg-[#383838] focus:bg-[#383838] transition-all duration-300
                    focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50 shadow-lg
                    sm:text-base text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
          aria-label="Search for songs, artists, or albums"
        />
        <img
          src={assets.search_icon}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 sm:w-5 opacity-70"
          alt="search"
        />
      </div>

      <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        {isLoading && (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-400 mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading songs...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        {!searchQuery && !isLoading && !error ? (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-400 to-sky-500 bg-clip-text text-transparent">
              Featured Today
            </h2>
            {featuredSong && (
              <div
                className={`relative bg-gradient-to-br from-[#181818] to-[#282828] rounded-xl overflow-hidden 
                          shadow-2xl hover:shadow-sky-400/30 transition-all duration-500 group
                          ${currentSong?._id === featuredSong._id ? 'ring-2 ring-sky-400' : ''}`}
                onClick={() => handleSongClick(featuredSong)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSongClick(featuredSong)}
                aria-label={`Play ${featuredSong.title} by ${featuredSong.singer}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <div className="relative z-20 p-4 sm:p-6 md:p-8 flex flex-col sm:flex-col md:flex-row items-center gap-4 sm:gap-6">
                  <div className="w-full sm:w-48 md:w-64 h-48 sm:h-48 md:h-64 flex-shrink-0 relative overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={featuredSong.thumbnail.url || assets.music_icon}
                      alt={featuredSong.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className={`w-12 sm:w-16 h-12 sm:h-16 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform
                                    ${currentSong?._id === featuredSong._id && isCurrentlyPlaying ? 'bg-sky-600' : 'bg-sky-400'}`}>
                        {currentSong?._id === featuredSong._id && isCurrentlyPlaying ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 sm:w-8 h-6 sm:h-8"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 sm:w-8 h-6 sm:h-8 ml-1"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3 sm:space-y-4 text-center sm:text-left">
                    <div>
                      <span className="inline-block bg-sky-400/20 text-sky-400 text-xs font-bold px-2 sm:px-3 py-1 rounded-full mb-2">
                        Featured Pick
                      </span>
                      <h3 className="text-xl sm:text-2xl md:text-4xl font-bold">{featuredSong.title}</h3>
                      <p className="text-gray-300 mt-1 text-base sm:text-lg">{featuredSong.singer}</p>
                    </div>
                    <p className="text-gray-300 hidden sm:block">
                      Discover this featured track selected just for you. Click to play and enjoy the music.
                    </p>
                    <button
                      className={`mt-3 sm:mt-4 px-5 sm:px-6 py-2 sm:py-3 rounded-full text-white font-bold 
                                transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto sm:mx-0
                                ${currentSong?._id === featuredSong._id && isCurrentlyPlaying ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-400 hover:bg-sky-500'}`}
                      onClick={() => handleSongClick(featuredSong)}
                      disabled={isSongLoading}
                      aria-label={`${currentSong?._id === featuredSong._id && isCurrentlyPlaying ? 'Pause' : 'Play'} ${featuredSong.title} by ${featuredSong.singer}`}
                    >
                      {isSongLoading ? (
                        'Loading...'
                      ) : currentSong?._id === featuredSong._id && isCurrentlyPlaying ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 sm:w-5 h-4 sm:h-5"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Pause
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 sm:w-5 h-4 sm:h-5"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Play Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="text-center py-6 sm:py-8">
              <div className="inline-block p-4 bg-[#181818] rounded-xl border border-[#282828] max-w-xs sm:max-w-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 sm:h-12 w-10 sm:w-12 mx-auto text-sky-400 mb-3 sm:mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Search for Music</h3>
                <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">
                  Type in the search bar to find your favorite songs, artists, or albums
                </p>
                <div className="animate-bounce">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 sm:h-6 w-5 sm:w-6 mx-auto text-sky-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSongs.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold">Top Result</h2>
                <div
                  className={`bg-[#181818] hover:bg-[#282828] p-4 sm:p-5 rounded-lg cursor-pointer transition-all duration-300
                            border border-transparent hover:border-sky-400/30 hover:shadow-lg hover:shadow-sky-400/10
                            ${currentSong?._id === filteredSongs[0]._id ? 'ring-2 ring-sky-400' : ''}`}
                  onClick={() => handleSongClick(filteredSongs[0])}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleSongClick(filteredSongs[0])}
                  aria-label={`${currentSong?._id === filteredSongs[0]._id && isCurrentlyPlaying ? 'Pause' : 'Play'} ${filteredSongs[0].title} by ${filteredSongs[0].singer}`}
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="w-full sm:w-32 md:w-40 h-32 sm:h-40 flex-shrink-0 relative group">
                      <img
                        src={filteredSongs[0].thumbnail.url || assets.music_icon}
                        alt={filteredSongs[0].title}
                        className="w-full h-full object-cover rounded-lg shadow-lg group-hover:shadow-sky-400/30 transition-shadow duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                        <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform
                                      ${currentSong?._id === filteredSongs[0]._id && isCurrentlyPlaying ? 'bg-sky-600' : 'bg-sky-400'}`}>
                          {currentSong?._id === filteredSongs[0]._id && isCurrentlyPlaying ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 sm:w-6 h-5 sm:h-6"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 sm:w-6 h-5 sm:h-6 ml-1"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3 sm:space-y-4 text-center sm:text-left">
                      <div>
                        <h3 className="text-lg sm:text-2xl font-bold">{filteredSongs[0].title}</h3>
                        <p className="text-gray-400 mt-1 text-sm sm:text-lg">{filteredSongs[0].singer}</p>
                      </div>
                      <button
                        className={`mt-3 sm:mt-4 px-5 sm:px-6 py-2 sm:py-3 rounded-full text-white font-bold 
                                  transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto sm:mx-0
                                  ${currentSong?._id === filteredSongs[0]._id && isCurrentlyPlaying ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-400 hover:bg-sky-500'}`}
                        onClick={() => handleSongClick(filteredSongs[0])}
                        disabled={isSongLoading}
                        aria-label={`${currentSong?._id === filteredSongs[0]._id && isCurrentlyPlaying ? 'Pause' : 'Play'} ${filteredSongs[0].title} by ${filteredSongs[0].singer}`}
                      >
                        {isSongLoading ? (
                          'Loading...'
                        ) : currentSong?._id === filteredSongs[0]._id && isCurrentlyPlaying ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 sm:w-5 h-4 sm:h-5"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Pause
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 sm:w-5 h-4 sm:h-5"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Play Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {filteredSongs.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold">Songs</h2>
                <div className="bg-[#181818] bg-opacity-40 rounded-xl overflow-hidden shadow-lg">
                  {filteredSongs.map((song, index) => (
                    <div
                      key={song._id}
                      className={`flex items-center p-3 sm:p-3 hover:bg-[#282828] cursor-pointer transition-all duration-300 group
                                border-b border-[#282828] last:border-0
                                ${currentSong?._id === song._id ? 'bg-[#282828]' : ''}`}
                      onClick={() => handleSongClick(song)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleSongClick(song)}
                      aria-label={`${currentSong?._id === song._id && isCurrentlyPlaying ? 'Pause' : 'Play'} ${song.title} by ${song.singer}`}
                    >
                      <div className={`w-8 sm:w-10 text-center text-xs sm:text-sm mr-3 sm:mr-4 transition-colors
                                    ${currentSong?._id === song._id ? 'text-sky-400' : 'text-gray-400 group-hover:text-sky-400'}`}>
                        {currentSong?._id === song._id && isCurrentlyPlaying ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 sm:w-5 h-4 sm:h-5 mx-auto"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="w-10 sm:w-12 h-10 sm:h-12 flex-shrink-0 mr-3 sm:mr-4 relative overflow-hidden rounded">
                          <img
                            src={song.thumbnail.url || assets.music_icon}
                            alt={song.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300">
                            <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300
                                          ${currentSong?._id === song._id && isCurrentlyPlaying ? 'bg-sky-600' : 'bg-sky-400'}`}>
                              {currentSong?._id === song._id && isCurrentlyPlaying ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-4 sm:w-5 h-4 sm:h-5"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-4 sm:w-5 h-4 sm:h-5 ml-1"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h3 className={`font-medium text-sm sm:text-base truncate transition-colors
                                        ${currentSong?._id === song._id ? 'text-sky-400' : 'group-hover:text-sky-400'}`}>
                            {song.title}
                          </h3>
                          <p className={`text-xs sm:text-sm truncate transition-colors
                                      ${currentSong?._id === song._id ? 'text-sky-300' : 'text-gray-400 group-hover:text-white'}`}>
                            {song.singer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {filteredSongs.length === 0 && searchQuery && !isLoading && !error && (
              <div className="text-center py-12 sm:py-16">
                <div className="inline-block p-4 sm:p-6 bg-[#181818] rounded-xl max-w-xs sm:max-w-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 sm:h-16 w-12 sm:w-16 mx-auto text-gray-500 mb-3 sm:mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">No results found</h3>
                  <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                    We couldn't find any matches for "{searchQuery}"
                  </p>
                  <button
                    className="px-5 sm:px-6 py-2 sm:py-2 bg-sky-400 rounded-full text-white font-medium hover:bg-sky-500 
                              transform hover:scale-105 transition-all duration-300"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search query"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;