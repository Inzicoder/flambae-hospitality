import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Users, 
  Search, 
  Phone, 
  MapPin, 
  Calendar, 
  Car, 
  Hotel, 
  Plane, 
  Train, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '@/lib/config';

// Participant interface based on API response
interface Participant {
  id: string;
  eventId: string;
  name: string;
  category: string;
  phoneNumber: string;
  city: string;
  dateOfArrival: string;
  modeOfArrival: string;
  trainFlightNumber: string;
  time: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string | null;
  departureDetails: string;
  departureTime: string;
  attending: string;
  remarks: string | null;
  remarksRound2: string | null;
}

export const EventParticipantsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAttending, setFilterAttending] = useState<string>('all');

  // Fetch participants from API
  const fetchParticipants = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.PARTICIPANTS.LIST(eventId)), {
        headers: getAuthHeaders()
      });

      if (response.data && response.data.status === 'success') {
        setParticipants(response.data.data);
        setFilteredParticipants(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch participants');
      }
    } catch (error: any) {
      console.error('Error fetching participants:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch participants');
      toast({
        title: "Error",
        description: "Failed to load participants. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch participants on component mount
  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

  // Handle phone call functionality
  const handlePhoneCall = (phoneNumber: string, participantName: string) => {
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
    const confirmed = window.confirm(`Call ${participantName} at ${phoneNumber}?`);
    
    if (confirmed) {
      // Open phone dialer
      window.open(phoneLink, '_self');
      
      toast({
        title: "Calling Guest",
        description: `Initiating call to ${participantName}`,
      });
    }
  };

  // Filter participants based on search term and attending status
  useEffect(() => {
    let filtered = participants;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(participant =>
        participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.phoneNumber.includes(searchTerm) ||
        participant.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.hotelName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by attending status
    if (filterAttending !== 'all') {
      filtered = filtered.filter(participant => participant.attending === filterAttending);
    }

    setFilteredParticipants(filtered);
  }, [participants, searchTerm, filterAttending]);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Get arrival mode icon
  const getArrivalIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'car':
        return <Car className="h-4 w-4" />;
      case 'flight':
      case 'plane':
        return <Plane className="h-4 w-4" />;
      case 'train':
        return <Train className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  // Get attending status badge
  const getAttendingBadge = (attending: string) => {
    if (attending === 'Yes') {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Attending</Badge>;
    } else {
      return <Badge variant="destructive" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Not Attending</Badge>;
    }
  };

  // Export participants data
  const exportToCSV = () => {
    if (filteredParticipants.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no participants to export",
        variant: "destructive"
      });
      return;
    }

    const csvHeaders = [
      'Name', 'Category', 'Phone Number', 'City', 'Date of Arrival', 
      'Mode of Arrival', 'Train/Flight Number', 'Time', 'Hotel Name', 
      'Room Type', 'Check In', 'Check Out', 'Departure Details', 
      'Departure Time', 'Attending', 'Remarks'
    ];

    const csvData = filteredParticipants.map(participant => [
      participant.name,
      participant.category,
      participant.phoneNumber,
      participant.city,
      formatDate(participant.dateOfArrival),
      participant.modeOfArrival,
      participant.trainFlightNumber,
      participant.time,
      participant.hotelName,
      participant.roomType,
      formatDate(participant.checkIn),
      participant.checkOut ? formatDate(participant.checkOut) : '',
      participant.departureDetails,
      participant.departureTime,
      participant.attending,
      participant.remarks || ''
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `event-participants-${eventId || 'export'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Exported ${filteredParticipants.length} participants to CSV`,
    });
  };

  const exportToExcel = () => {
    if (filteredParticipants.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no participants to export",
        variant: "destructive"
      });
      return;
    }

    const excelData = filteredParticipants.map(participant => ({
      'Name': participant.name,
      'Category': participant.category,
      'Phone Number': participant.phoneNumber,
      'City': participant.city,
      'Date of Arrival': formatDate(participant.dateOfArrival),
      'Mode of Arrival': participant.modeOfArrival,
      'Train/Flight Number': participant.trainFlightNumber,
      'Time': participant.time,
      'Hotel Name': participant.hotelName,
      'Room Type': participant.roomType,
      'Check In': formatDate(participant.checkIn),
      'Check Out': participant.checkOut ? formatDate(participant.checkOut) : '',
      'Departure Details': participant.departureDetails,
      'Departure Time': participant.departureTime,
      'Attending': participant.attending,
      'Remarks': participant.remarks || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');
    
    XLSX.writeFile(workbook, `event-participants-${eventId || 'export'}.xlsx`);

    toast({
      title: "Export Successful",
      description: `Exported ${filteredParticipants.length} participants to Excel`,
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="text-center py-12">
          <CardContent>
            <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading Participants...</h3>
            <p className="text-gray-500">Please wait while we fetch the participant information</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Failed to Load Participants</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchParticipants} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Event Participants</h1>
            <p className="text-blue-100">Manage and view all event participants</p>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel}>
                  <Download className="h-4 w-4 mr-2" />
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{participants.length}</div>
              <div className="text-blue-100 text-sm">Total Participants</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {participants.filter(p => p.attending === 'Yes').length}
              </div>
              <div className="text-blue-100 text-sm">Attending</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <XCircle className="h-8 w-8 text-red-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {participants.filter(p => p.attending === 'No').length}
              </div>
              <div className="text-blue-100 text-sm">Not Attending</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Hotel className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {participants.filter(p => p.hotelName && p.hotelName !== '').length}
              </div>
              <div className="text-blue-100 text-sm">With Hotel</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Participants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, phone, city, or hotel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterAttending === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterAttending('all')}
                size="sm"
              >
                All ({participants.length})
              </Button>
              <Button
                variant={filterAttending === 'Yes' ? 'default' : 'outline'}
                onClick={() => setFilterAttending('Yes')}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Attending ({participants.filter(p => p.attending === 'Yes').length})
              </Button>
              <Button
                variant={filterAttending === 'No' ? 'default' : 'outline'}
                onClick={() => setFilterAttending('No')}
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Not Attending ({participants.filter(p => p.attending === 'No').length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participants List */}
      <div className="space-y-4">
        {filteredParticipants.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Participants Found</h3>
              <p className="text-gray-500">
                {searchTerm || filterAttending !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No participants have been added to this event yet'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredParticipants.map((participant) => (
            <Card key={participant.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Participant Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold">{participant.name}</h3>
                      {getAttendingBadge(participant.attending)}
                      <Badge variant="outline">{participant.category}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{participant.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{participant.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Arrives: {formatDate(participant.dateOfArrival)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getArrivalIcon(participant.modeOfArrival)}
                        <span>{participant.modeOfArrival} - {participant.trainFlightNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{participant.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hotel className="h-4 w-4 text-gray-500" />
                        <span>{participant.hotelName} - {participant.roomType}</span>
                      </div>
                    </div>

                    {/* Check-in/Check-out Info */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Check-in:</span> {formatDate(participant.checkIn)}
                      </div>
                      {participant.checkOut && (
                        <div>
                          <span className="font-medium text-gray-700">Check-out:</span> {formatDate(participant.checkOut)}
                        </div>
                      )}
                    </div>

                    {/* Departure Info */}
                    <div className="mt-4 text-sm">
                      <span className="font-medium text-gray-700">Departure:</span> {participant.departureDetails} at {participant.departureTime}
                    </div>

                    {/* Remarks */}
                    {(participant.remarks || participant.remarksRound2) && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Remarks:</span>
                        {participant.remarks && <p className="text-sm text-gray-600 mt-1">{participant.remarks}</p>}
                        {participant.remarksRound2 && <p className="text-sm text-gray-600 mt-1">{participant.remarksRound2}</p>}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {/* <Button variant="outline" size="sm">
                      Edit Details
                    </Button> */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePhoneCall(participant.phoneNumber, participant.name)}
                      className="flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Contact Guest
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
