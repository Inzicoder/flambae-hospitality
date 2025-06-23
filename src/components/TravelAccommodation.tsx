
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hotel, Plus, MapPin } from "lucide-react";

export const TravelAccommodation = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Hotel className="h-6 w-6 text-indigo-500" />
          <span>Accommodation & Travel</span>
        </CardTitle>
        <CardDescription>Manage guest accommodations and travel arrangements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">Hotel Bookings</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Recommend nearby hotels to guests</p>
              <p>• Track group booking discounts</p>
              <p>• Manage check-in dates</p>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">Transportation</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Shuttle schedules</p>
              <p>• Airport transfer arrangements</p>
              <p>• Parking information</p>
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <Button className="bg-indigo-500 hover:bg-indigo-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Hotel
          </Button>
          <Button variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            View Map
          </Button>
          <Button variant="outline">Send Travel Info</Button>
        </div>
      </CardContent>
    </Card>
  );
};
