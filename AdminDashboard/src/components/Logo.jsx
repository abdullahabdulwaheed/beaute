import React from 'react';

const Logo = ({ className, width = "180", height = "48" }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg
                className={className}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 300 80"
                width={width}
                height={height}
            >
                <defs>
                    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#d4a373" stopOpacity="1" />
                        <stop offset="100%" stopColor="#8c6a4a" stopOpacity="1" />
                    </linearGradient>
                </defs>

                {/* Stylized Icon: Abstract Flower / Drop */}
                <g transform="translate(10, 10) scale(0.8)">
                    <path d="M30 60 C 10 50, 0 30, 20 15 C 30 5, 40 5, 50 15 C 70 30, 60 50, 40 60" fill="none" stroke="url(#gold-grad)" strokeWidth="2.5" />
                    <path d="M35 15 Q 35 35 20 45" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5" opacity="0.8" />
                    <path d="M35 15 Q 35 35 50 45" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5" opacity="0.8" />
                    <circle cx="35" cy="15" r="3" fill="url(#gold-grad)" />
                </g>

                {/* Typography */}
                <text x="80" y="55" fontFamily="'Playfair Display', serif" fontSize="42" fontWeight="bold" letterSpacing="4" fill="currentColor">
                    BEAUTÉ
                </text>
            </svg>
        </div>
    );
};

export default Logo;
