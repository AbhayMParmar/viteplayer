import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/User";
import { SongData } from "../context/song";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { loginUser, btnLoading } = UserData();
    const { fetchSongs, fetchAlbums } = SongData();
    const navigate = useNavigate();

    const submitHandler = e => {
        e.preventDefault();
        loginUser(email, password, navigate, fetchSongs, fetchAlbums);
    };

    return (
        <div className="login-container">
            <div className="login-card hover:card-hover">
                <div className="login-header">
                    <div className="music-logo hover:logo-hover">
                        <svg viewBox="0 0 24 24" fill="rgb(74, 183, 226)" className="w-8 h-8">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                    </div>
                    <h2 className="hover:text-white/90 transition-all">Welcome Back</h2>
                    <p className="login-subtitle hover:text-white/70 transition-all">Login to continue to your Music</p>
                </div>

                <form className="login-form" onSubmit={submitHandler}>
                    <div className="form-group">
                        <label className="form-label hover:label-hover">Email or username</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email or username"
                            className="form-input hover:input-hover focus:input-focus" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label hover:label-hover">Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter your password"
                            className="form-input hover:input-hover focus:input-focus" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button disabled={btnLoading} className="login-button hover:button-hover active:button-active">
                        {btnLoading ? (
                            <span className="button-loader"></span>
                        ) : "Login"}
                    </button>
                </form>

                <div className="login-footer">
                    <span className="footer-text hover:text-white/60">Don't have an account?</span>
                    <Link to="/register" className="footer-link hover:link-hover">Sign up</Link>
                </div>
            </div>
        </div>
    )
}

export default Login;