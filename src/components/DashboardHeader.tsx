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
    <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/placeholder.svg" 
              alt="Meliora Moments Logo" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-800">Meliora Moments</h1>
              <p className="text-sm text-slate-600">Your Wedding OS</p>
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
