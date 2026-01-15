import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import ProductDisplay from '../components/ProductDisplay';
import floatingImg from '../assets/cosmetics-floating.png';
import './About.css'; // Reuse the animation styles

const Home = () => {
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

        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className='home-page-v2'>
            {/* Animated Background Elements */}
            <div className="bg-animations">
                <img src={floatingImg} className="floating-element fe-1" alt="" />
                <img src={floatingImg} className="floating-element fe-2" alt="" />
                <img src={floatingImg} className="floating-element fe-3" alt="" />
                <div className="gradient-sphere gs-1"></div>
                <div className="gradient-sphere gs-2"></div>
            </div>

            <div className="content-relative">
                <Hero />
                <div className="animate-on-scroll fade-in-up">
                    <ProductDisplay />
                </div>
            </div>

            <style jsx="true">{`
                .home-page-v2 {
                    position: relative;
                    overflow: hidden;
                    background-color: var(--premium-bg);
                }
                .content-relative {
                    position: relative;
                    z-index: 1;
                }
            `}</style>
        </div>
    );
};

export default Home;
