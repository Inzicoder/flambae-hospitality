
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, Edit, Mail, Phone, Calendar, Hotel, Clock, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  rsvpStatus: 'confirmed' | 'pending' | 'declined';
  arrivalDate: string;
  arrivalTime: string;
  departureDate: string;
  departureTime: string;
  roomNumber: string;
  roomType: string;
  dietaryRestrictions: string;
  plusOne: string;
  transportNeeded: boolean;
  specialRequests: string;
  events: string[];
}

export const GuestList = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const [guests, setGuests] = useState<Guest[]>([
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "+1234567890",
      rsvpStatus: "confirmed",
      arrivalDate: "2024-06-14",
      arrivalTime: "15:30",
      departureDate: "2024-06-16",
      departureTime: "11:00",
      roomNumber: "A-101",
      roomType: "Deluxe Double",
      dietaryRestrictions: "Vegetarian",
      plusOne: "Jane Smith",
      transportNeeded: true,
      specialRequests: "Ground floor room",
      events: ["Haldi", "Mehendi", "Wedding"]
    },
    {
      id: 2,
      name: "Emily Johnson",
      email: "emily@example.com",
      phone: "+1234567891",
      rsvpStatus: "pending",
      arrivalDate: "2024-06-14",
      arrivalTime: "18:00",
      departureDate: "2024-06-15",
      departureTime: "14:00",
      roomNumber: "",
      roomType: "",
      dietaryRestrictions: "No restrictions",
      plusOne: "",
      transportNeeded: false,
      specialRequests: "",
      events: ["Wedding", "Reception"]
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+1234567892",
      rsvpStatus: "confirmed",
      arrivalDate: "2024-06-13",
      arrivalTime: "20:00",
      departureDate: "2024-06-16",
      departureTime: "12:00",
      roomNumber: "B-205",
      roomType: "Suite",
      dietaryRestrictions: "Gluten-free",
      plusOne: "",
      transportNeeded: true,
      specialRequests: "Late check-in",
      events: ["Haldi", "Mehendi", "Wedding", "Reception"]
    }
  ]);

  const form = useForm<Guest>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      rsvpStatus: 'pending',
      arrivalDate: '',
      arrivalTime: '',
      departureDate: '',
      departureTime: '',
      roomNumber: '',
      roomType: '',
      dietaryRestrictions: '',
      plusOne: '',
      transportNeeded: false,
      specialRequests: '',
      events: []
    }
  });

  const filteredGuests = guests.filter(guest => 
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: Guest) => {
    if (editingGuest) {
      setGuests(prev => prev.map(guest => 
        guest.id === editingGuest.id ? { ...data, id: editingGuest.id } : guest
      ));
      toast({
        title: "Guest Updated",
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      const newGuest = { ...data, id: Date.now() };
      setGuests(prev => [...prev, newGuest]);
      toast({
        title: "Guest Added",
        description: `${data.name} has been added to the guest list.`,
      });
    }
    setIsAddGuestOpen(false);
    setEditingGuest(null);
    form.reset();
  };

  const openEditDialog = (guest: Guest) => {
    setEditingGuest(guest);
    form.reset(guest);
    setIsAddGuestOpen(true);
  };

  const getRsvpStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-slate-800">Guest Management</CardTitle>
              <p className="text-slate-600 text-sm">Manage individual guest details and accommodations</p>
            </div>
          </div>
          
          <Dialog open={isAddGuestOpen} onOpenChange={setIsAddGuestOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Guest
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingGuest ? 'Edit Guest' : 'Add New Guest'}</DialogTitle>
                <DialogDescription>
                  Fill in the guest details including accommodation and travel information
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rsvpStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RSVP Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border shadow-lg z-50">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="declined">Declined</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="arrivalDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Arrival Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="arrivalTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Arrival Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="departureDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departure Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="departureTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departure Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="roomNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., A-101" className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="roomType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border shadow-lg z-50">
                              <SelectItem value="Standard Single">Standard Single</SelectItem>
                              <SelectItem value="Standard Double">Standard Double</SelectItem>
                              <SelectItem value="Deluxe Double">Deluxe Double</SelectItem>
                              <SelectItem value="Suite">Suite</SelectItem>
                              <SelectItem value="Family Room">Family Room</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dietaryRestrictions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dietary Restrictions</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Vegetarian, Gluten-free" className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="plusOne"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plus One</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Name if bringing +1" className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Any special accommodation needs" className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      {editingGuest ? 'Update Guest' : 'Add Guest'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsAddGuestOpen(false);
                        setEditingGuest(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, email, or room number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        <div className="rounded-lg border bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Guest Details</TableHead>
                <TableHead className="font-semibold">Arrival/Departure</TableHead>
                <TableHead className="font-semibold">Accommodation</TableHead>
                <TableHead className="font-semibold">Preferences</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-slate-900">{guest.name}</h3>
                        <Badge className={`text-xs ${getRsvpStatusColor(guest.rsvpStatus)}`}>
                          {guest.rsvpStatus}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-2" />
                          {guest.email}
                        </div>
                        {guest.phone && (
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-2" />
                            {guest.phone}
                          </div>
                        )}
                        {guest.plusOne && (
                          <div className="text-xs text-blue-600">
                            +1: {guest.plusOne}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-2 text-sm">
                      {guest.arrivalDate && (
                        <div className="flex items-center text-green-700">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span className="font-medium">Arr:</span>
                          <span className="ml-1">{guest.arrivalDate}</span>
                          {guest.arrivalTime && (
                            <span className="ml-1 text-xs">at {guest.arrivalTime}</span>
                          )}
                        </div>
                      )}
                      {guest.departureDate && (
                        <div className="flex items-center text-red-700">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span className="font-medium">Dep:</span>
                          <span className="ml-1">{guest.departureDate}</span>
                          {guest.departureTime && (
                            <span className="ml-1 text-xs">at {guest.departureTime}</span>
                          )}
                        </div>
                      )}
                      {guest.transportNeeded && (
                        <Badge variant="outline" className="text-xs">
                          Transport needed
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-2 text-sm">
                      {guest.roomNumber && (
                        <div className="flex items-center">
                          <Hotel className="h-3 w-3 mr-2 text-blue-600" />
                          <span className="font-medium">{guest.roomNumber}</span>
                        </div>
                      )}
                      {guest.roomType && (
                        <div className="text-xs text-slate-600">{guest.roomType}</div>
                      )}
                      {guest.specialRequests && (
                        <div className="text-xs text-amber-600">
                          Special: {guest.specialRequests}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-2 text-sm">
                      {guest.dietaryRestrictions && guest.dietaryRestrictions !== 'No restrictions' && (
                        <div className="flex items-center">
                          <Utensils className="h-3 w-3 mr-2 text-orange-600" />
                          <span className="text-xs">{guest.dietaryRestrictions}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {guest.events.map((event) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(guest)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredGuests.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No guests found matching your search.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
