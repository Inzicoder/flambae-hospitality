
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Plus, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RSVPTrackerProps {
  guestStats: {
    totalInvited: number;
    confirmed: number;
    pending: number;
    declined: number;
  };
  eventCode?: string;
}

export const RSVPTracker = ({ guestStats, eventCode }: RSVPTrackerProps) => {
  const { toast } = useToast();

  const shareRSVPLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/rsvp/${eventCode || 'wedding123'}`);
    toast({
      title: "RSVP Link Copied!",
      description: "Share this link with your guests to collect RSVPs.",
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-rose-500" />
          <span>RSVP Tracker</span>
        </CardTitle>
        <CardDescription>
          Track your guest responses and meal preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{guestStats.confirmed}</p>
            <p className="text-sm text-green-700">Confirmed</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{guestStats.pending}</p>
            <p className="text-sm text-yellow-700">Pending</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{guestStats.declined}</p>
            <p className="text-sm text-red-700">Declined</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{guestStats.totalInvited}</p>
            <p className="text-sm text-blue-700">Total Invited</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Button onClick={shareRSVPLink} className="bg-rose-500 hover:bg-rose-600">
            <Share2 className="h-4 w-4 mr-2" />
            Share RSVP Link
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Upload Guest List
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Guest Manually
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export RSVP Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
