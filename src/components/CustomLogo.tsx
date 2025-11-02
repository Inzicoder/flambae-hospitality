
import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import logoImage from '@/assets/logo.jpeg';

interface CustomLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const CustomLogo = ({ size = 'md', showTagline = true, className = '' }: CustomLogoProps) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-20'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const taglineSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <div className="flex items-center space-x-3">
        {/* Logo Image */}
        <div className={`${sizeClasses[size]} aspect-square rounded-2xl flex items-center justify-center shadow-xl overflow-hidden`}>
          <img 
            src={logoImage} 
            alt="Flambae Hospitality Logo" 
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        
        {/* Logo Text */}
        <div className="flex flex-col">
          <h1 className={`${textSizes[size]} font-serif font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent leading-tight`}>
            Flambae Hospitality
          </h1>
          {showTagline && (
            <p className={`${taglineSizes[size]} text-slate-600 font-light tracking-wide`}>
              Your Wedding OS
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
