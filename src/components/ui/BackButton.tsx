import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  className = "",
  variant = "outline",
  size = "sm"
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      // Get the current location
      const currentPath = window.location.pathname;
      
      // If we're on the event management dashboard (specific event), go back to events listing
      if (currentPath.startsWith('/event-management/') && currentPath !== '/event-management') {
        navigate('/event-management');
      } 
      // If we're on the events listing page, don't allow navigation
      // This prevents browser back from taking user to auth screen
      else if (currentPath === '/event-management') {
        // Do nothing - stay on events listing page
        // Don't navigate to auth screen
        return;
      }
      else {
        // For other pages, use normal back navigation
        navigate(-1);
      }
    }
  };
  
  // Get the current location to conditionally hide the button
  const currentPath = window.location.pathname;
  const shouldShow = currentPath !== '/event-management';

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleBack}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
};

