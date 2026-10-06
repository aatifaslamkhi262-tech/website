'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  // Dimensions map for clean responsiveness
  const heightMap = {
    sm: 'h-10 sm:h-12',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20',
  };

  return (
    <div className={`inline-flex items-center gap-2 relative ${className}`}>
      <img
        src="/logo.png"
        alt="PGS Game Shop Karachi"
        className={`${heightMap[size]} w-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-200`}
      />
    </div>
  );
};
