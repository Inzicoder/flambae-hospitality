
import { RSVPTracker } from "@/components/RSVPTracker";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, HelpCircle } from "lucide-react";

interface EventCompanyDashboardProps {
  weddingData: any;
}

export const EventCompanyDashboard = ({ weddingData }: EventCompanyDashboardProps) => {
  const handleProfile = () => {
    console.log("Profile clicked");
    // Add profile functionality here
  };

  const handleHelpSupport = () => {
    console.log("Help & Support clicked");
    // Add help & support functionality here
  };

  return (
    <div className="space-y-8">
      {/* Header with simplified navigation */}
      <div className="flex items-center justify-between py-6">
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-gradient mb-4">Welcome {weddingData.coupleNames}</h1>
          <p className="text-xl text-gray-600">Event Company Dashboard</p>
          <p className="text-lg text-gray-500">Managing your special day - {weddingData.weddingDate}</p>
        </div>
        
        {/* Profile and Help & Support buttons */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={handleProfile}
            className="flex items-center space-x-2 border-slate-300 hover:bg-slate-50"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleHelpSupport}
            className="flex items-center space-x-2 border-slate-300 hover:bg-slate-50"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Help & Support</span>
          </Button>
          
          <Avatar className="h-10 w-10 border-2 border-rose-200">
            <AvatarFallback className="bg-gradient-to-br from-rose-100 to-pink-100 text-rose-700 text-sm font-medium">
              {weddingData.coupleNames.split(' ')[0]?.[0]}{weddingData.coupleNames.split(' ')[2]?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* RSVP Management - Full functionality */}
      <RSVPTracker guestStats={weddingData.guestStats} />
    </div>
  );
};
