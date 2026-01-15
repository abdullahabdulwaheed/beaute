import React, { useContext, useRef } from 'react';
import { StoreContext } from '../context/StoreContext';
import ProductItem from './ProductItem';
import './ProductDisplay.css';

const ProductDisplay = () => {
    const { productList, theme } = useContext(StoreContext);
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const { current } = scrollRef;
        const scrollAmount = current.offsetWidth / 3 + 10;
        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className={`product-display-section ${theme}`}>
            <div className="product-display container">
                <div className="slider-header-v2">
                    <span className="slider-subtitle">Most Wanted</span>
                    <h3 className="slider-title">Featured <span className="gold-accent">Collection</span></h3>
                    <p className="slider-desc">Hand-picked essentials for your daily beauty ritual</p>
                </div>
                <div className="slider-wrapper">
                    <button className="slider-arrow left" onClick={() => scroll('left')}>
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <div className='product-slider-container' ref={scrollRef}>
                        <div className='product-slider-track'>
                            {productList.map((item) => (
                                <div className="slider-item" key={item._id} style={{ transitionDelay: `${productList.indexOf(item) * 0.1}s` }}>
                                    <ProductItem item={item} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="slider-arrow right" onClick={() => scroll('right')}>
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDisplay;
