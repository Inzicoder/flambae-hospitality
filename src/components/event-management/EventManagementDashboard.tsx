import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileUp, Upload, Bell, Mail, Users, Send, 
  Hotel, Car, Gift, Calendar, MessageCircle, HelpCircle,
  CheckCircle, Clock, AlertCircle, Star, Truck, 
  Settings, Download, Eye, Edit, Plus, Phone,
  Loader2
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { FileUploadButton } from './FileUploadButton';
import { HelpDeskTab } from './HelpDeskTab';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '@/lib/config';

// Event interface for type safety
interface EventDetails {
  id: string;
  eventName: string;
  venue: string;
  eventDateTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  food: string;
  // Additional fields that might come from API
  guestCount?: number;
  confirmedGuests?: number;
  pendingGuests?: number;
  declinedGuests?: number;
  progress?: number;
  phase?: string;
}

export const EventManagementDashboard = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activePhase, setActivePhase] = useState("before-event");
  const [activeTab, setActiveTab] = useState("data-collection");
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [apiSuccess, setApiSuccess] = useState(false);

  // Fetch event details from API
  const fetchEventDetails = async () => {
    if (!eventId) {
      setError('Event ID not provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.EVENTS.GET_BY_ID(eventId)), {
        headers: getAuthHeaders()
      });

      console.log(response.data,'response.data')

      if (response.data && response.data.status === 'success') {
        // API returns an array of events, get the first one
        const eventData = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
        setEventDetails(eventData);
      } else {
        throw new Error(response.data.message || 'Failed to fetch event details');
      }
    } catch (error: any) {
      console.error('Error fetching event details:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch event details');
      toast({
        title: "Error",
        description: "Failed to load event details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch event details on component mount
  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  // Before Event Phase Components
  const DataCollectionTab = () => (
    <div className="space-y-6">
      {/* Event Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Event Name</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{eventDetails?.eventName || 'Loading...'}</div>
            <p className="text-xs text-muted-foreground">Current Event</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Venue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{eventDetails?.venue || 'Loading...'}</div>
            <p className="text-xs text-muted-foreground">Event Location</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Event Date & Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-blue-600">
              {eventDetails?.eventDateTime ? new Date(eventDetails.eventDateTime).toLocaleDateString() : 'Loading...'}
            </div>
            <div className="text-sm text-blue-500">
              {eventDetails?.eventDateTime ? new Date(eventDetails.eventDateTime).toLocaleTimeString() : ''}
            </div>
            <p className="text-xs text-muted-foreground">Scheduled Date & Time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Food Preference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600 capitalize">
              {eventDetails?.food || 'Loading...'}
            </div>
            <p className="text-xs text-muted-foreground">Catering Type</p>
          </CardContent>
        </Card>
      </div>

      {/* Event Status and Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Event Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={eventDetails?.isActive ? "default" : "secondary"} className="text-lg px-3 py-1">
              {eventDetails?.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Current Status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-600">
              {eventDetails?.createdAt ? new Date(eventDetails.createdAt).toLocaleDateString() : 'Loading...'}
            </div>
            <p className="text-xs text-muted-foreground">Event Created Date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-600">
              {eventDetails?.updatedAt ? new Date(eventDetails.updatedAt).toLocaleDateString() : 'Loading...'}
            </div>
            <p className="text-xs text-muted-foreground">Last Modified</p>
          </CardContent>
        </Card>
      </div>

      {/* Event Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Event Management Actions
          </CardTitle>
          <CardDescription>Manage guest data and event logistics for {eventDetails?.eventName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FileUploadButton 
                eventId={eventId}
                onDataProcessed={(data) => {
                  console.log('Guest data processed:', data);
                  setUploadedData(data.guests || []);
                  setApiSuccess(true); // API call was successful
                  toast({
                    title: "Success",
                    description: `Successfully uploaded ${data.totalProcessed} guest records to the server`,
                  });
                }}
                onError={(error) => {
                  setApiSuccess(false); // Reset API success state on error
                  console.error('Upload error:', error);
                }}
              />
              <div className="text-sm text-muted-foreground">
                Upload guest information for this event
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Event Scheduled</span>
                </div>
                <div className="text-sm text-blue-700">
                  {eventDetails?.eventDateTime ? new Date(eventDetails.eventDateTime).toLocaleString() : 'Date not available'}
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Venue:</span>
                  <Badge variant="outline">{eventDetails?.venue || 'TBD'}</Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Uploaded Data Table - Only show when API is successful */}
          {apiSuccess && uploadedData && uploadedData.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Uploaded Guest Data</h3>
                  <p className="text-sm text-gray-600 mt-1">Review and edit guest information</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">Successfully uploaded to server</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {uploadedData.length} records loaded
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Name</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Phone</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Email</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Status</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">VIP</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Arrival</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {uploadedData.map((guest: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={guest.name || ''}
                              onChange={(e) => {
                                const newData = [...uploadedData];
                                newData[index].name = e.target.value;
                                setUploadedData(newData);
                              }}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={guest.phoneNumber || ''}
                              onChange={(e) => {
                                const newData = [...uploadedData];
                                newData[index].phoneNumber = e.target.value;
                                setUploadedData(newData);
                              }}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={guest.email || ''}
                              onChange={(e) => {
                                const newData = [...uploadedData];
                                newData[index].email = e.target.value;
                                setUploadedData(newData);
                              }}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <select
                              value={guest.status || 'Pending'}
                              onChange={(e) => {
                                const newData = [...uploadedData];
                                newData[index].status = e.target.value;
                                setUploadedData(newData);
                              }}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Declined">Declined</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <select
                              value={guest.isVip ? 'Yes' : 'No'}
                              onChange={(e) => {
                                const newData = [...uploadedData];
                                newData[index].isVip = e.target.value === 'Yes';
                                setUploadedData(newData);
                              }}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5"
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={guest.arrivalDate || ''}
                              onChange={(e) => {
                                const newData = [...uploadedData];
                                newData[index].arrivalDate = e.target.value;
                                setUploadedData(newData);
                              }}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (guest.phoneNumber && guest.phoneNumber.length === 10) {
                                    window.open(`tel:${guest.phoneNumber}`, '_self');
                                  } else {
                                    toast({
                                      title: "Invalid Phone Number",
                                      description: "Please enter a valid 10-digit phone number",
                                      variant: "destructive"
                                    });
                                  }
                                }}
                              >
                                <Phone className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const newData = uploadedData.filter((_, i) => i !== index);
                                  setUploadedData(newData);
                                  toast({
                                    title: "Guest Removed",
                                    description: `${guest.name} has been removed from the list`,
                                  });
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Total: {uploadedData.length} guests | 
                  Confirmed: {uploadedData.filter(g => g.status === 'Confirmed').length} | 
                  VIP: {uploadedData.filter(g => g.isVip).length}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setUploadedData([])}
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={() => {
                      toast({
                        title: "Data Saved",
                        description: `Updated ${uploadedData.length} guest records`,
                      });
                    }}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );

  const InviteManagementTab = () => (
    <div className="space-y-6">
      {/* Event Invitation Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Invitation Management
          </CardTitle>
          <CardDescription>Manage invitations for {eventDetails?.eventName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Send className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Invitation System</h3>
            <p className="text-gray-500 mb-4">Send invitations and track RSVPs for your event</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4 mr-2" />
              Send Invitations
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Broadcast Invitations with Guest IDs
          </CardTitle>
          <CardDescription>Send personalized invitations with unique guest identification (UID/DL/Passport)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Button className="w-full h-16 flex items-center gap-2">
                <Send className="h-5 w-5" />
                Broadcast Invitations
              </Button>
              <div className="text-sm text-muted-foreground">
                Personalized invitations will be sent via SMS/Email with guest IDs
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-2 mb-1">
                  <Upload className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Guest ID Mapping</span>
                </div>
                <div className="text-sm text-blue-700">150 unique IDs generated</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status:</span>
                  <Badge variant="outline" className="text-green-600">Ready</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guest List Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Guest List Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Guest List</h3>
            <p className="text-gray-500 mb-4">Guest information will be displayed here</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Users className="h-4 w-4 mr-2" />
              View Guest List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const HotelManagementTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hotel className="h-5 w-5" />
            Hotel Management
          </CardTitle>
          <CardDescription>Manage hotel coordination for {eventDetails?.eventName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Hotel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Hotel Coordination</h3>
            <p className="text-gray-500 mb-4">Manage room allotment and guest accommodation</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Hotel className="h-4 w-4 mr-2" />
              Manage Hotel Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const LogisticsTab = () => (
    <div className="space-y-6">
      {/* Logistics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cabs Allotted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Transport Vehicles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">VIP Transport</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">-</div>
            <p className="text-xs text-muted-foreground">Premium Vehicles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Airport Pickups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">-</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="font-bold text-center text-yellow-600">-</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Cab Allotment & Scheduling
          </CardTitle>
          <CardDescription>Track transportation arrangements and schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Transportation Schedule</h3>
            <p className="text-gray-500 mb-4">Transportation arrangements will be displayed here</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Truck className="h-4 w-4 mr-2" />
              Manage Transportation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PreEventExecutionTab = () => (
    <div className="space-y-6">
      {/* Pre-Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reminders Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Confirmations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confirmations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">-</div>
            <p className="text-xs text-muted-foreground">Received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gifts Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">-</div>
            <p className="text-xs text-muted-foreground">To Rooms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">VIP Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">-</div>
            <p className="text-xs text-muted-foreground">Set</p>
          </CardContent>
        </Card>
      </div>

      {/* Pre-Event Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Send Reminders & Confirmations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full">Send Final Reminders</Button>
              <Button variant="outline">Bulk Message Pending Guests</Button>
              <div className="p-3 border rounded-lg bg-green-50">
                <div className="text-sm text-green-700">
                  ✓ Reminders sent to 45 guests<br/>
                  ✓ 38 confirmations received<br/>
                  ⏳ 7 pending responses
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Preparation */}
        <Card>
          <CardHeader>
            <CardTitle className=" flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Room Preparation & Gifts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full">Update Gift Status</Button>
              <Button variant="outline">VIP Room Preferences</Button>
              <div className="p-3 border rounded-lg bg-purple-50">
                <div className="text-sm text-purple-700">
                  ✓ 25 gifts delivered to rooms<br/>
                  ✓ 12 VIP preferences set<br/>
                  ⏳ 10 gifts remaining
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VIP Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            VIP Preferences Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">VIP Preferences</h3>
            <p className="text-gray-500 mb-4">VIP guest preferences will be displayed here</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Star className="h-4 w-4 mr-2" />
              Manage VIP Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CommunicationTab = () => (
    <div className="space-y-6">
      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Itineraries Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">-</div>
            <p className="text-xs text-muted-foreground">Event Details</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Personalized Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">-</div>
            <p className="text-xs text-muted-foreground">Bride/Groom Side</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">-</div>
            <p className="text-xs text-muted-foreground">Pending Actions</p>
          </CardContent>
        </Card>
      </div>

      {/* Communication Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Send Event Itinerary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full">Send Complete Itinerary</Button>
              <Button variant="outline">Bride's Side Schedule</Button>
              <Button variant="outline">Groom's Side Schedule</Button>
              <div className="p-3 border rounded-lg bg-blue-50">
                <div className="text-sm text-blue-700">
                  ✓ Sent to all confirmed guests<br/>
                  ⏳ 2 schedules pending review
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Personalized Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full">Bride's Side Messages</Button>
              <Button variant="outline">Groom's Side Messages</Button>
              <Button variant="outline">VIP Special Messages</Button>
              <div className="p-3 border rounded-lg bg-green-50">
                <div className="text-sm text-green-700">
                  ✓ 45 personalized messages sent<br/>
                  ⏳ 5 custom messages pending
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Message Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: "Welcome Message - Bride's Side", content: "Welcome to Sarah's side! Enjoy...", recipients: 45 },
              { title: "Welcome Message - Groom's Side", content: "Welcome to Michael's side! Let's...", recipients: 32 },
              { title: "VIP Accommodation Message", content: "Your VIP suite is ready with...", recipients: 12 },
              { title: "Transportation Reminder", content: "Your pickup is scheduled for...", recipients: 28 }
            ].map((template, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{template.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{template.content}</div>
                    <div className="text-xs text-muted-foreground mt-1">{template.recipients} recipients</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Send</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const RequestsManagementTab = () => (
    <div className="space-y-6">
      {/* Request Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">-</div>
            <p className="text-xs text-muted-foreground">All Requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">-</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">-</div>
            <p className="text-xs text-muted-foreground">-</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">High Priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Request Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Guest Requests Dashboard
          </CardTitle>
          <CardDescription>Manage requests received via WhatsApp/Calls during the event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filter Options */}
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm">All Requests</Button>
              <Button variant="outline" size="sm">WhatsApp</Button>
              <Button variant="outline" size="sm">Phone Calls</Button>
              <Button variant="outline" size="sm">Urgent</Button>
              <Button variant="outline" size="sm">VIP</Button>
            </div>

            {/* Requests List */}
            <div className="text-center py-8">
              <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Guest Requests</h3>
              <p className="text-gray-500 mb-4">Guest requests will be displayed here</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <HelpCircle className="h-4 w-4 mr-2" />
                View Requests
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="text-center py-12">
          <CardContent>
            <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading Event Details...</h3>
            <p className="text-gray-500">Please wait while we fetch the event information</p>
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
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Failed to Load Event</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchEventDetails}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

 

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Event Phase Navigation */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Event Management Dashboard</h1>
              <p className="text-blue-100">Complete Event Management Workflow</p>
              {eventDetails && (
                <p className="text-blue-200 text-sm mt-1">
                  Managing: {eventDetails.eventName} at {eventDetails.venue}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate(`/event-participants/${eventId}`)}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Users className="h-4 w-4 mr-2" />
                View Participants
              </Button>
              <Badge variant="secondary" className="bg-white text-blue-600">
                {activePhase === "before-event" ? "Before Event" : "During Event"}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant={activePhase === "before-event" ? "default" : "outline"}
              onClick={() => setActivePhase("before-event")}
              className={`w-full sm:w-auto ${activePhase === "before-event" 
                ? "bg-white text-blue-600 hover:bg-blue-50" 
                : "border-white/50 text-white/80 bg-white/10 hover:bg-white/20 hover:text-white"
              }`}
            >
              Before Event Phase
            </Button>
            <Button 
              variant={activePhase === "during-event" ? "default" : "outline"}
              onClick={() => setActivePhase("during-event")}
              className={`w-full sm:w-auto ${activePhase === "during-event" 
                ? "bg-white text-blue-600 hover:bg-blue-50" 
                : "border-white/50 text-white/80 bg-white/10 hover:bg-white/20 hover:text-white"
              }`}
            >
              During Event Phase
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid mb-6 ${
          activePhase === "before-event" ? "grid-cols-5" : "grid-cols-3"
        }`}>
          {activePhase === "before-event" ? (
            <>
              <TabsTrigger value="data-collection" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Collect Data</span>
              </TabsTrigger>
              <TabsTrigger value="invites" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Broadcast Invites</span>
              </TabsTrigger>
              <TabsTrigger value="hotel" className="flex items-center gap-2">
                <Hotel className="h-4 w-4" />
                <span className="hidden sm:inline">Hotel</span>
              </TabsTrigger>
              <TabsTrigger value="logistics" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span className="hidden sm:inline">Logistics</span>
              </TabsTrigger>
              <TabsTrigger value="pre-event" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Pre-Event</span>
              </TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="communication" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Communication</span>
              </TabsTrigger>
              <TabsTrigger value="helpdesk" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Help Desk</span>
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Live Dashboard</span>
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="data-collection" className="space-y-4">
          <DataCollectionTab />
        </TabsContent>

        <TabsContent value="invites" className="space-y-4">
          <InviteManagementTab />
        </TabsContent>

        <TabsContent value="hotel" className="space-y-4">
          <HotelManagementTab />
        </TabsContent>

        <TabsContent value="logistics" className="space-y-4">
          <LogisticsTab />
        </TabsContent>

        <TabsContent value="pre-event" className="space-y-4">
          <PreEventExecutionTab />
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <CommunicationTab />
        </TabsContent>

        <TabsContent value="helpdesk" className="space-y-4">
          <HelpDeskTab eventId={eventId} />
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardContent className="text-center py-12">
              <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Live Event Dashboard</h3>
              <p className="text-gray-500">Real-time monitoring and management during the event</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};