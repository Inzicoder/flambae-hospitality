
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddGuestDialog } from './AddGuestDialog';
import { Search, Filter, Edit, Phone, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Guest {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  arrivalDateTime: string;
  departureDateTime: string;
  attendanceStatus: 'Confirmed' | 'Declined' | 'Pending';
  travelRequirement: 'Yes' | 'No';
  isVIP: boolean;
}

export const GuestManagementSystem = () => {
  const { toast } = useToast();
  const [guests, setGuests] = useState<Guest[]>([
    {
      id: '1',
      fullName: 'John Smith',
      phoneNumber: '+1234567890',
      email: 'john.smith@email.com',
      arrivalDateTime: '2024-06-15T14:30',
      departureDateTime: '2024-06-17T10:00',
      attendanceStatus: 'Confirmed',
      travelRequirement: 'Yes',
      isVIP: true
    },
    {
      id: '2',
      fullName: 'Sarah Johnson',
      phoneNumber: '+1234567891',
      email: 'sarah.johnson@email.com',
      arrivalDateTime: '2024-06-15T16:00',
      departureDateTime: '2024-06-17T12:00',
      attendanceStatus: 'Pending',
      travelRequirement: 'No',
      isVIP: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTravel, setFilterTravel] = useState('all');

  // Handle phone call functionality
  const handlePhoneCall = (phoneNumber: string, guestName: string) => {
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhoneNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Check if it's a valid phone number with exactly 10 digits
    if (!cleanPhoneNumber || cleanPhoneNumber.length !== 10 || !/^\d{10}$/.test(cleanPhoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Phone number must have exactly 10 digits.",
        variant: "destructive"
      });
      return;
    }

    // Create tel: link for phone calls
    const phoneLink = `tel:${cleanPhoneNumber}`;
    
    // Show confirmation dialog
    const confirmed = window.confirm(`Call ${guestName} at ${phoneNumber}?`);
    
    if (confirmed) {
      // Open phone dialer
      window.open(phoneLink, '_self');
      
      toast({
        title: "Calling Guest",
        description: `Initiating call to ${guestName}`,
      });
    }
  };

  const handleAddGuest = (newGuest: Guest) => {
    setGuests([...guests, newGuest]);
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.phoneNumber.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || guest.attendanceStatus === filterStatus;
    const matchesTravel = filterTravel === 'all' || guest.travelRequirement === filterTravel;
    
    return matchesSearch && matchesStatus && matchesTravel;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Declined': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Guest Management System
        </CardTitle>
        <CardDescription>
          Maintain detailed guest profiles and track attendance status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search guests by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Declined">Declined</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterTravel} onValueChange={setFilterTravel}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by Travel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Travel</SelectItem>
              <SelectItem value="Yes">Travel Required</SelectItem>
              <SelectItem value="No">No Travel</SelectItem>
            </SelectContent>
          </Select>
          <AddGuestDialog onAddGuest={handleAddGuest} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{guests.length}</div>
            <div className="text-sm text-blue-800">Total Guests</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {guests.filter(g => g.attendanceStatus === 'Confirmed').length}
            </div>
            <div className="text-sm text-green-800">Confirmed</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {guests.filter(g => g.attendanceStatus === 'Pending').length}
            </div>
            <div className="text-sm text-yellow-800">Pending</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {guests.filter(g => g.travelRequirement === 'Yes').length}
            </div>
            <div className="text-sm text-purple-800">Travel Required</div>
          </div>
        </div>

        {/* Guest Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest Details</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Travel</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium">{guest.fullName}</div>
                        {guest.isVIP && (
                          <Badge variant="secondary" className="mt-1">VIP</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {guest.phoneNumber}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {guest.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {guest.arrivalDateTime ? new Date(guest.arrivalDateTime).toLocaleDateString() : 'N/A'}
                      <br />
                      {guest.arrivalDateTime ? new Date(guest.arrivalDateTime).toLocaleTimeString() : ''}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {guest.departureDateTime ? new Date(guest.departureDateTime).toLocaleDateString() : 'N/A'}
                      <br />
                      {guest.departureDateTime ? new Date(guest.departureDateTime).toLocaleTimeString() : ''}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(guest.attendanceStatus)}>
                      {guest.attendanceStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={guest.travelRequirement === 'Yes' ? 'default' : 'secondary'}>
                      {guest.travelRequirement}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePhoneCall(guest.phoneNumber, guest.fullName)}
                        className="flex items-center gap-1"
                      >
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
