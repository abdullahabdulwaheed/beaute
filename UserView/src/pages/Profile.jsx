import React, { useState, useContext, useEffect, useRef } from 'react';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import floatingImg from '../assets/cosmetics-floating.png';
import './Login.css';

const Profile = () => {
    const { url, token, user, setUser, theme } = useContext(StoreContext);
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        phone: ""
    });
    const [profilePic, setProfilePic] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setData({
                name: user.name || "",
                email: user.email || "",
                password: "",
                confirmPassword: "",
                address: user.address || "",
                phone: user.phone || ""
            });
            setProfilePic(user.profilePic || "");
        }
    }, [user]);

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

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setProfilePic(URL.createObjectURL(file));
        }
    }

    const uploadImage = async () => {
        if (!imageFile) return profilePic;

        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data: uploadPath } = await axios.post(`${url}/api/upload`, formData, config);
            return uploadPath;
        } catch (error) {
            console.error("Image upload failed", error);
            throw new Error("Image upload failed");
        }
    }

    const updateProfile = async (event) => {
        event.preventDefault();

        if (data.password !== data.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            let uploadedImagePath = profilePic;
            if (imageFile) {
                uploadedImagePath = await uploadImage();
            }

            const updateData = {
                name: data.name,
                email: data.email,
                address: data.address,
                phone: data.phone,
                profilePic: uploadedImagePath
            };

            if (data.password) {
                updateData.password = data.password;
            }

            const response = await axios.put(`${url}/api/users/profile`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                setUser(response.data);
                localStorage.setItem("user", JSON.stringify(response.data));
                setMessage({ type: "success", text: "Profile updated successfully!" });
                setData(prev => ({ ...prev, password: "", confirmPassword: "" }));
                setImageFile(null);
            }
        } catch (error) {
            setMessage({ type: "error", text: error.response?.data?.message || error.message || "Failed to update profile" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`login-page-v2 ${theme}`}>
            {/* Animated Background Elements */}
            <div className="bg-animations">
                <img src={floatingImg} className="floating-element fe-1" alt="" />
                <img src={floatingImg} className="floating-element fe-2" alt="" />
                <img src={floatingImg} className="floating-element fe-3" alt="" />
                <div className="gradient-sphere gs-1"></div>
                <div className="gradient-sphere gs-2"></div>
            </div>

            <div className="profile-content-wrapper container">
                <form onSubmit={updateProfile} className="login-card-premium animate-box fade-in-up profile-form-custom">
                    <div className="login-header-v2">
                        <span className="login-subtitle">Your Journey</span>
                        <h2 className="reveal-title-v4">My <span className="gold-text">Profile</span></h2>
                        <p>Personalize your signature beauty identity</p>
                    </div>

                    <div className="profile-pic-section-v2">
                        <div className="avatar-preview-v2" onClick={() => fileInputRef.current.click()}>
                            {profilePic ? (
                                <img src={profilePic.startsWith('blob:') ? profilePic : `${url}${profilePic}`} alt="Profile" />
                            ) : (
                                <div className="avatar-placeholder-v2">
                                    <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
                                    <span>Upload Photo</span>
                                </div>
                            )}
                            <div className="avatar-edit-tag">Tap to Edit</div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={onFileChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </div>

                    {message.text && (
                        <div className={`profile-alert ${message.type === 'error' ? 'error' : 'success'}`}>
                            {message.type === 'error' ? '✕' : '✓'} {message.text}
                        </div>
                    )}

                    <div className="login-inputs-v2 profile-grid-inputs">
                        <div className="input-group-v2">
                            <label>Full Name</label>
                            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />
                        </div>

                        <div className="input-group-v2">
                            <label>Email Address</label>
                            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='name@example.com' required disabled />
                        </div>

                        <div className="input-group-v2">
                            <label>Mobile Number</label>
                            <input name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Mobile number' />
                        </div>

                        <div className="input-group-v2 full-span">
                            <label>Shipping Address</label>
                            <textarea name='address' className="profile-textarea" onChange={onChangeHandler} value={data.address} placeholder='Your default shipping address' rows="3"></textarea>
                        </div>

                        <div className="divider-v2 full-span">
                            <span>Update Security</span>
                        </div>

                        <div className="input-group-v2">
                            <label>New Password</label>
                            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Enter new password' />
                        </div>

                        <div className="input-group-v2">
                            <label>Confirm Password</label>
                            <input name='confirmPassword' onChange={onChangeHandler} value={data.confirmPassword} type="password" placeholder='Confirm new password' />
                        </div>
                    </div>

                    <p className="profile-security-hint">Leave passwords blank to keep current signature</p>

                    <button type='submit' className='btn-premium-login' disabled={loading} style={{ marginTop: '20px' }}>
                        {loading ? "SAVING CHANGES..." : "UPDATE IDENTITY"}
                    </button>
                </form>
            </div>

            <style jsx="true">{`
                .profile-content-wrapper {
                    position: relative;
                    z-index: 2;
                    width: 100%;
                    max-width: 900px !important;
                    margin: 0 auto;
                    display: flex;
                    justify-content: center;
                }
                .profile-form-custom {
                    width: 100%;
                    max-width: 100% !important;
                }
                .profile-grid-inputs {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    text-align: left;
                }
                .full-span {
                    grid-column: span 2;
                }
                .profile-pic-section-v2 {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 40px;
                }
                .avatar-preview-v2 {
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                    background: var(--secondary);
                    border: 4px solid #faedcd;
                    position: relative;
                    cursor: pointer;
                    overflow: hidden;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.08);
                    transition: all 0.3s ease;
                }
                .avatar-preview-v2:hover {
                    border-color: #d4a373;
                    transform: scale(1.02);
                }
                .avatar-preview-v2 img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .avatar-placeholder-v2 {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #d4a373;
                }
                .avatar-placeholder-v2 svg {
                    width: 40px;
                    height: 40px;
                    margin-bottom: 5px;
                }
                .avatar-placeholder-v2 span {
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .avatar-edit-tag {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background: rgba(212, 163, 115, 0.9);
                    color: white;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    padding: 8px 0;
                    opacity: 0;
                    transition: all 0.3s ease;
                }
                .avatar-preview-v2:hover .avatar-edit-tag {
                    opacity: 1;
                }
                .profile-textarea {
                    width: 100%;
                    padding: 14px 20px;
                    border: 1.5px solid var(--border-color);
                    border-radius: 12px;
                    background: transparent;
                    color: var(--text-dark);
                    font-size: 15px;
                    transition: border-color 0.3s ease;
                    font-family: inherit;
                    resize: none;
                }
                .profile-textarea:focus {
                    border-color: #d4a373;
                    outline: none;
                }
                .divider-v2 {
                    position: relative;
                    text-align: center;
                    margin: 10px 0;
                }
                .divider-v2::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    width: 100%;
                    height: 1px;
                    background: var(--border-color);
                }
                .divider-v2 span {
                    position: relative;
                    background: var(--card-bg);
                    padding: 0 15px;
                    font-size: 12px;
                    font-weight: 700;
                    color: #d4a373;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                .profile-security-hint {
                    font-size: 12px;
                    color: var(--text-light);
                    margin-top: 15px;
                    font-style: italic;
                }
                .profile-alert {
                    padding: 12px 20px;
                    border-radius: 50px;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 30px;
                    display: inline-block;
                }
                .profile-alert.success {
                    background: #dcfce7;
                    color: #166534;
                    border: 1px solid #bbf7d0;
                }
                .profile-alert.error {
                    background: #fee2e2;
                    color: #991b1b;
                    border: 1px solid #fecaca;
                }
                @media (max-width: 600px) {
                    .profile-grid-inputs {
                        grid-template-columns: 1fr;
                    }
                    .full-span {
                        grid-column: span 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default Profile;

