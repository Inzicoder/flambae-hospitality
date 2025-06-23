
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Search, Download, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const GuestManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [guests] = useState([
    { id: 1, name: "John Smith", email: "john@example.com", phone: "+1234567890", family: "Smith Family", rsvp: "confirmed", events: ["Haldi", "Mehendi", "Wedding"] },
    { id: 2, name: "Emily Johnson", email: "emily@example.com", phone: "+1234567891", family: "Johnson Family", rsvp: "pending", events: ["Wedding", "Reception"] },
    { id: 3, name: "Michael Brown", email: "michael@example.com", phone: "+1234567892", family: "Brown Family", rsvp: "declined", events: [] },
    { id: 4, name: "Sarah Davis", email: "sarah@example.com", phone: "+1234567893", family: "Davis Family", rsvp: "confirmed", events: ["Mehendi", "Wedding", "Reception"] },
  ]);

  const filteredGuests = guests.filter(guest => 
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.family.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendBulkMessage = () => {
    toast({
      title: "Bulk message sent",
      description: "WhatsApp invitations sent to all confirmed guests.",
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-blue-500" />
          <span>Guest Manager</span>
        </CardTitle>
        <CardDescription>
          Manage your guest list and contact information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search guests or families..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Guest
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-lg font-bold text-blue-600">{guests.length}</p>
            <p className="text-sm text-blue-700">Total Guests</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-lg font-bold text-green-600">{guests.filter(g => g.rsvp === 'confirmed').length}</p>
            <p className="text-sm text-green-700">Confirmed</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-lg font-bold text-yellow-600">{guests.filter(g => g.rsvp === 'pending').length}</p>
            <p className="text-sm text-yellow-700">Pending</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-lg font-bold text-red-600">{guests.filter(g => g.rsvp === 'declined').length}</p>
            <p className="text-sm text-red-700">Declined</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {filteredGuests.map((guest) => (
            <div key={guest.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold">{guest.name}</h3>
                  <Badge 
                    variant={guest.rsvp === 'confirmed' ? 'default' : guest.rsvp === 'pending' ? 'secondary' : 'destructive'}
                  >
                    {guest.rsvp}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {guest.email}
                  </span>
                  <span className="flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {guest.phone}
                  </span>
                  <span>{guest.family}</span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  {guest.events.map((event) => (
                    <Badge key={event} variant="outline" className="text-xs">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <Button onClick={sendBulkMessage} className="bg-green-500 hover:bg-green-600">
            <Mail className="h-4 w-4 mr-2" />
            Send Bulk WhatsApp
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Guest List
          </Button>
          <Button variant="outline">Import CSV</Button>
        </div>
      </CardContent>
    </Card>
  );
};
