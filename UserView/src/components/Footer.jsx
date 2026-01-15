import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import './Footer.css';
import patternIcon from '../assets/footer-pattern.svg';

const Footer = () => {
    const { theme } = useContext(StoreContext);

    return (
        <footer className={`footer ${theme}`} style={{ '--footer-bg': `url(${patternIcon})` }}>
            <div className="container footer-content">
                <div className="footer-section brand-info">
                    <h2 className="footer-logo">BEAUTÉ</h2>
                    <p>Elevating your natural radiance through the perfect harmony of nature and science. Our formulas are crafted with uncompromising luxury and conscious quality.</p>
                    <div className="social-links">
                        <a href="#" className="social-icon">Instagram</a>
                        <a href="#" className="social-icon">Pinterest</a>
                        <a href="#" className="social-icon">Facebook</a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/shop">Shop Collection</Link></li>
                        <li><Link to="/about">Our Story</Link></li>
                        <li><Link to="/profile">My Account</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Customer Care</h4>
                    <ul>
                        <li><a href="#">Shipping Policy</a></li>
                        <li><a href="#">Returns & Exchanges</a></li>
                        <li><a href="#">FAQs</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

                <div className="footer-section newsletter">
                    <h4>Join the Club</h4>
                    <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
                    <form className="newsletter-form">
                        <input type="email" placeholder="Enter your email" required />
                        <button type="submit" className="btn-subscribe">Join</button>
                    </form>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container bottom-content">
                    <p>&copy; 2024 BEAUTÉ. All rights reserved.</p>
                    <div className="bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
