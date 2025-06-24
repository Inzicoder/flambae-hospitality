
import { Button } from "@/components/ui/button";
import { Heart, Bell, Sparkles, Menu } from "lucide-react";
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
}

export const DashboardHeader = ({ onLogout }: DashboardHeaderProps) => {
  const location = useLocation();
  
  // Determine if we're in event company mode based on current route content
  const isEventCompany = location.pathname === '/' && document.querySelector('[data-event-company]');
  
  const customerNavItems = [
    { path: '/', label: 'Dashboard', icon: Heart },
    { path: '/budget', label: 'Budget Manager' },
    { path: '/vendors', label: 'Vendor Management' },
    { path: '/todos', label: 'Task List' },
    { path: '/gallery', label: 'Photo Gallery' },
    { path: '/notes', label: 'Collaboration' },
    { path: '/payments', label: 'Payments' },
  ];

  const eventCompanyNavItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/rsvp', label: 'RSVP Tracker' },
    { path: '/schedule', label: 'Event Schedule' },
    { path: '/guests', label: 'Guest Manager' },
    { path: '/travel', label: 'Travel & Stay' },
  ];

  // Use customer nav by default, but could be enhanced to detect user type
  const navigationItems = customerNavItems;

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-rose-200/50 z-50 romantic-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex justify-center">
                <img 
                  src="/lovable-uploads/df5b7422-1f97-4754-b2f4-5822f3b683c0.png" 
                  alt="Meliora Moments Logo" 
                  className="h-12 w-auto drop-shadow-lg"
                />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-light">Your Wedding OS</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50 text-slate-700 rounded-2xl transition-all duration-300 hidden md:flex backdrop-blur-sm"
            >
              <Bell className="h-4 w-4 mr-2 text-rose-500" />
              Notifications
            </Button>

            {/* Navigation Menu */}
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
                {navigationItems.map((item) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};
