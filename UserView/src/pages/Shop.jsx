import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import ProductItem from '../components/ProductItem';
import floatingImg from '../assets/cosmetics-floating.png';
import './Shop.css';

const Shop = () => {
    const { productList, categories } = useContext(StoreContext);
    const [category, setCategory] = useState("All");

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1
        };

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
    }, [category]); // Re-observe when items change

    const filteredProducts = category === "All"
        ? productList
        : productList.filter(p => {
            // Support both object categories (with name) and plain string categories
            const pCatName = typeof p.category === 'object' ? p.category.name : p.category;
            return pCatName?.toLowerCase() === category?.toLowerCase();
        });

    return (
        <div className='shop-page-v2'>
            {/* Animated Background Elements */}
            <div className="bg-animations">
                <img src={floatingImg} className="floating-element fe-1" alt="" />
                <img src={floatingImg} className="floating-element fe-2" alt="" />
                <img src={floatingImg} className="floating-element fe-3" alt="" />
                <div className="gradient-sphere gs-1"></div>
                <div className="gradient-sphere gs-2"></div>
            </div>

            <div className="shop-content-wrapper container">
                <header className='shop-header-v2 animate-box fade-in-up'>
                    <span className="shop-subtitle">Curated Collection</span>
                    <h2 className="reveal-title">Discover Your <span className="gold-text">Glow</span></h2>

                    <div className='category-pills-wrapper'>
                        <div className='category-pills'>
                            <button
                                className={`pill-btn ${category === "All" ? 'active' : ''}`}
                                onClick={() => setCategory("All")}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat._id}
                                    className={`pill-btn ${category === cat.name ? 'active' : ''}`}
                                    onClick={() => setCategory(cat.name)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <div className='shop-grid-v2'>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item, index) => (
                            <div key={item._id} className="animate-box scale-up" style={{ transitionDelay: `${index * 0.1}s` }}>
                                <ProductItem item={item} />
                            </div>
                        ))
                    ) : (
                        <div className="no-products animate-box fade-in-up">
                            <p>No products found in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
