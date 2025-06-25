
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileDialog } from './ProfileDialog';
import { FileUploadButton } from './FileUploadButton';
import { Building2, Calendar, Users, MapPin, Phone, Mail, HelpCircle, Settings, Upload, LogOut, Edit } from 'lucide-react';

interface EventCompanyHeaderProps {
  weddingData: any;
}

export const EventCompanyHeader = ({ weddingData }: EventCompanyHeaderProps) => {
  const [companyLogo, setCompanyLogo] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);

  const handleDataProcessed = (data: any) => {
    console.log('Processed data:', data);
    // Here you would typically update your state management system
    // or make API calls to save the data
  };

  const handleLogout = () => {
    // This would typically call a logout function from your auth system
    console.log('Logging out...');
    // For now, we'll just reload the page which should trigger the auth flow
    window.location.reload();
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt="Company Logo" 
                className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            )}
            <div>
              <CardTitle className="text-2xl text-slate-800 mb-1">Event Management Dashboard</CardTitle>
              <CardDescription className="text-slate-600">
                Managing: <span className="font-semibold text-blue-600">{weddingData.coupleNames}</span>
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <FileUploadButton onDataProcessed={handleDataProcessed} />
            
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </Button>
            
            <ProfileDialog onLogoUpdate={setCompanyLogo} />
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={toggleEditMode}
            >
              <Edit className="h-4 w-4" />
              {isEditMode ? 'View Mode' : 'Edit Mode'}
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isEditMode && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <Edit className="h-4 w-4 inline mr-1" />
              Edit mode is active. You can now modify dashboard components.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Wedding Date</p>
              <p className="font-semibold text-gray-800">{weddingData.weddingDate}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Guests</p>
              <p className="font-semibold text-gray-800">{weddingData.guestStats.totalInvited}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Venue Status</p>
              <Badge variant="default" className="bg-green-100 text-green-800">Confirmed</Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Settings className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Planning Status</p>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
