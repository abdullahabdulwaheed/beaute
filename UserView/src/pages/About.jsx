import React, { useEffect } from 'react';
import './About.css';
import aboutImg from '../assets/about.png';
import floatingImg from '../assets/cosmetics-floating.png';

const About = () => {
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
        <div className='about-page'>
            {/* Animated Background Elements */}
            <div className="bg-animations">
                <img src={floatingImg} className="floating-element fe-1" alt="" />
                <img src={floatingImg} className="floating-element fe-2" alt="" />
                <img src={floatingImg} className="floating-element fe-3" alt="" />
                <div className="gradient-sphere gs-1"></div>
                <div className="gradient-sphere gs-2"></div>
            </div>

            <section className='about-hero-v2'>
                <div className='hero-content container'>
                    <div className="hero-text-wrapper">
                        <span className="subtitle fade-in-up">Our Journey</span>
                        <h1 className='reveal-text-v2'>Elegance in Every <br /><span className='premium-gradient'>Formula.</span></h1>
                        <p className='fade-in-up delay-1'>At BEAUTÉ, we redefine luxury skincare through a harmonic blend of botanical wisdom and scientific precision.</p>
                        <div className="scroll-indicator fade-in-up delay-2">
                            <span>Scroll to explore</span>
                            <div className="line"></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='our-story-v2 container'>
                <div className='story-grid'>
                    <div className='story-visual animate-on-scroll scale-up'>
                        <div className="image-frame">
                            <img src={aboutImg} alt="Our Heritage" />
                        </div>
                        <div className="experience-tag">
                            <span className="number">10+</span>
                            <span className="label">Years of Research</span>
                        </div>
                    </div>
                    <div className='story-info animate-on-scroll slide-in-right'>
                        <h2 className="section-subtitle">Since 2014</h2>
                        <h3 className="section-title-v2">Crafting Timeless Beauty</h3>
                        <p>BEAUTÉ wasn't born in a boardroom, but in a small boutique laboratory dedicated to solving specific skincare challenges without compromising on luxury.</p>
                        <p>We started with three botanical serums. Today, we are a global beauty house, yet we still hand-inspect every batch to ensure the quality that our connoisseurs expect.</p>
                        <div className="signature">BEAUTÉ Founders</div>
                    </div>
                </div>
            </section>

            <section className='values-v2'>
                <div className='container'>
                    <div className="center-header animate-on-scroll fade-in-up">
                        <h2 className="section-title-v2">Unwavering Standards</h2>
                        <p>The three pillars that support every product we create.</p>
                    </div>
                    <div className='values-cards-container'>
                        <div className='value-glass-card animate-on-scroll fade-in-up'>
                            <div className='card-icon'>🌿</div>
                            <h4>Pure Essence</h4>
                            <p>Sustainably harvested botanicals at the peak of their potency for natural efficacy.</p>
                        </div>
                        <div className='value-glass-card animate-on-scroll fade-in-up delay-1'>
                            <div className='card-icon'>🔬</div>
                            <h4>Clinical Precision</h4>
                            <p>Rigorous dermatological testing ensures every formula delivers visible, lasting results.</p>
                        </div>
                        <div className='value-glass-card animate-on-scroll fade-in-up delay-2'>
                            <div className="card-icon">✨</div>
                            <h4>Timeless Luxury</h4>
                            <p>Beyond the product, we provide an sensory experience that elevates your daily ritual.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className='mission-v2'>
                <div className='container'>
                    <div className="mission-content-v2 animate-on-scroll scale-up">
                        <span className="quote-mark">“</span>
                        <p className="mission-text">To empower every individual to embrace their unique radiance through the marriage of conscious luxury and uncompromising quality.</p>
                        <div className="mission-line"></div>
                        <h5 className="mission-author">— Our Philosophy</h5>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
