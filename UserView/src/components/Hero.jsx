import React from 'react';
import './Hero.css';
import heroImg from '../assets/hero-cosmetics.png';

const Hero = () => {
    return (
        <div className='hero-v2'>
            <div className='hero-content-v2 container'>
                <div className="hero-text-box">
                    <span className="hero-subtitle fade-in-up">Ethereal Collection 2024</span>
                    <h1 className='hero-title reveal-text-v2'>Radiance <br /><span className="text-outline">Redefined.</span></h1>
                    <p className='hero-desc fade-in-up delay-1'>Experience the ultimate fusion of nature and science. Our curated collection brings out your inner glow with uncompromising luxury.</p>
                    <div className="hero-btns fade-in-up delay-2">
                        <button className='btn-premium'>Shop Now</button>
                        <button className='btn-outline'>Explore Story</button>
                    </div>
                </div>
                <div className="hero-visual-v2 fade-in-up">
                    <div className="visual-circle"></div>
                    <img src={heroImg} alt="Luxury Cosmetics" className="hero-img-v2" />
                </div>
            </div>
        </div>
    );
};

export default Hero;
