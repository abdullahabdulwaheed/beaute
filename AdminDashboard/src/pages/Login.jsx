import React, { useState, useContext } from 'react';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { AdminContext } from '../context/AdminContext';
import Logo from '../components/Logo';
import './Login.css';

const Login = () => {
    const { url, setToken, setAdmin } = useContext(AdminContext);
    const [data, setData] = useState({ email: "", password: "" });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${url}/api/users/login`, data, { withCredentials: true });
            if (response.data.token) {
                if (response.data.role !== 'admin') {
                    alert("Access denied. Admin only.");
                    return;
                }
                setToken(response.data.token);
                setAdmin(response.data);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data));
            }
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className='admin-login'>
            <form onSubmit={onLogin} className="login-container card">
                <div className="login-header">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                        <Logo width="200" height="50" />
                    </div>
                    <p>Welcome back, please login to your account.</p>
                </div>
                <div className="input-group">
                    <label>Email Address</label>
                    <div className="input-with-icon">
                        <Mail size={18} className="input-icon" />
                        <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='admin@example.com' required />
                    </div>
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <div className="input-with-icon">
                        <Lock size={18} className="input-icon" />
                        <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='••••••••' required />
                    </div>
                </div>
                <button type='submit' className='btn btn-primary' style={{ width: '100%', marginTop: '10px' }}>
                    Login to Dashboard
                </button>
            </form>
        </div>
    );
};

export default Login;
