import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';
import floatingImg from '../assets/cosmetics-floating.png';

const Register = () => {
    const { url, setToken, setUser, loadCartData, theme } = useContext(StoreContext);
    const [data, setData] = useState({ name: "", email: "", password: "" });
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

    const onRegister = async (event) => {
        if (event) event.preventDefault();
        try {
            const response = await axios.post(`${url}/api/users`, data);
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
        if (loadCartData) {
            await loadCartData(userData.token);
        }
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
            });
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
                <form onSubmit={onRegister} className="login-card-premium animate-box fade-in-up">
                    <div className="login-header-v2">
                        <span className="login-subtitle">Join us</span>
                        <h2 className="reveal-title-v4">Create <span className="gold-text">Account</span></h2>
                        <p>Start your personalized beauty journey today</p>
                    </div>

                    <div className="login-inputs-v2">
                        <div className="input-group-v2">
                            <label>Full Name</label>
                            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />
                        </div>
                        <div className="input-group-v2">
                            <label>Email Address</label>
                            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='name@example.com' required />
                        </div>
                        <div className="input-group-v2">
                            <label>Password</label>
                            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Create a password' required />
                        </div>
                    </div>

                    <button type='submit' className='btn-premium-login'>Create Account</button>

                    <div className="google-divider-v2">
                        <span>OR SIGN UP WITH</span>
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
                        Already have an account? <Link to='/login' className="gold-link">Login Here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
