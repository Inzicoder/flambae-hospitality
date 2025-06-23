
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Plus, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const EventSchedule = () => {
  const { toast } = useToast();
  const [events] = useState([
    {
      id: 1,
      name: "Haldi Ceremony",
      date: "2024-06-13",
      time: "10:00 AM",
      location: "Bride's Home",
      address: "123 Main St, City",
      dressCode: "Yellow Traditional",
      notes: "Morning ceremony with close family"
    },
    {
      id: 2,
      name: "Mehendi Ceremony",
      date: "2024-06-13",
      time: "4:00 PM",
      location: "Garden Venue",
      address: "456 Garden Rd, City",
      dressCode: "Green & Orange",
      notes: "Afternoon function with music and dance"
    },
    {
      id: 3,
      name: "Wedding Ceremony",
      date: "2024-06-15",
      time: "7:00 AM",
      location: "Temple Hall",
      address: "789 Temple St, City",
      dressCode: "Traditional Red & Gold",
      notes: "Main wedding ceremony"
    },
    {
      id: 4,
      name: "Reception",
      date: "2024-06-15",
      time: "7:00 PM",
      location: "Grand Ballroom",
      address: "101 Hotel Blvd, City",
      dressCode: "Formal Evening Wear",
      notes: "Dinner and celebration"
    }
  ]);

  const shareSchedule = () => {
    toast({
      title: "Schedule shared",
      description: "Event schedule has been shared with all guests.",
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-purple-500" />
          <span>Event Schedule</span>
        </CardTitle>
        <CardDescription>
          Plan your wedding timeline and events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 mb-6">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {event.time}
                    </span>
                  </div>
                </div>
                <Badge variant="outline">{event.dressCode}</Badge>
              </div>
              
              <div className="flex items-start space-x-2 mb-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">{event.location}</p>
                  <p className="text-gray-600">{event.address}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{event.notes}</p>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">
                  <MapPin className="h-3 w-3 mr-1" />
                  Directions
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <Button className="bg-purple-500 hover:bg-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
          <Button variant="outline" onClick={shareSchedule}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Schedule
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
