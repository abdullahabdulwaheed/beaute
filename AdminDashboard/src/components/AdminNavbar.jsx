import React, { useContext } from 'react';
import { Sun, Moon, LogOut, Menu, X } from 'lucide-react';
import { AdminContext } from '../context/AdminContext';
import './AdminNavbar.css';

const AdminNavbar = () => {
    const { theme, toggleTheme, logout, admin, showSidebar, toggleSidebar } = useContext(AdminContext);

    return (
        <div className='admin-navbar'>
            <div className='admin-navbar-left'>
                <button className='mobile-menu-btn' onClick={toggleSidebar}>
                    {showSidebar ? <X size={24} /> : <Menu size={24} />}
                </button>
                <h3>Admin Panel</h3>
            </div>
            <div className='admin-navbar-right'>
                <button
                    className='nav-icon-btn theme-toggle'
                    onClick={toggleTheme}
                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <div className='admin-profile'>
                    <div className='admin-user-details'>
                        <span className='admin-name'>{admin?.name || 'Admin'}</span>
                        <span className='admin-role'>System Admin</span>
                    </div>
                    <div className='admin-avatar'>
                        {admin?.name?.charAt(0) || 'A'}
                    </div>
                </div>
                <button onClick={logout} className='nav-icon-btn logout-icon-btn' title="Logout">
                    <LogOut size={20} />
                </button>

            </div>
        </div>
    );

};

export default AdminNavbar;
