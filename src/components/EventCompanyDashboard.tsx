
import { EventManagementDashboard } from "./EventManagementDashboard";
import { EventCompanyHeader } from "./event-management/EventCompanyHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Calendar, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface EventCompanyDashboardProps {
  weddingData: any;
}

export const EventCompanyDashboard = ({ weddingData }: EventCompanyDashboardProps) => {
  return (
    <div className="space-y-8">
      <EventCompanyHeader weddingData={weddingData} />
      
      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">RSVP Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Manage guest responses and upload guest data files
            </CardDescription>
            <Link to="/rsvp">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Manage RSVPs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-lg">File Upload</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Upload Excel/CSV files for guest data import
            </CardDescription>
            <Link to="/rsvp">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Upload Files
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Event Planning</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Access comprehensive event management tools
            </CardDescription>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Plan Events
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Settings className="h-5 w-5 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Configure your event company preferences
            </CardDescription>
            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      <EventManagementDashboard />
    </div>
  );
};
