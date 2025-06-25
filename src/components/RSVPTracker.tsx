import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Share2, Plus, Download, Settings, Users, Utensils, Hotel, Calendar, MapPin, Phone, Mail, MessageCircle, FileText, BarChart3, Bed, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

interface RSVPTrackerProps {
  guestStats: {
    totalInvited: number;
    confirmed: number;
    pending: number;
    declined: number;
  };
  eventCode?: string;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
];

const countries = [
  'United States', 'United Kingdom', 'India', 'UAE', 'Canada', 'Australia'
];

const events = [
  { id: 'haldi', name: 'Haldi Ceremony', date: '2024-06-13', time: '10:00 AM' },
  { id: 'mehendi', name: 'Mehendi Night', date: '2024-06-14', time: '6:00 PM' },
  { id: 'wedding', name: 'Wedding Ceremony', date: '2024-06-15', time: '11:00 AM' },
  { id: 'reception', name: 'Reception', date: '2024-06-15', time: '7:00 PM' },
];

// Sample guest data
const sampleGuests = [
  { id: 1, name: 'John Smith', email: 'john@email.com', phone: '+1-555-0101', status: 'confirmed', roomNeeded: true, roomType: 'Single' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1-555-0102', status: 'confirmed', roomNeeded: true, roomType: 'Double' },
  { id: 3, name: 'Mike Wilson', email: 'mike@email.com', phone: '+1-555-0103', status: 'pending', roomNeeded: false, roomType: null },
  { id: 4, name: 'Emily Davis', email: 'emily@email.com', phone: '+1-555-0104', status: 'confirmed', roomNeeded: true, roomType: 'Suite' },
  { id: 5, name: 'Robert Brown', email: 'robert@email.com', phone: '+1-555-0105', status: 'declined', roomNeeded: false, roomType: null },
];

const roomTypes = [
  { type: 'Single', count: 15, allocated: 8 },
  { type: 'Double', count: 20, allocated: 12 },
  { type: 'Suite', count: 5, allocated: 3 },
  { type: 'Family', count: 8, allocated: 2 },
];

export const RSVPTracker = ({ guestStats, eventCode }: RSVPTrackerProps) => {
  const { toast } = useToast();
  const [currency, setCurrency] = useState('USD');
  const [country, setCountry] = useState('United States');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const form = useForm({
    defaultValues: {
      currency: 'USD',
      country: 'United States',
      rsvpDeadline: '',
      websiteUrl: '',
      eventVenue: '',
      dresscode: '',
    }
  });

  const shareRSVPLink = () => {
    const rsvpUrl = `${window.location.origin}/rsvp/${eventCode || 'wedding123'}`;
    navigator.clipboard.writeText(rsvpUrl);
    toast({
      title: "RSVP Link Copied!",
      description: "Share this link with your guests to collect RSVPs.",
    });
  };

  const generateWhatsAppMessage = () => {
    const rsvpUrl = `${window.location.origin}/rsvp/${eventCode || 'wedding123'}`;
    const message = `Hi! Please RSVP to our wedding by clicking this link: ${rsvpUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendReminders = () => {
    toast({
      title: "Reminders Sent",
      description: `Reminder messages sent to ${guestStats.pending} pending guests.`,
    });
  };

  const exportGuestList = () => {
    toast({
      title: "Export Started",
      description: "Your guest list is being exported to CSV format.",
    });
  };

  const onSettingsSubmit = (data: any) => {
    setCurrency(data.currency);
    setCountry(data.country);
    setIsSettingsOpen(false);
    toast({
      title: "Settings Updated",
      description: `Currency set to ${currencies.find(c => c.code === data.currency)?.name} and country to ${data.country}`,
    });
  };

  const selectedCurrency = currencies.find(c => c.code === currency);
  const responseRate = Math.round((guestStats.confirmed + guestStats.declined) / guestStats.totalInvited * 100);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">RSVP Management</h2>
            <p className="text-slate-600">Track responses and manage your guest list</p>
          </div>
        </div>
        
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>RSVP Settings</DialogTitle>
              <DialogDescription>
                Configure your preferences and event details
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSettingsSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border shadow-lg z-50">
                            {currencies.map((curr) => (
                              <SelectItem key={curr.code} value={curr.code}>
                                {curr.symbol} {curr.code} - {curr.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border shadow-lg z-50">
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="rsvpDeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RSVP Deadline</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventVenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Venue</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter venue address" {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dresscode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dress Code</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select dress code" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border shadow-lg z-50">
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="semiformal">Semi-Formal</SelectItem>
                          <SelectItem value="cocktail">Cocktail</SelectItem>
                          <SelectItem value="traditional">Traditional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                  Save Settings
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guests">Guest Details</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="rooms">Room Allocation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Main Stats Card */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-800">Response Overview</CardTitle>
              <CardDescription className="text-slate-600">
                Current status: {responseRate}% response rate • {country} • {selectedCurrency?.symbol} {selectedCurrency?.code}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="text-3xl font-bold text-emerald-700 mb-1">{guestStats.confirmed}</div>
                  <div className="text-sm font-medium text-emerald-600">Confirmed</div>
                  <div className="text-xs text-emerald-500 mt-1">
                    {Math.round(guestStats.confirmed/guestStats.totalInvited*100)}% of total
                  </div>
                </div>
                
                <div className="text-center p-6 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="text-3xl font-bold text-amber-700 mb-1">{guestStats.pending}</div>
                  <div className="text-sm font-medium text-amber-600">Pending</div>
                  <div className="text-xs text-amber-500 mt-1">
                    {Math.round(guestStats.pending/guestStats.totalInvited*100)}% waiting
                  </div>
                </div>
                
                <div className="text-center p-6 bg-rose-50 rounded-2xl border border-rose-100">
                  <div className="text-3xl font-bold text-rose-700 mb-1">{guestStats.declined}</div>
                  <div className="text-sm font-medium text-rose-600">Declined</div>
                  <div className="text-xs text-rose-500 mt-1">
                    {Math.round(guestStats.declined/guestStats.totalInvited*100)}% declined
                  </div>
                </div>
                
                <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-3xl font-bold text-slate-700 mb-1">{guestStats.totalInvited}</div>
                  <div className="text-sm font-medium text-slate-600">Total Invited</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {responseRate}% responded
                  </div>
                </div>
              </div>

              {/* Planning Insights */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="p-5 bg-teal-50 rounded-xl border border-teal-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <Utensils className="h-5 w-5 text-teal-600" />
                    </div>
                    <h3 className="font-semibold text-teal-900">Catering</h3>
                  </div>
                  <p className="text-sm text-teal-700">~{Math.round(guestStats.confirmed * 0.4)} vegetarian</p>
                  <p className="text-sm text-teal-700">~{guestStats.confirmed - Math.round(guestStats.confirmed * 0.4)} non-vegetarian</p>
                </div>
                
                <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Hotel className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-indigo-900">Accommodation</h3>
                  </div>
                  <p className="text-sm text-indigo-700">~{Math.round(guestStats.confirmed * 0.3)} guests need</p>
                  <p className="text-sm text-indigo-700">accommodation help</p>
                </div>
                
                <div className="p-5 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-purple-900">Seating</h3>
                  </div>
                  <p className="text-sm text-purple-700">{Math.ceil(guestStats.confirmed / 8)} tables needed</p>
                  <p className="text-sm text-purple-700">(8 guests per table)</p>
                </div>

                <div className="p-5 bg-rose-50 rounded-xl border border-rose-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-rose-100 rounded-lg">
                      <Bed className="h-5 w-5 text-rose-600" />
                    </div>
                    <h3 className="font-semibold text-rose-900">Rooms</h3>
                  </div>
                  <p className="text-sm text-rose-700">Total allocated: 25</p>
                  <p className="text-sm text-rose-700">Available: 23</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={shareRSVPLink} 
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy RSVP Link
                </Button>
                <Button 
                  onClick={generateWhatsAppMessage} 
                  className="bg-green-600 hover:bg-green-700 text-white px-6"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp Invite
                </Button>
                <Button 
                  onClick={sendReminders}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reminders
                </Button>
                <Button variant="outline" className="border-slate-300 hover:bg-slate-50 px-6">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guest
                </Button>
                <Button 
                  onClick={exportGuestList}
                  variant="outline" 
                  className="border-slate-300 hover:bg-slate-50 px-6"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guests">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>Guest Details</span>
              </CardTitle>
              <CardDescription>Manage individual guest information and responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Name</th>
                      <th className="text-left p-3 font-semibold">Email</th>
                      <th className="text-left p-3 font-semibold">Phone</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                      <th className="text-left p-3 font-semibold">Room Needed</th>
                      <th className="text-left p-3 font-semibold">Room Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleGuests.map((guest) => (
                      <tr key={guest.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{guest.name}</td>
                        <td className="p-3 text-gray-600">{guest.email}</td>
                        <td className="p-3 text-gray-600">{guest.phone}</td>
                        <td className="p-3">
                          <Badge 
                            variant={guest.status === 'confirmed' ? 'default' : 
                                    guest.status === 'pending' ? 'secondary' : 'destructive'}
                          >
                            {guest.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant={guest.roomNeeded ? 'default' : 'outline'}>
                            {guest.roomNeeded ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td className="p-3 text-gray-600">{guest.roomType || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>Event-wise RSVP Tracking</span>
              </CardTitle>
              <CardDescription>Track attendance for individual events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {events.map((event) => (
                  <div key={event.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">{event.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {event.date}
                          </span>
                          <span>{event.time}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(guestStats.confirmed * (0.7 + Math.random() * 0.3))}
                        </div>
                        <div className="text-xs text-slate-500">attending</div>
                      </div>
                    </div>
                    <Progress value={75 + Math.random() * 20} className="mb-3" />
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Response Rate: {Math.round(75 + Math.random() * 20)}%</span>
                      <Button variant="outline" size="sm">
                        <FileText className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <span>RSVP Analytics</span>
              </CardTitle>
              <CardDescription>Detailed insights and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800">Response Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span className="text-sm">Last 7 days</span>
                      <Badge>+12 responses</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-sm">Last 30 days</span>
                      <Badge variant="secondary">+45 responses</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800">Guest Demographics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                      <span className="text-sm">Family Members</span>
                      <span className="font-semibold">{Math.round(guestStats.confirmed * 0.6)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-pink-50 rounded">
                      <span className="text-sm">Friends</span>
                      <span className="font-semibold">{Math.round(guestStats.confirmed * 0.4)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bed className="h-5 w-5 text-indigo-500" />
                <span>Room Allocation</span>
              </CardTitle>
              <CardDescription>Manage accommodation for your guests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800">Room Availability</h3>
                  <div className="space-y-4">
                    {roomTypes.map((room) => (
                      <div key={room.type} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{room.type} Room</span>
                          <span className="text-sm text-gray-600">{room.allocated}/{room.count}</span>
                        </div>
                        <Progress value={(room.allocated / room.count) * 100} className="mb-2" />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Allocated: {room.allocated}</span>
                          <span>Available: {room.count - room.allocated}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800">Room Assignments</h3>
                  <div className="space-y-2">
                    {sampleGuests.filter(guest => guest.roomNeeded).map((guest) => (
                      <div key={guest.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{guest.name}</span>
                          <Badge className="ml-2" variant="outline">{guest.roomType}</Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Manage
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Room
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
