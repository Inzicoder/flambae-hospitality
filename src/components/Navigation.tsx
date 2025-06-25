
import { useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart } from "lucide-react";

interface NavigationProps {
  coupleNames: string;
  onLogout: () => void;
  userType: 'guest' | 'eventCompany';
}

export const Navigation = ({ coupleNames, onLogout, userType }: NavigationProps) => {
  // Don't render navigation for event company users
  if (userType === 'eventCompany') {
    return null;
  }

  return (
    <nav className="fixed top-16 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-rose-200/50 z-40 romantic-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="text-sm text-slate-600 font-light flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full">
              <Heart className="h-3 w-3 text-rose-500" />
            </div>
            <span>Guest Dashboard</span>
          </div>
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9 border-2 border-rose-200">
              <AvatarFallback className="bg-gradient-to-br from-rose-100 to-pink-100 text-rose-700 text-sm font-medium">
                {coupleNames.split(' ')[0]?.[0]}{coupleNames.split(' ')[2]?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-slate-700">{coupleNames}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
