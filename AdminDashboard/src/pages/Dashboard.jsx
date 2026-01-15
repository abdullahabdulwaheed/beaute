import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from '../context/AdminContext';
import './Dashboard.css';

const Dashboard = () => {
    const { url, token } = useContext(AdminContext);
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        revenue: 0
    });

    const fetchStats = async () => {
        try {
            const products = await axios.get(`${url}/api/products`);
            const orders = await axios.get(`${url}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const users = await axios.get(`${url}/api/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const revenue = orders.data.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

            setStats({
                products: products.data.length,
                orders: orders.data.length,
                users: users.data.length,
                revenue: revenue.toFixed(2)
            });
        } catch (error) {
            console.error("Error fetching stats", error);
        }
    }

    useEffect(() => {
        if (token) {
            fetchStats();
        }
    }, [token]);

    return (
        <div className='dashboard-page'>
            <h3>Dashboard Overview</h3>
            <div className="stats-grid">
                <div className="stat-card card">
                    <p>Total Revenue</p>
                    <h2>${stats.revenue}</h2>
                </div>
                <div className="stat-card card">
                    <p>Total Orders</p>
                    <h2>{stats.orders}</h2>
                </div>
                <div className="stat-card card">
                    <p>Products</p>
                    <h2>{stats.products}</h2>
                </div>
                <div className="stat-card card">
                    <p>Registered Users</p>
                    <h2>{stats.users}</h2>
                </div>

            </div>

            <div className="recent-activity card">
                <h4>Inventory Status</h4>
                <p>Welcome to the BEAUTÉ Admin Panel. Manage your cosmetics inventory and track customer orders with ease.</p>
            </div>
        </div>
    );
};

export default Dashboard;
