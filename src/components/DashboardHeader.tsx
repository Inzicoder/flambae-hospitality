
import { Button } from "@/components/ui/button";
import { Heart, Bell, Sparkles, Menu } from "lucide-react";
import { CustomLogo } from "./CustomLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";

interface DashboardHeaderProps {
  onLogout: () => void;
  userType?: 'guest' | 'eventCompany';
}

export const DashboardHeader = ({ onLogout, userType = 'guest' }: DashboardHeaderProps) => {
  const location = useLocation();
  
  const guestNavItems = [
    { path: '/', label: 'Dashboard', icon: Heart },
    { path: '/budget', label: 'Budget Manager' },
    { path: '/vendors', label: 'Vendor Management' },
    { path: '/todos', label: 'Task List' },
    { path: '/guests', label: 'Guest Manager' },
    { path: '/schedule', label: 'Event Schedule' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-rose-200/50 z-50 romantic-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <CustomLogo size="sm" showTagline={true} />
          </div>
          
          <div className="flex items-center space-x-3">

            {/* Navigation Menu - Only show for guest users */}
            {userType === 'guest' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50 text-slate-700 rounded-2xl transition-all duration-300 backdrop-blur-sm"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-xl border-2 border-rose-200 romantic-shadow rounded-2xl">
                  {guestNavItems.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link 
                        to={item.path}
                        className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-700 cursor-pointer rounded-xl transition-all duration-200"
                      >
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-rose-200/50" />
                  <DropdownMenuItem 
                    onClick={onLogout}
                    className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 cursor-pointer rounded-xl transition-all duration-200"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
