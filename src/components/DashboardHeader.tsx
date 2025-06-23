
import { Button } from "@/components/ui/button";
import { Heart, Bell, Sparkles, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  onLogout: () => void;
}

const navigationItems = [
  { path: '/', label: 'Dashboard', icon: Heart },
  { path: '/rsvp', label: 'RSVP Tracker' },
  { path: '/budget', label: 'Budget Manager' },
  { path: '/vendors', label: 'Vendor Management' },
  { path: '/todos', label: 'Task List' },
  { path: '/schedule', label: 'Event Schedule' },
  { path: '/guests', label: 'Guest Manager' },
  { path: '/gallery', label: 'Photo Gallery' },
  { path: '/notes', label: 'Collaboration' },
  { path: '/travel', label: 'Travel & Stay' },
  { path: '/payments', label: 'Payments' },
];

export const DashboardHeader = ({ onLogout }: DashboardHeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-2 rounded-xl shadow-sm">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Wedding Planner</h1>
              <p className="text-sm text-slate-600">Your special day organized</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="border-slate-300 hover:border-teal-400 hover:bg-teal-50 transition-all duration-200 hidden md:flex"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>

            {/* Navigation Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-slate-300 hover:border-teal-400 hover:bg-teal-50 transition-all duration-200"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 shadow-lg">
                {navigationItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link 
                      to={item.path}
                      className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer"
                    >
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onLogout}
                  className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
