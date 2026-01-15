import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';

import floatingImg from '../assets/cosmetics-floating.png';

const Login = () => {
    const { url, setToken, setUser, loadCartData, theme } = useContext(StoreContext);
    const [data, setData] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || "";

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.1 });

        const animatedElements = document.querySelectorAll('.animate-box');
        animatedElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onLogin = async (event) => {
        if (event) event.preventDefault();
        try {
            const response = await axios.post(`${url}/api/users/login`, data, { withCredentials: true });
            if (response.data.token) {
                handleLoginSuccess(response.data);
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    }

    const handleLoginSuccess = async (userData) => {
        setToken(userData.token);
        setUser(userData);
        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData));
        await loadCartData(userData.token);
        if (redirect) {
            navigate(`/${redirect}`);
        } else {
            navigate("/");
        }
    }

    const onGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post(`${url}/api/users/google-login`, {
                tokenId: credentialResponse.credential
            }, { withCredentials: true });
            if (response.data.token) {
                handleLoginSuccess(response.data);
            }
        } catch (error) {
            console.error("Google Login Error:", error);
            alert("Google login failed");
        }
    }

    return (
        <div className={`login-page-v2 ${theme}`}>
            {/* Animated Background Elements */}
            <div className="bg-animations">
                <img src={floatingImg} className="floating-element fe-1" alt="" />
                <img src={floatingImg} className="floating-element fe-2" alt="" />
                <div className="gradient-sphere gs-1"></div>
            </div>

            <div className="login-content-wrapper container">
                <form onSubmit={onLogin} className="login-card-premium animate-box fade-in-up">
                    <div className="login-header-v2">
                        <span className="login-subtitle">Ethereal Collection</span>
                        <h2 className="reveal-title-v4">Welcome <span className="gold-text">Back</span></h2>
                        <p>Sign in to continue your beauty journey</p>
                    </div>

                    <div className="login-inputs-v2">
                        <div className="input-group-v2">
                            <label>Email Address</label>
                            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='name@example.com' required />
                        </div>
                        <div className="input-group-v2">
                            <label>Password</label>
                            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Enter your password' required />
                        </div>
                    </div>

                    <button type='submit' className='btn-premium-login'>Sign In</button>

                    <div className="google-divider-v2">
                        <span>OR CONTINUE WITH</span>
                    </div>

                    <div className="google-btn-wrapper">
                        <GoogleLogin
                            onSuccess={onGoogleSuccess}
                            onError={() => console.log('Login Failed')}
                            theme={theme === 'dark' ? 'filled_black' : 'outline'}
                            shape="pill"
                        />
                    </div>

                    <p className="login-footer-text">
                        Don't have an account? <Link to='/register' className="gold-link">Create Account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
