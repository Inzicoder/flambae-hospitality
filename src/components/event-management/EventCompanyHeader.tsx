
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, HelpCircle } from "lucide-react";
import { ProfileDialog } from "./ProfileDialog";
import { AIChatbot } from "./AIChatbot";

interface EventCompanyHeaderProps {
  weddingData: any;
  companyData?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    description: string;
    logo?: string;
  };
}

export const EventCompanyHeader = ({ 
  weddingData, 
  companyData = {
    name: "Elegant Events Co.",
    email: "contact@elegantevents.com",
    phone: "+1 (555) 123-4567",
    address: "123 Wedding Avenue, Event City, EC 12345",
    description: "Premier wedding and event planning company specializing in luxury celebrations."
  }
}: EventCompanyHeaderProps) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [currentCompanyData, setCurrentCompanyData] = useState(companyData);

  const handleProfile = () => {
    console.log("Profile clicked");
    setShowProfile(true);
  };

  const handleHelpSupport = () => {
    console.log("Help & Support clicked");
    setShowChatbot(true);
  };

  const handleSaveProfile = (data: any) => {
    setCurrentCompanyData(data);
    console.log("Profile updated:", data);
  };

  return (
    <>
      <div className="flex items-center justify-between py-6">
        <div className="text-center flex-1">
          {/* Company Logo and Name Section */}
          <div className="flex items-center justify-center mb-4 space-x-4">
            {currentCompanyData.logo && (
              <img 
                src={currentCompanyData.logo} 
                alt={`${currentCompanyData.name} Logo`}
                className="h-16 w-16 object-contain"
              />
            )}
            <h1 className="text-4xl font-bold text-gradient">{currentCompanyData.name}</h1>
          </div>
          <p className="text-lg text-gray-500">Managing {weddingData.coupleNames} - {weddingData.weddingDate}</p>
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
              {currentCompanyData.name.split(' ')[0]?.[0]}{currentCompanyData.name.split(' ')[1]?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <ProfileDialog
        open={showProfile}
        onOpenChange={setShowProfile}
        companyData={currentCompanyData}
        onSave={handleSaveProfile}
      />

      <AIChatbot
        open={showChatbot}
        onOpenChange={setShowChatbot}
      />
    </>
  );
};
