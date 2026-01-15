import React, { useContext, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import floatingImg from '../assets/cosmetics-floating.png';
import './Cart.css';

const Cart = () => {
    const { cartItems, productList, removeFromCart, addToCart, getTotalCartAmount, theme, token } = useContext(StoreContext);
    const navigate = useNavigate();

    const proceedToCheckout = () => {
        if (!token) {
            navigate('/login?redirect=order');
        } else {
            navigate('/order');
        }
    }

    useEffect(() => {
        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.animate-box');
        animatedElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className={`cart-page-v2 ${theme}`}>
            {/* Animated Background Elements */}
            <div className="bg-animations">
                <img src={floatingImg} className="floating-element fe-1" alt="" />
                <img src={floatingImg} className="floating-element fe-2" alt="" />
                <img src={floatingImg} className="floating-element fe-3" alt="" />
                <div className="gradient-sphere gs-1"></div>
                <div className="gradient-sphere gs-2"></div>
            </div>

            <div className="cart-content-wrapper container">
                <div className='cart-header-v2 animate-box fade-in-up'>
                    <span className="cart-subtitle">Secure Checkout</span>
                    <h2 className="reveal-title-v3">Your Beauty <span className="gold-text">Basket</span></h2>
                    <p className="cart-desc">Review your signature selection before we prepare your shipment.</p>
                </div>

                <div className='cart-grid-v2'>
                    <div className='cart-items-main animate-box slide-in-left'>
                        <div className="items-card-premium">
                            <div className='cart-items-header-v2'>
                                <p>Article</p>
                                <p>Price</p>
                                <p>Quantity</p>
                                <p>Total</p>
                            </div>

                            <div className="items-scroll-area">
                                {productList.map((item) => {
                                    if (cartItems[item._id] > 0) {
                                        return (
                                            <div key={item._id} className='cart-item-row-v2'>
                                                <div className='item-info-premium'>
                                                    <div className="item-image-box">
                                                        <img src={item.images[0]} alt={item.name} />
                                                    </div>
                                                    <div className="item-meta">
                                                        <p className='item-name-p'>{item.name}</p>
                                                        <p className='item-brand-p'>{item.brand}</p>
                                                    </div>
                                                </div>
                                                <p className='item-price-p'>${item.price.toFixed(2)}</p>
                                                <div className='qty-widget-premium'>
                                                    <button onClick={() => removeFromCart(item._id)} className="qty-btn">−</button>
                                                    <span className="qty-val">{cartItems[item._id]}</span>
                                                    <button onClick={() => addToCart(item._id)} className="qty-btn">+</button>
                                                </div>
                                                <p className='item-total-p'>${(item.price * cartItems[item._id]).toFixed(2)}</p>
                                                <button className="remove-btn-v2" onClick={() => removeFromCart(item._id)}>✕</button>
                                            </div>
                                        )
                                    }
                                    return null;
                                })}

                                {Object.values(cartItems).every(q => q === 0) && (
                                    <div className="empty-state-v2">
                                        <div className="empty-icon">🛍️</div>
                                        <p>Your basket is currently empty.</p>
                                        <button className='btn-premium' onClick={() => navigate('/shop')}>DISCOVER PRODUCTS</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='cart-summary-side animate-box slide-in-right'>
                        <div className='summary-card-premium'>
                            <h3>Summary</h3>
                            <div className='summary-breakdown'>
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>${getTotalCartAmount().toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>{getTotalCartAmount() === 0 ? "$0.00" : "$5.00"}</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row grand-total">
                                    <span>Total</span>
                                    <span>${getTotalCartAmount() === 0 ? "0.00" : (getTotalCartAmount() + 5).toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                className='btn-premium-checkout'
                                disabled={getTotalCartAmount() === 0}
                                onClick={proceedToCheckout}
                            >
                                PROCEED TO PAYMENT
                            </button>
                            <p className="summary-note">Complementary shipping on orders over $150</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
