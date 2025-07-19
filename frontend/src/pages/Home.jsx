import React, { useRef, useState, useEffect } from "react";
import Layout from "../components/Layout";
import { SongData } from "../context/song";
import AlbumItem from "../components/AlbumItem";
import SongItem from "../components/SongItem";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Home = () => {
  const { songs, albums } = SongData();
  const desktopAlbumsRef = useRef(null);
  const mobileAlbumsRef = useRef(null);
  const newAlbumsRef = useRef(null);
  const songsRef = useRef(null);
  const [showMoreSongs, setShowMoreSongs] = useState(false);
  const [customRows, setCustomRows] = useState([]);

  // Mobile view settings
  const MOBILE_INITIAL_SONGS = 4;
  const MOBILE_MAX_SONGS = 16;

  // Fetch custom rows on component mount with proper error handling
  useEffect(() => {
    const fetchCustomRows = async () => {
      try {
        const response = await fetch("/api/song/row/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCustomRows(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching custom rows:", error);
        setCustomRows([]);
      }
    };

    fetchCustomRows();
  }, []);

  // Sort songs by createdAt (newest first) and limit to 16
  const todaysBiggestHits = songs
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, MOBILE_MAX_SONGS);
  const canShowMoreMobile = todaysBiggestHits.length > MOBILE_INITIAL_SONGS;

  // Get Shiddat album
  const shiddatAlbum = albums.find((album) => album.title === "Shiddat");

  // Featured Charts - first 4 albums (excluding Emraan Hashmi) plus Shiddat as first item
  const firstFourAlbums = albums
    .slice(0, 4)
    .filter((album) => album.title !== "Emraan Hashmi");
  const featuredAlbums = shiddatAlbum
    ? [shiddatAlbum, ...firstFourAlbums]
    : firstFourAlbums;

  // New Releases - Single Emraan Hashmi album plus all albums after index 5 (excluding duplicates)
  const emraanAlbum = albums.find((album) => album.title === "Emraan Hashmi");
  const newReleaseAlbums = [
    ...(emraanAlbum ? [emraanAlbum] : []),
    ...albums
      .slice(5)
      .filter(
        (album) => album.title !== "Emraan Hashmi" && album.title !== "Shiddat"
      ),
  ];

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      ref.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Function to render custom rows
  const renderCustomRow = (row, ref) => {
    const items = row.items || [];
    if (items.length === 0) return null;

    return (
      <div key={row._id} className="mb-8 relative">
        <div className="flex justify-between items-center my-5">
          <h1 className="font-bold text-xl md:text-2xl">{row.name}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(ref, "left")}
              className="p-2 rounded-full bg-gray-600 hover:bg-gray-500"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => scroll(ref, "right")}
              className="p-2 rounded-full bg-gray-600 hover:bg-gray-500"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
        <div className="relative">
          <div
            ref={ref}
            className="flex overflow-x-auto scrollbar-hide gap-4 px-1 py-2"
          >
            {items.map((item, i) => (
              <div
                key={`${row._id}-${i}`}
                className="flex-none w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
              >
                {row.itemType === "albums" ? (
                  <AlbumItem
                    image={item.thumbnail?.url}
                    name={item.title}
                    desc={item.description}
                    id={item._id}
                    compact={true}
                    hoverClass="hover:scale-100"
                  />
                ) : (
                  <SongItem
                    image={item.thumbnail?.url}
                    name={item.title}
                    desc={item.description || item.singer}
                    id={item._id}
                    compact={true}
                    hoverClass="hover:scale-100"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Separate rows by location
  const topRows = customRows.filter((row) => row.location === "top");
  const middleRows = customRows.filter((row) => row.location === "middle");
  const bottomRows = customRows.filter((row) => row.location === "bottom");

  return (
    <Layout>
      <div className="flex flex-col md:flex-col-reverse">
        {/* Top Section - Custom Rows */}
        {topRows.map((row, i) => {
          const ref = useRef(null);
          return renderCustomRow(row, ref);
        })}

        {/* Mobile View - Songs Section */}
        <div className="mb-8 md:hidden">
          <div className="flex justify-between items-center my-5">
            <h1 className="font-bold text-xl">Today's biggest hits</h1>
            {!showMoreSongs && canShowMoreMobile && (
              <button
                onClick={() => setShowMoreSongs(true)}
                className="text-sm text-sky-400 hover:text-sky-300"
              >
                Show More
              </button>
            )}
          </div>
          <div className="flex flex-wrap justify-between gap-y-4">
            {(showMoreSongs
              ? todaysBiggestHits
              : todaysBiggestHits.slice(0, MOBILE_INITIAL_SONGS)
            ).map((e, i) => (
              <SongItem
                key={i}
                image={e.thumbnail?.url}
                name={e.title}
                desc={e.description}
                id={e._id}
                compact={true}
                hoverClass="hover:scale-100"
              />
            ))}
          </div>
          {showMoreSongs && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowMoreSongs(false)}
                className="text-sm text-sky-400 hover:text-sky-300"
              >
                Show Less
              </button>
            </div>
          )}
        </div>

        {/* Desktop View - Songs Section */}
        <div className="mb-8 hidden md:block relative">
          <div className="flex justify-between items-center my-5">
            <h1 className="font-bold text-2xl">Today's biggest hits</h1>
            <div className="flex gap-2">
              <button
                onClick={() => scroll(songsRef, "left")}
                className="p-2 rounded-full bg-gray-600 hover:bg-gray-500"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() => scroll(songsRef, "right")}
                className="p-2 rounded-full bg-gray-600 hover:bg-gray-500"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
          <div className="relative">
            <div
              ref={songsRef}
              className="flex overflow-x-auto scrollbar-hide gap-4 px-1 py-2"
            >
              {todaysBiggestHits.map((e, i) => (
                <div
                  key={i}
                  className="flex-none w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
                >
                  <SongItem
                    image={e.thumbnail?.url}
                    name={e.title}
                    desc={e.description}
                    id={e._id}
                    hoverClass="hover:scale-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Section - Custom Rows */}
        {middleRows.map((row, i) => {
          const ref = useRef(null);
          return renderCustomRow(row, ref);
        })}

        {/* New Albums Section - Mobile View (New Releases) */}
        <div className="mb-8 md:hidden">
          <div className="flex justify-between items-center my-5">
            <h1 className="font-bold text-xl">New Releases</h1>
          </div>
          <div className="relative">
            <div
              ref={newAlbumsRef}
              className="flex overflow-x-auto scrollbar-hide gap-4 px-1 py-2"
            >
              {newReleaseAlbums.map((e, i) => (
                <div key={`new-${i}`} className="flex-none w-[160px]">
                  <AlbumItem
                    image={e.thumbnail?.url}
                    name={e.title}
                    desc={e.description}
                    id={e._id}
                    compact={true}
                    hoverClass="hover:scale-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Albums Section - Desktop View (Featured Charts) */}
        <div className="mb-8 hidden md:block relative">
          <div className="flex justify-between items-center my-5">
            <h1 className="font-bold text-2xl">Featured Charts</h1>
            <div className="flex gap-2">
              <button
                onClick={() => scroll(desktopAlbumsRef, "left")}
                className="p-2 rounded-full bg-gray-600 hover:bg-gray-500"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() => scroll(desktopAlbumsRef, "right")}
                className="p-2 rounded-full bg-gray-600 hover:bg-gray-500"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
          <div className="relative">
            <div
              ref={desktopAlbumsRef}
              className="flex overflow-x-auto scrollbar-hide gap-4 px-1 py-2"
            >
              {featuredAlbums.map((e, i) => (
                <div
                  key={`featured-${i}`}
                  className="flex-none w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
                >
                  <AlbumItem
                    image={e.thumbnail?.url}
                    name={e.title}
                    desc={e.description}
                    id={e._id}
                    hoverClass="hover:scale-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Albums Section - Mobile View (Featured Charts) */}
        <div className="mb-8 md:hidden">
          <div className="flex justify-between items-center my-5">
            <h1 className="font-bold text-xl">Featured Charts</h1>
          </div>
          <div className="relative">
            <div
              ref={mobileAlbumsRef}
              className="flex overflow-x-auto scrollbar-hide gap-4 px-1 py-2"
            >
              {featuredAlbums.map((e, i) => (
                <div key={i} className="flex-none w-[160px]">
                  <AlbumItem
                    image={e.thumbnail?.url}
                    name={e.title}
                    desc={e.description}
                    id={e._id}
                    compact={true}
                    hoverClass="hover:scale-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* New Albums Section - Desktop View (New Releases) */}
        <div className="mb-8 hidden md:block relative">
          <div className="flex justify-between items-center my-5">
            <h1 className="font-bold text-2xl">New Releases</h1>
            <div className="flex gap-2">
              <button
                onClick={() => scroll(newAlbumsRef, "left")}
                className="p-2 rounded-full bg-gray-600 hover:bg-gray-500"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() => scroll(newAlbumsRef, "right")}
                className="p-2 rounded-full bg-gray-600 hover:bg-gray-500"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
          <div className="relative">
            <div
              ref={newAlbumsRef}
              className="flex overflow-x-auto scrollbar-hide gap-4 px-1 py-2"
            >
              {newReleaseAlbums.map((e, i) => (
                <div
                  key={`new-${i}`}
                  className="flex-none w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
                >
                  <AlbumItem
                    image={e.thumbnail?.url}
                    name={e.title}
                    desc={e.description}
                    id={e._id}
                    hoverClass="hover:scale-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Custom Rows */}
        {bottomRows.map((row, i) => {
          const ref = useRef(null);
          return renderCustomRow(row, ref);
        })}
      </div>
    </Layout>
  );
};

export default Home;