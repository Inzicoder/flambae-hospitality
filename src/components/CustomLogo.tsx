
import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

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
        {/* Logo Icon */}
        <div className={`${sizeClasses[size]} aspect-square bg-gradient-to-br from-rose-400 via-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative flex items-center justify-center">
            <Heart className={`${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-10 w-10'} text-white fill-white`} />
            <Sparkles className={`${size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-5 w-5'} text-white absolute -top-1 -right-1 animate-pulse`} />
          </div>
        </div>
        
        {/* Logo Text */}
        <div className="flex flex-col">
          <h1 className={`${textSizes[size]} font-serif font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight`}>
            Meliora Moments
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
