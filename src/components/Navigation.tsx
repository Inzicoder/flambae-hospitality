
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Heart, 
  Users, 
  DollarSign, 
  CheckSquare, 
  Calendar, 
  UserCheck, 
  Camera, 
  MessageSquare, 
  Hotel, 
  CreditCard,
  Building2,
  Menu,
  X,
  LogOut
} from "lucide-react";

interface NavigationProps {
  coupleNames: string;
  onLogout: () => void;
}

const navigationItems = [
  { path: '/', label: 'Dashboard', icon: Heart },
  { path: '/rsvp', label: 'RSVP Tracker', icon: UserCheck },
  { path: '/budget', label: 'Budget Manager', icon: DollarSign },
  { path: '/vendors', label: 'Vendor Management', icon: Building2 },
  { path: '/todos', label: 'Task List', icon: CheckSquare },
  { path: '/schedule', label: 'Event Schedule', icon: Calendar },
  { path: '/guests', label: 'Guest Manager', icon: Users },
  { path: '/gallery', label: 'Photo Gallery', icon: Camera },
  { path: '/notes', label: 'Collaboration', icon: MessageSquare },
  { path: '/travel', label: 'Travel & Stay', icon: Hotel },
  { path: '/payments', label: 'Payments', icon: CreditCard },
];

export const Navigation = ({ coupleNames, onLogout }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive 
                      ? 'bg-teal-100 text-teal-700 shadow-sm' 
                      : 'text-slate-600 hover:text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-teal-100 text-teal-700 text-sm font-medium">
                {coupleNames.split(' ')[0]?.[0]}{coupleNames.split(' ')[2]?.[0]}
              </AvatarFallback>
            </Avatar>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4">
            <div className="grid grid-cols-2 gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-teal-100 text-teal-700' 
                        : 'text-slate-600 hover:text-teal-600 hover:bg-teal-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="w-full justify-start text-slate-600 hover:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
