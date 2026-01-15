import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import './Navbar.css';
import userPlaceholder from '../assets/cosmetic-user.svg';
import userPlaceholderDark from '../assets/cosmetic-user-dark.svg';
import Logo from './Logo';

const Navbar = () => {
    const { token, setToken, setUser, cartItems, theme, toggleTheme, user, url } = useContext(StoreContext);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken("");
        setUser(null);
        navigate("/");
        setMobileMenuOpen(false);
    }

    const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

    return (
        <div className={`navbar-wrapper ${theme} ${mobileMenuOpen ? 'mobile-nav-open' : ''}`}>
            <div className="navbar-pattern"></div>
            <nav className="navbar container">
                <div className="nav-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? (
                        <svg viewBox="0 0 24 24" className="toggle-icon"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    ) : (
                        <svg viewBox="0 0 24 24" className="toggle-icon"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    )}
                </div>
                <div className="nav-logo-section">
                    <Link to='/' className="logo-link" onClick={() => setMobileMenuOpen(false)}>
                        <Logo className="nav-logo-svg" />
                    </Link>
                </div>

                <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
                    <li><Link to='/' className="nav-item" onClick={() => setMobileMenuOpen(false)}><span>Home</span></Link></li>
                    <li><Link to='/shop' className="nav-item" onClick={() => setMobileMenuOpen(false)}><span>Shop</span></Link></li>
                    <li><Link to='/about' className="nav-item" onClick={() => setMobileMenuOpen(false)}><span>About</span></Link></li>
                </ul>

                <div className="nav-actions">
                    <div className={`theme-switcher ${theme}`} onClick={toggleTheme} title="Toggle Appearance">
                        <div className="switch-track">
                            <div className="switch-thumb">
                                {theme === "light" ? (
                                    <svg viewBox="0 0 24 24" className="theme-icon sun">
                                        <circle cx="12" cy="12" r="5" />
                                        <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" className="theme-icon moon">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="action-icons">
                        <Link to='/cart' className="cart-container">
                            <svg className="action-svg" viewBox="0 0 24 24">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z M3 6h18 M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            <span className="cart-dot">{cartCount}</span>
                        </Link>

                        {!token ? (
                            <Link to='/login' className="login-icon-btn" title="Sign In">
                                <svg className="action-svg" viewBox="0 0 24 24">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        ) : (
                            <div className="user-dropdown-wrapper">
                                <img
                                    src={user?.profilePic ? `${url}${user.profilePic}` : (theme === 'dark' ? userPlaceholderDark : userPlaceholder)}
                                    alt="User"
                                    className="nav-user-avatar"
                                />
                                <div className="dropdown-panel">
                                    <div className="dropdown-header">
                                        <p className="welcome-txt">Welcome,</p>
                                        <p className="profile-name">{user?.name}</p>
                                    </div>
                                    <Link to='/profile' className="panel-link">My Profile</Link>
                                    <Link to='/myorders' className="panel-link">Orders</Link>
                                    <div className="panel-divider"></div>
                                    <p onClick={logout} className="logout-action">Sign Out</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
