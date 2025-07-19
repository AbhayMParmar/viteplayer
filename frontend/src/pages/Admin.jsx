import React, { useState } from 'react'
import { UserData } from '../context/User'
import { Link, useNavigate } from 'react-router-dom';
import { SongData } from '../context/song';
import { MdDelete, MdAddPhotoAlternate, MdMusicNote } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Admin = () => {
  const { user } = UserData();
  const { albums, songs, addAlbum, loading, addSong, addThumbnail, deleteSong, deleteAlbum, updateSongOrder } = SongData();
  const navigate = useNavigate();

  if (user && user.role !== "admin") return navigate("/");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [singer, setSinger] = useState("");
  const [album, setAlbum] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const addAlbumHandler = (e) => {
    e.preventDefault();
    setShowLoader(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    addAlbum(formData, setTitle, setDescription, setFile).finally(() => {
      setShowLoader(false);
    });
  };

  const addSongHandler = (e) => {
    e.preventDefault();
    setShowLoader(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("singer", singer);
    formData.append("album", album);
    formData.append("file", file);
    addSong(formData, setTitle, setDescription, setFile, setSinger, setAlbum).finally(() => {
      setShowLoader(false);
    });
  };

  const addThumbnailHandler = (id) => {
    setShowLoader(true);
    const formData = new FormData();
    formData.append("file", file);
    addThumbnail(id, formData, setFile).finally(() => {
      setShowLoader(false);
    });
  };

  const deleteSongHandler = (id) => {
    if (confirm("Are you sure you want to delete this song?")) {
      setShowLoader(true);
      deleteSong(id).finally(() => {
        setShowLoader(false);
      });
    }
  };

  const deleteAlbumHandler = (id) => {
    if (confirm("Are you sure you want to delete this album? All songs in this album will also be deleted.")) {
      setShowLoader(true);
      deleteAlbum(id).finally(() => {
        setShowLoader(false);
      });
    }
  };

  // Truncate file name to prevent overflow
  const truncateFileName = (name, maxLength = 20) => {
    if (!name) return "Click to upload";
    if (name.length <= maxLength) return name;
    return `${name.slice(0, maxLength - 3)}...`;
  };

  // Sort songs by createdAt date in descending order (newest first)
  const sortedSongs = [...(songs || [])].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    // Fallback to array index if createdAt doesn't exist
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 p-4 md:p-8">
      {/* Global Loader */}
      {showLoader && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-[#181818] p-8 rounded-xl shadow-2xl border border-[#282828] flex flex-col items-center">
            <svg className="animate-spin h-12 w-12 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="mt-4 text-sky-400 text-lg font-medium">Processing...</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 bg-sky-400 hover:bg-sky-500 text-white font-medium py-2 px-4 rounded-full transition-all duration-300 hover:shadow-[0_0_10px_rgba(56,189,248,0.5)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Go to home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-[#181818] p-6 rounded-xl shadow-2xl border border-[#282828] transition-all duration-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] group">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-100 group-hover:text-sky-300 transition-colors duration-300">
              <MdAddPhotoAlternate className="text-sky-400 group-hover:text-sky-300 transition-colors duration-300" />
              Add Album
            </h2>
            <form onSubmit={addAlbumHandler}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300 group-hover:text-sky-400 transition-colors duration-300">Title</label>
                <input 
                  type="text" 
                  placeholder="Album title" 
                  className="w-full px-4 py-2 bg-[#282828] border border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-white transition-all duration-300 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300 group-hover:text-sky-400 transition-colors duration-300">Description</label>
                <input 
                  type="text" 
                  placeholder="Album description" 
                  className="w-full px-4 py-2 bg-[#282828] border border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-white transition-all duration-300 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-300 group-hover:text-sky-400 transition-colors duration-300">Thumbnail</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#404040] rounded-lg cursor-pointer bg-[#282828] transition-all duration-300 hover:bg-[#333333] hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-8 h-8 mb-3 text-gray-400 group-hover:text-sky-400 transition-colors duration-300" />
                      <p className="mb-2 text-sm text-gray-400 group-hover:text-sky-400 transition-colors duration-300 truncate w-3/4 text-center">{truncateFileName(file?.name)}</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={fileChangeHandler} required />
                  </label>
                </div>
              </div>
              <button 
                className="w-full bg-sky-400 hover:bg-sky-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_10px_rgba(56,189,248,0.5)]"
              >
                <MdAddPhotoAlternate className="text-lg group-hover:text-sky-300 transition-colors duration-300" />
                Add Album
              </button>
            </form>
          </div>

          <div className="bg-[#181818] p-6 rounded-xl shadow-2xl border border-[#282828] transition-all duration-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] group">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-100 group-hover:text-sky-300 transition-colors duration-300">
              <MdMusicNote className="text-sky-400 group-hover:text-sky-300 transition-colors duration-300" />
              Add Song
            </h2>
            <form onSubmit={addSongHandler}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300 group-hover:text-sky-400 transition-colors duration-300">Title</label>
                <input 
                  type="text" 
                  placeholder="Song title" 
                  className="w-full px-4 py-2 bg-[#282828] border border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-white transition-all duration-300 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300 group-hover:text-sky-400 transition-colors duration-300">Description</label>
                <input 
                  type="text" 
                  placeholder="Song description" 
                  className="w-full px-4 py-2 bg-[#282828] border border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-white transition-all duration-300 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300 group-hover:text-sky-400 transition-colors duration-300">Singer</label>
                <input 
                  type="text" 
                  placeholder="Singer name" 
                  className="w-full px-4 py-2 bg-[#282828] border border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-white transition-all duration-300 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]" 
                  value={singer} 
                  onChange={(e) => setSinger(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300 group-hover:text-sky-400 transition-colors duration-300">Album</label>
                <select 
                  className="w-full px-4 py-2 bg-[#282828] border border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-white transition-all duration-300 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)] appearance-none" 
                  value={album} 
                  onChange={e => setAlbum(e.target.value)} 
                  required
                >
                  <option value="">Select an album</option>
                  {albums && albums.length > 0 && albums.map((e, i) => (
                    <option value={e._id} key={i}>{e.title}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-300 group-hover:text-sky-400 transition-colors duration-300">Audio File</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#404040] rounded-lg cursor-pointer bg-[#282828] transition-all duration-300 hover:bg-[#333333] hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-8 h-8 mb-3 text-gray-400 group-hover:text-sky-400 transition-colors duration-300" />
                      <p className="mb-2 text-sm text-gray-400 group-hover:text-sky-400 transition-colors duration-300 truncate w-3/4 text-center">{truncateFileName(file?.name)}</p>
                    </div>
                    <input type="file" className="hidden" accept="audio/*" onChange={fileChangeHandler} required />
                  </label>
                </div>
              </div>
              <button 
                className="w-full bg-sky-400 hover:bg-sky-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_10px_rgba(56,189,248,0.5)]"
              >
                <MdMusicNote className="text-lg group-hover:text-sky-300 transition-colors duration-300" />
                Add Song
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12">
          <h3 className='text-xl font-semibold mb-6 flex items-center gap-2'>
            <MdAddPhotoAlternate className="text-sky-400" />
            Added Albums
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {albums && albums.length > 0 ? (
              albums.map((e, i) => (
                <div 
                  key={i} 
                  className="bg-[#181818] p-2 rounded-lg shadow-lg transition-all duration-300 group transform hover:-translate-y-2 hover:scale-105 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] hover:rotate-1"
                >
                  {e.thumbnail && e.thumbnail.url ? (
                    <div className="relative">
                      <img 
                        src={e.thumbnail.url} 
                        alt={e.title} 
                        className='w-full aspect-square object-cover rounded-md mb-1 opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]' 
                      />
                      <button 
                        onClick={() => deleteAlbumHandler(e._id)} 
                        className='absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 transform group-hover:scale-110 hover:rotate-12' 
                        title="Delete album"
                      >
                        <MdDelete className="text-xs" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative aspect-square bg-[#282828] rounded-md mb-1 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                      <div className="text-center p-1">
                        <input 
                          type="file" 
                          onChange={fileChangeHandler} 
                          className="hidden" 
                          id={`album-thumbnail-upload-${i}`} 
                        />
                        <label 
                          htmlFor={`album-thumbnail-upload-${i}`} 
                          className="cursor-pointer"
                        >
                          <FiUpload className="w-5 h-5 mx-auto mb-1 text-gray-400 group-hover:text-sky-400 transition-colors duration-300" />
                          <p className="text-xs text-gray-400 group-hover:text-sky-400 transition-colors duration-300">Add thumbnail</p>
                        </label>
                      </div>
                      <button 
                        onClick={() => addThumbnailHandler(e._id)} 
                        className="absolute bottom-1 right-1 p-1 bg-sky-400 hover:bg-sky-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110 hover:rotate-12"
                      >
                        <FiUpload className="text-xs" />
                      </button>
                    </div>
                  )}
                  <div className="px-1">
                    <h4 className='text-xs font-medium truncate group-hover:text-sky-300 transition-colors duration-300'>{e.title}</h4>
                    <h4 className='text-[10px] text-gray-400 truncate group-hover:text-sky-400 transition-colors duration-300'>{e.description}</h4>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No albums available.</p>
            )}
          </div>
        </div>

        <div className="mt-12">
          <h3 className='text-xl font-semibold mb-6 flex items-center gap-2'>
            <MdMusicNote className="text-sky-400" />
            Added Songs
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {sortedSongs && sortedSongs.length > 0 ? (
              sortedSongs.map((e, i) => (
                <div 
                  key={i} 
                  className="bg-[#181818] p-2 rounded-lg shadow-lg transition-all duration-300 group transform hover:-translate-y-2 hover:scale-105 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] hover:rotate-1"
                >
                  {e.thumbnail && e.thumbnail.url ? (
                    <div className="relative">
                      <img 
                        src={e.thumbnail.url} 
                        alt={e.title} 
                        className='w-full aspect-square object-cover rounded-md mb-1 opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]' 
                      />
                      <button 
                        onClick={() => deleteSongHandler(e._id)} 
                        className='absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 transform group-hover:scale-110 hover:rotate-12' 
                        title="Delete song"
                      >
                        <MdDelete className="text-xs" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative aspect-square bg-[#282828] rounded-md mb-1 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                      <div className="text-center p-1">
                        <input 
                          type="file" 
                          onChange={fileChangeHandler} 
                          className="hidden" 
                          id={`thumbnail-upload-${i}`} 
                        />
                        <label 
                          htmlFor={`thumbnail-upload-${i}`} 
                          className="cursor-pointer"
                        >
                          <FiUpload className="w-5 h-5 mx-auto mb-1 text-gray-400 group-hover:text-sky-400 transition-colors duration-300" />
                          <p className="text-xs text-gray-400 group-hover:text-sky-400 transition-colors duration-300">Add thumbnail</p>
                        </label>
                      </div>
                      <button 
                        onClick={() => addThumbnailHandler(e._id)} 
                        className="absolute bottom-1 right-1 p-1 bg-sky-400 hover:bg-sky-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110 hover:rotate-12"
                      >
                        <FiUpload className="text-xs" />
                      </button>
                    </div>
                  )}
                  <div className="px-1">
                    <h4 className='text-xs font-medium truncate group-hover:text-sky-300 transition-colors duration-300'>{e.title}</h4>
                    <h4 className='text-[10px] text-gray-400 truncate group-hover:text-sky-400 transition-colors duration-300'>{e.singer}</h4>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No songs available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;