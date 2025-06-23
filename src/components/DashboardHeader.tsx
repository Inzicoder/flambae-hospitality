
import { Button } from "@/components/ui/button";
import { Heart, Bell, Sparkles } from "lucide-react";

interface DashboardHeaderProps {
  coupleNames: string;
  weddingDate: string;
  onLogout: () => void;
}

export const DashboardHeader = ({ coupleNames, weddingDate, onLogout }: DashboardHeaderProps) => {
  return (
    <div className="glass-effect border-b border-white/20 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 p-3 rounded-2xl shadow-lg">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-yellow-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                {coupleNames}
              </h1>
              <p className="text-gray-600 font-medium">{weddingDate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              className="border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 rounded-xl"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="border-2 border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all duration-300 rounded-xl"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
