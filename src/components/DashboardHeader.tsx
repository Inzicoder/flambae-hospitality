
import { Button } from "@/components/ui/button";
import { Heart, Bell, Sparkles } from "lucide-react";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export const DashboardHeader = ({ onLogout }: DashboardHeaderProps) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
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
              className="border-slate-300 hover:border-teal-400 hover:bg-teal-50 transition-all duration-200"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="border-slate-300 hover:border-red-400 hover:bg-red-50 transition-all duration-200"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
