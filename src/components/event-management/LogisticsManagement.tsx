
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScheduleTransportDialog } from './ScheduleTransportDialog';
import { Truck, Clock, MapPin, Calendar } from 'lucide-react';

interface LogisticsEntry {
  id: string;
  guestName: string;
  pickupType: 'Airport Pickup' | 'Airport Drop' | 'Hotel Transfer';
  scheduledTime: string;
  location: string;
  assignedDriver: string;
  vehicle: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'VIP' | 'Regular';
  notes: string;
}

export const LogisticsManagement = () => {
  const [logistics, setLogistics] = useState<LogisticsEntry[]>([
    {
      id: '1',
      guestName: 'John Smith',
      pickupType: 'Airport Pickup',
      scheduledTime: '2024-06-15T14:00',
      location: 'Terminal 1 - Gate 3',
      assignedDriver: 'Mike Johnson',
      vehicle: 'Mercedes S-Class (ABC-123)',
      status: 'Scheduled',
      priority: 'VIP',
      notes: 'Flight delayed by 30 minutes'
    },
    {
      id: '2',
      guestName: 'Sarah Johnson',
      pickupType: 'Airport Drop',
      scheduledTime: '2024-06-17T10:00',
      location: 'Hotel Grand Plaza',
      assignedDriver: 'Tom Wilson',
      vehicle: 'BMW 7 Series (XYZ-789)',
      status: 'In Progress',
      priority: 'Regular',
      notes: 'Early departure requested'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const handleScheduleTransport = (newTransport: LogisticsEntry) => {
    setLogistics([...logistics, newTransport]);
  };

  const filteredLogistics = logistics.filter(entry => {
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || entry.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'VIP' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Logistics Management
        </CardTitle>
        <CardDescription>
          Plan and track guest transportation and logistics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="Regular">Regular</SelectItem>
            </SelectContent>
          </Select>
          <ScheduleTransportDialog onScheduleTransport={handleScheduleTransport} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {logistics.filter(l => l.status === 'Scheduled').length}
            </div>
            <div className="text-sm text-blue-800">Scheduled</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {logistics.filter(l => l.status === 'In Progress').length}
            </div>
            <div className="text-sm text-yellow-800">In Progress</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {logistics.filter(l => l.status === 'Completed').length}
            </div>
            <div className="text-sm text-green-800">Completed</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {logistics.filter(l => l.priority === 'VIP').length}
            </div>
            <div className="text-sm text-purple-800">VIP Priority</div>
          </div>
        </div>

        {/* Logistics Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest & Service</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Driver & Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogistics.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{entry.guestName}</div>
                      <div className="text-sm text-gray-500">{entry.pickupType}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div className="text-sm">
                        {new Date(entry.scheduledTime).toLocaleDateString()}
                        <br />
                        <span className="font-medium">
                          {new Date(entry.scheduledTime).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{entry.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{entry.assignedDriver || 'Not assigned'}</div>
                      <div className="text-gray-500">{entry.vehicle || 'No vehicle assigned'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(entry.status)}>
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(entry.priority)}>
                      {entry.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Notes Section */}
        <div className="mt-6">
          <h3 className="font-medium mb-2">Recent Updates</h3>
          <div className="space-y-2">
            {logistics.filter(l => l.notes).map(entry => (
              <div key={entry.id} className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">{entry.guestName}</span>
                </div>
                <p className="text-sm text-yellow-700">{entry.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
