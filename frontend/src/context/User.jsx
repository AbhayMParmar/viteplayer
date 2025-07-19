import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState([]);
    const [isAuth, setIsAuth] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const closeUserDropdown = () => {
        setIsUserDropdownOpen(false);
    };

    async function registerUser(name, email, password, navigate, fetchSongs, fetchAlbums) {
        setBtnLoading(true);
        try {
            const { data } = await axios.post("/api/user/register", {
                name,
                email,
                password
            }, { withCredentials: true });

            toast.success(data.message);
            setUser(data.user);
            setIsAuth(true);
            setBtnLoading(false);
            navigate("/");
            fetchSongs();
            fetchAlbums();
        } catch (error) {
            toast.error(error.response.data.message);
            setBtnLoading(false);
        }
    }

    async function loginUser(email, password, navigate, fetchSongs, fetchAlbums) {
        setBtnLoading(true);
        try {
            const { data } = await axios.post("/api/user/login", {
                email,
                password,
            }, { withCredentials: true });

            toast.success(data.message);
            setUser(data.user);
            setIsAuth(true);
            setBtnLoading(false);
            navigate("/");
            fetchSongs();
            fetchAlbums();
        } catch (error) {
            toast.error(error.response.data.message);
            setBtnLoading(false);
        }
    }

    async function fetchUser() {
        try {
            const { data } = await axios.get("/api/user/me", { withCredentials: true });
            setUser(data);
            setIsAuth(true);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setIsAuth(false);
            setLoading(false);
        }
    }

    async function logoutUser() {
        try {
            await axios.get("/api/user/logout", { withCredentials: true });
            setUser([]);
            setIsAuth(false);
            closeUserDropdown();
            window.location.reload();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function addToPlaylist(id) {
        try {
            const { data } = await axios.post("/api/user/song/" + id, {}, { withCredentials: true });
            toast.success(data.message);
            fetchUser();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    // Enhanced user avatar with smooth hover effect
    const getUserAvatar = () => {
        if (!user || !user.email) return '';
        const firstLetter = user.email.charAt(0).toUpperCase();
        const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];
        const colorIndex = firstLetter.charCodeAt(0) % colors.length;
        return (
            <div
                className={`${colors[colorIndex]} w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:ring-2 hover:ring-sky-400`}
                onClick={toggleUserDropdown}
            >
                {firstLetter}
            </div>
        );
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{
            registerUser,
            user,
            isAuth,
            btnLoading,
            loading,
            loginUser,
            logoutUser,
            addToPlaylist,
            isUserDropdownOpen,
            toggleUserDropdown,
            closeUserDropdown,
            getUserAvatar
        }}>
            {children}
            <Toaster />
        </UserContext.Provider>
    );
};

export const UserData = () => useContext(UserContext);