import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  Calendar, 
  Users, 
  MapPin, 
  Settings, 
  Trash2, 
  Eye,
  Building,
  Heart,
  Building2,
  TrendingUp,
  Clock,
  Star,
  AlertCircle,
  Loader2,
  Leaf,
  Beef
} from 'lucide-react';
import { EventCompanyHeader } from './EventCompanyHeader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { API_CONFIG, getApiUrl, getAuthHeaders, ApiResponse } from '@/lib/config';
import { 
  getCurrentUserRole, 
  canAccessEvents, 
  canCreateEvents, 
  canDeleteEvents, 
  handleRoleBasedError,
  getUserRoleInfo,
  setCurrentUserRole
} from '@/lib/rbac';
import { 
  RoleBasedAccess, 
  CanCreateEvents, 
  CanDeleteEvents, 
  CanAccessEvents,
  AccessDeniedMessage,
  UserRoleDisplay 
} from '@/components/RoleBasedAccess';

// Event interface for type safety
interface Event {
  id: string;
  name: string;
  type: string;
  date: string;
  status: string;
  guestCount: number;
  confirmedGuests: number;
  pendingGuests: number;
  declinedGuests: number;
  location: string;
  phase: string;

  tags: string[];
  createdDate: string;
  urgentTasks: number;
  revenue: number;
}

export const EventsListingDashboard = ({ weddingData }: { weddingData: any }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [dateError, setDateError] = useState<string>('');
  
  // Form state for creating new event
  const [formData, setFormData] = useState({
    eventName: '',
    eventDateTime: '',
    venue: '',
    food: ['veg'] // Array to allow multiple selections
  });

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
    const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.EVENTS.LIST), {
      headers: getAuthHeaders()
    });

      if (response.data && response.data.status === 'success') {
        // Transform API data to match our interface based on actual API response
        const transformedEvents = response.data.data.map((event: any) => ({
          id: event.id,
          name: event.eventName,
          type: 'Event', // Default type since API doesn't provide this
          date: event.eventDateTime,
          status: event.isActive ? 'Active' : 'Inactive',
          guestCount: 0, // Default since API doesn't provide guest count
          confirmedGuests: 0,
          pendingGuests: 0,
          declinedGuests: 0,
          location: event.venue,
          tags: [event.food], // Use food preference as tag
          createdDate: event.createdAt,
          urgentTasks: 0,
        }));
        
        setEvents(transformedEvents);
      } else {
        throw new Error(response.data.message || 'Failed to fetch events');
      }
    } catch (error: any) {
      console.error('Error fetching events:', error);
      
      // Handle role-based access errors
      const roleError = handleRoleBasedError(error);
      console.log(roleError,'roleError')
      
      if (roleError.isRoleError) {
        setError(roleError.message);
        toast({
          title: "Access Denied",
          description: roleError.suggestion,
          variant: "destructive"
        });
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to fetch events');
        toast({
          title: "Error",
          description: "Failed to load events. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    // Check if user has access before fetching
    if (canAccessEvents()) {
      fetchEvents();
    }
  }, []);

  // Check if user has access to events
  const currentUserRole = getCurrentUserRole();
  const hasAccess = canAccessEvents();

  // If user doesn't have access, show access denied message
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EventCompanyHeader weddingData={undefined} eventId={undefined} />
        <div className="container mx-auto px-4 py-8">
          <AccessDeniedMessage 
            requiredPermission="events:read"
            customMessage="You don't have permission to access the Events Management Center. Please contact your administrator."
          />
        </div>
      </div>
    );
  }

  // Handle event deletion
  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.EVENTS.DELETE(eventId)), {
        headers: getAuthHeaders()
      });

      if (response.data && response.data.status === 'success') {
        setEvents(prev => prev.filter(event => event.id !== eventId));
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
      } else {
        throw new Error(response.data.message || 'Failed to delete event');
      }
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete event",
        variant: "destructive"
      });
    }
  };

  // Handle food preference checkbox changes
  const handleFoodChange = (foodType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      food: checked 
        ? [...prev.food, foodType]
        : prev.food.filter(f => f !== foodType)
    }));
  };

  // Handle date change with validation
  const handleDateChange = (dateValue: string) => {
    setFormData(prev => ({ ...prev, eventDateTime: dateValue }));
    
    if (dateValue) {
      const selectedDate = new Date(dateValue);
      const currentDate = new Date();
      
      if (selectedDate <= currentDate) {
        setDateError('Event date must be in the future');
      } else {
        setDateError('');
      }
    } else {
      setDateError('');
    }
  };

  // Handle create event
  const handleCreateEvent = async () => {
    let foodType =''
    if(formData.food.length > 1) {
      foodType = 'both'
    }
    else{
      foodType = formData.food[0]
    }
    console.log(foodType,'foodType')
    try {
      setIsCreating(true);
      
      // Validate form data
      if (!formData.eventName.trim() || !formData.eventDateTime || !formData.venue.trim() || formData.food.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields and select at least one food option",
          variant: "destructive"
        });
        return;
      }

      // Check for date validation errors
      if (dateError) {
        toast({
          title: "Invalid Date",
          description: dateError,
          variant: "destructive"
        });
        return;
      }



      const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.EVENTS.CREATE), {
        eventName: formData.eventName.trim(),
        eventDateTime: formData.eventDateTime,
        venue: formData.venue.trim(),
        food: foodType 
      }, {
        headers: getAuthHeaders()
      });

      if (response.data && response.data.status === 'success') {
        toast({
          title: "Success",
          description: "Event created successfully",
        });
        
        // Reset form
        setFormData({
          eventName: '',
          eventDateTime: '',
          venue: '',
          food: ['veg']
        });
        setDateError('');
        
        // Close dialog
        setIsCreateDialogOpen(false);
        
        // Refresh events list
        await fetchEvents();
      } else {
        throw new Error(response.data.message || 'Failed to create event');
      }
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create event",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Handle view event dashboard
  const handleViewEvent = (eventId: string, eventData: any) => {
    navigate(`/event-management/${eventId}`, { 
      state: { eventData },
      replace: false 
    });
  };

  // Format event date for display
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Calculate days remaining
  const getDaysRemaining = (dateString: string) => {
    try {
      const today = new Date();
      const eventDate = new Date(dateString);
      
      if (isNaN(eventDate.getTime())) {
        return 0;
      }
      
      const diffTime = eventDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      return 0;
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Planning": return "secondary";
      case "Draft": return "outline";
      case "Completed": return "outline";
      default: return "outline";
    }
  };



  // Calculate total statistics
  const totalStats = {
    totalEvents: events.length,
    activeEvents: events.filter(e => e.status === "Active").length,
    completedEvents: events.filter(e => e.status === "Completed").length,
    totalGuests: events.reduce((sum, e) => sum + e.guestCount, 0),
    totalRevenue: events.reduce((sum, e) => sum + e.revenue, 0),
    urgentTasks: events.reduce((sum, e) => sum + e.urgentTasks, 0)
  };



  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Events Management Center</h1>
            <p className="text-blue-100">Manage all your events from one central dashboard</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="secondary" 
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new event.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="eventName">Event Name *</Label>
                  <Input
                    id="eventName"
                    placeholder="Enter event name"
                    value={formData.eventName}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="eventDateTime">Event Date & Time *</Label>
                  <Input
                    id="eventDateTime"
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    value={formData.eventDateTime}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className={dateError ? 'border-red-500 focus:border-red-500' : ''}
                  />
                  {dateError ? (
                    <p className="text-xs text-red-500">{dateError}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Only future dates are allowed
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="venue">Venue *</Label>
                  <Input
                    id="venue"
                    placeholder="Enter venue name"
                    value={formData.venue}
                    onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Food Preference *</Label>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="veg"
                        checked={formData.food.includes('veg')}
                        onCheckedChange={(checked) => handleFoodChange('veg', checked as boolean)}
                      />
                      <Label htmlFor="veg" className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        Vegetarian
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="non-veg"
                        checked={formData.food.includes('non-veg')}
                        onCheckedChange={(checked) => handleFoodChange('non-veg', checked as boolean)}
                      />
                      <Label htmlFor="non-veg" className="flex items-center gap-2">
                        <Beef className="h-4 w-4 text-red-600" />
                        Non-Vegetarian
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateEvent}
                  disabled={isCreating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-white" />
              <div className="text-2xl font-bold text-white">{totalStats.totalEvents}</div>
              <div className="text-sm text-blue-100">Total Events</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-white" />
              <div className="text-2xl font-bold text-white">{totalStats.activeEvents}</div>
              <div className="text-sm text-blue-100">Active Events</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-white" />
              <div className="text-2xl font-bold text-white">{totalStats.completedEvents}</div>
              <div className="text-sm text-blue-100">Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-white" />
              <div className="text-2xl font-bold text-white">{totalStats.totalGuests}</div>
              <div className="text-sm text-blue-100">Total Guests</div>
            </CardContent>
          </Card>
{/* 
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-white" />
              <div className="text-2xl font-bold text-white">${totalStats.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-blue-100">Revenue</div>
            </CardContent>
          </Card> */}

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
              <div className="text-2xl font-bold text-white">{totalStats.urgentTasks}</div>
              <div className="text-sm text-blue-100">Urgent Tasks</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="text-center py-12">
          <CardContent>
            <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading Events...</h3>
            <p className="text-gray-500">Please wait while we fetch your events</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Failed to Load Events</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchEvents}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Events Grid */}
      {!loading && !error && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">All Events</h2>
            <div className="flex gap-2">
              <Badge variant="outline">All Types</Badge>
              <Badge variant="outline">All Status</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const daysRemaining = getDaysRemaining(event.date);
              
              return (
                <Card key={event.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-800 mb-1">
                          {event.name}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {event.type} Event • {event.id}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Badge variant={getStatusBadgeVariant(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatEventDate(event.date)}</span>
                        {daysRemaining > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {daysRemaining} days left
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      {/* <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{event.guestCount} guests ({event.confirmedGuests} confirmed)</span>
                      </div> */}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Progress Bar */}


                    {/* Tags */}
                    <div className="flex gap-1 mb-4 flex-wrap">
                    {event.tags.flatMap((tag) => {
                      const lower = tag.toLowerCase();

                      // If backend returns "both" → expand into ["veg", "non-veg"]
                      const expandedTags =
                        lower === "both" ? ["veg", "non-veg"] : [tag];

                      return expandedTags.map((t, index) => {
                        const tl = t.toLowerCase();
                        const isVeg = tl === "veg";
                        const isNonVeg = tl === "non-veg" || tl === "nonveg";

                        return (
                          <Badge
                            key={`${tag}-${index}`}
                            variant="outline"
                            className={`text-xs flex items-center gap-1 ${
                              isVeg
                                ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                : isNonVeg
                                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {isVeg && <Leaf className="h-3 w-3" />}
                            {isNonVeg && <Beef className="h-3 w-3" />}
                            {t}
                          </Badge>
                        );
                      });
                    })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => handleViewEvent(event.id, event)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Dashboard
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the event "{event.name}" and all its associated data. 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 text-white hover:bg-red-700"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              Delete Event
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-3 pt-3 border-t border-gray-100">

                      {event.urgentTasks > 0 && (
                        <div className="mt-1">
                          <Badge variant="destructive" className="text-xs">
                            {event.urgentTasks} urgent tasks
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {events.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first event</p>
                <Button>
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Event
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

// Export the component for use in routing
export default EventsListingDashboard;
