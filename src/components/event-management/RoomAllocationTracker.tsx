
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hotel, Gift, Calendar, Plus, CheckCircle2, XCircle } from 'lucide-react';

interface RoomAllocation {
  id: string;
  guestName: string;
  hotelName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  roomStatus: 'Available' | 'Occupied' | 'Checkout' | 'Maintenance';
  giftStatus: 'Delivered' | 'Pending' | 'Not Required';
  giftType: string;
  notes: string;
}

export const RoomAllocationTracker = () => {
  const [rooms, setRooms] = useState<RoomAllocation[]>([
    {
      id: '1',
      guestName: 'John Smith',
      hotelName: 'Grand Plaza Hotel',
      roomNumber: '501',
      checkInDate: '2024-06-15',
      checkOutDate: '2024-06-17',
      roomStatus: 'Occupied',
      giftStatus: 'Delivered',
      giftType: 'Welcome Hamper & Flowers',
      notes: 'VIP guest - extra amenities provided'
    },
    {
      id: '2',
      guestName: 'Sarah Johnson',
      hotelName: 'Ocean View Resort',
      roomNumber: '302',
      checkInDate: '2024-06-15',
      checkOutDate: '2024-06-17',
      roomStatus: 'Available',
      giftStatus: 'Pending',
      giftType: 'Standard Welcome Kit',
      notes: 'Early check-in requested'
    }
  ]);

  const [filterRoomStatus, setFilterRoomStatus] = useState('all');
  const [filterGiftStatus, setFilterGiftStatus] = useState('all');

  const filteredRooms = rooms.filter(room => {
    const matchesRoomStatus = filterRoomStatus === 'all' || room.roomStatus === filterRoomStatus;
    const matchesGiftStatus = filterGiftStatus === 'all' || room.giftStatus === filterGiftStatus;
    return matchesRoomStatus && matchesGiftStatus;
  });

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Occupied': return 'bg-blue-100 text-blue-800';
      case 'Checkout': return 'bg-gray-100 text-gray-800';
      case 'Maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGiftStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Not Required': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hotel className="h-5 w-5" />
          Room Allocation & Gifting Tracker
        </CardTitle>
        <CardDescription>
          Manage room assignments and track gift hamper deliveries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={filterRoomStatus} onValueChange={setFilterRoomStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by Room Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Room Status</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Occupied">Occupied</SelectItem>
              <SelectItem value="Checkout">Checkout</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterGiftStatus} onValueChange={setFilterGiftStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by Gift Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Gift Status</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Not Required">Not Required</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex-shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Allocate Room
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {rooms.filter(r => r.roomStatus === 'Occupied').length}
            </div>
            <div className="text-sm text-blue-800">Occupied Rooms</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {rooms.filter(r => r.roomStatus === 'Available').length}
            </div>
            <div className="text-sm text-green-800">Available Rooms</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {rooms.filter(r => r.giftStatus === 'Delivered').length}
            </div>
            <div className="text-sm text-purple-800">Gifts Delivered</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {rooms.filter(r => r.giftStatus === 'Pending').length}
            </div>
            <div className="text-sm text-yellow-800">Gifts Pending</div>
          </div>
        </div>

        {/* Room Allocation Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest & Room</TableHead>
                <TableHead>Hotel</TableHead>
                <TableHead>Stay Period</TableHead>
                <TableHead>Room Status</TableHead>
                <TableHead>Gift Details</TableHead>
                <TableHead>Gift Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{room.guestName}</div>
                      <div className="text-sm text-gray-500">Room {room.roomNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{room.hotelName}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div className="text-sm">
                        <div>{new Date(room.checkInDate).toLocaleDateString()}</div>
                        <div className="text-gray-500">to {new Date(room.checkOutDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoomStatusColor(room.roomStatus)}>
                      {room.roomStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Gift className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{room.giftType}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getGiftStatusColor(room.giftStatus)}>
                        {room.giftStatus}
                      </Badge>
                      {room.giftStatus === 'Delivered' && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                      {room.giftStatus === 'Pending' && (
                        <XCircle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                      {room.giftStatus === 'Pending' && (
                        <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                          Mark Delivered
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Hotel Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Hotel Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Grand Plaza Hotel</span>
                  <span className="font-medium">1/2 rooms</span>
                </div>
                <div className="flex justify-between">
                  <span>Ocean View Resort</span>
                  <span className="font-medium">1/2 rooms</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Gift Delivery Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Delivered</span>
                  <span className="font-medium text-green-600">1</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Delivery</span>
                  <span className="font-medium text-yellow-600">1</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
