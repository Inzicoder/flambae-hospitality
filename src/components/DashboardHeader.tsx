
import { Button } from "@/components/ui/button";
import { Heart, Bell } from "lucide-react";

interface DashboardHeaderProps {
  coupleNames: string;
  weddingDate: string;
  onLogout: () => void;
}

export const DashboardHeader = ({ coupleNames, weddingDate, onLogout }: DashboardHeaderProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {coupleNames}
              </h1>
              <p className="text-sm text-gray-600">{weddingDate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="border-gray-300"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
