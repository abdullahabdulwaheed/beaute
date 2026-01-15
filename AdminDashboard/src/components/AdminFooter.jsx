import React from 'react';
import './AdminFooter.css';

const AdminFooter = () => {
    return (
        <footer className="admin-footer">
            <div className="admin-footer-content">
                <div className="admin-footer-left">
                    <p>&copy; {new Date().getFullYear()} <b>BEAUTÉ</b> Admin Panel. v1.0.0</p>
                </div>
                <div className="admin-footer-right">
                    <ul className="admin-footer-links">
                        <li><a href="#">Support</a></li>
                        <li><a href="#">Documentation</a></li>
                        <li><a href="#">Terms</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default AdminFooter;
