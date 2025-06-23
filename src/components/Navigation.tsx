
import { useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavigationProps {
  coupleNames: string;
  onLogout: () => void;
}

export const Navigation = ({ coupleNames, onLogout }: NavigationProps) => {
  return (
    <nav className="fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-12">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-teal-100 text-teal-700 text-sm font-medium">
                {coupleNames.split(' ')[0]?.[0]}{coupleNames.split(' ')[2]?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
};
