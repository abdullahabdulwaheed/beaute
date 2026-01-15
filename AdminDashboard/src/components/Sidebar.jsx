import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    PlusCircle,
    Package,
    ClipboardList,
    Layers,
    Users
} from 'lucide-react';
import { AdminContext } from '../context/AdminContext';
import Logo from './Logo';
import './Sidebar.css';

const Sidebar = () => {
    const { showSidebar, setShowSidebar } = useContext(AdminContext);

    return (
        <>
            <div className={`sidebar ${showSidebar ? 'mobile-show' : ''}`}>
                <div className="logo">
                    <Logo showAdmin={true} width="160" height="40" />
                </div>
                <div className="sidebar-links">
                    <NavLink to='/dashboard' onClick={() => setShowSidebar(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                        <LayoutDashboard size={20} className="nav-icon" />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to='/add-product' onClick={() => setShowSidebar(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                        <PlusCircle size={20} className="nav-icon" />
                        <span>Add Product</span>
                    </NavLink>
                    <NavLink to='/list-products' onClick={() => setShowSidebar(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                        <Package size={20} className="nav-icon" />
                        <span>Product List</span>
                    </NavLink>
                    <NavLink to='/orders' onClick={() => setShowSidebar(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                        <ClipboardList size={20} className="nav-icon" />
                        <span>Orders</span>
                    </NavLink>
                    <NavLink to='/categories' onClick={() => setShowSidebar(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                        <Layers size={20} className="nav-icon" />
                        <span>Categories</span>
                    </NavLink>
                    <NavLink to='/users' onClick={() => setShowSidebar(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                        <Users size={20} className="nav-icon" />
                        <span>Users</span>
                    </NavLink>
                </div>
            </div>
            {showSidebar && <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}></div>}
        </>
    );
};

export default Sidebar;
