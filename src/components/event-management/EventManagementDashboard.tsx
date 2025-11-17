import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileUp, Upload, Bell, Mail, Users, Send, 
  Hotel, Car, Gift, Calendar, MessageCircle, HelpCircle,
  CheckCircle, Clock, AlertCircle, Star, Truck, 
  Settings, Download, Eye, Edit, Plus, Phone,
  Loader2, FileText, Save
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { FileUploadButton } from './FileUploadButton';
import { HelpDeskTab } from './HelpDeskTab';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '@/lib/config';
import * as XLSX from 'xlsx';

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
  const scrollRestoreRef = useRef<{
    scrollTop: number;
    scrollLeft: number;
    element: HTMLElement | null;
    activeElement: HTMLElement | null;
    selectionStart: number | null;
    selectionEnd: number | null;
  } | null>(null);
  const tableScrollContainerRef = useRef<HTMLDivElement | null>(null);

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

  // Fetch participants from API
  const fetchParticipants = async (): Promise<any[] | null> => {
    if (!eventId) return null;

    try {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.PARTICIPANTS.LIST(eventId));
      console.log('Fetching participants from:', url);
      
      const response = await axios.get(
        url,
        {
          headers: getAuthHeaders()
        }
      );

      console.log('Participants API response:', response.data);

      if (response.data && response.data.status === 'success') {
        const participants = response.data.data || [];
        
        if (participants.length === 0) {
          console.log('No participants found for this event');
          return null;
        }
        
        // Transform API response to match the uploadedData format
        const transformedData = participants.map((participant: any) => ({
          id: participant.id,
          name: participant.name || '',
          category: participant.category || '',
          phoneNumber: participant.phoneNumber || '',
          city: participant.city || '',
          // Convert UTC date from API to local date string for display
          arrivalDate: participant.dateOfArrival ? formatDateForInput(participant.dateOfArrival) : '',
          modeOfArrival: participant.modeOfArrival || '',
          trainFlightNumber: participant.trainFlightNumber || '',
          time: participant.time || '',
          hotelName: participant.hotelName || '',
          roomType: participant.roomType || '',
          checkIn: participant.checkIn ? (participant.checkIn === 'Yes' || participant.checkIn === 'yes' ? 'Yes' : 'No') : 'No',
          checkOut: participant.checkOut ? (participant.checkOut === 'Yes' || participant.checkOut === 'yes' ? 'Yes' : 'No') : 'No',
          attending: participant.attending ? (participant.attending === 'Yes' || participant.attending === 'yes' ? 'Yes' : 'No') : 'No',
          remarks: participant.remarks || '',
          remarksRound2: participant.remarksRound2 || '',
        }));

        if (transformedData.length > 0) {
          setUploadedData(transformedData);
          setApiSuccess(true);
          console.log('Successfully loaded', transformedData.length, 'participants');
          return transformedData;
        }
      } else {
        console.warn('Unexpected API response format:', response.data);
      }
    } catch (error: any) {
      console.error('Error fetching participants:', error);

      // Only show error if it's not a 404 (participants might not exist yet)
      if (error.response?.status !== 404) {
        console.warn('Failed to fetch participants. This is normal if no participants have been uploaded yet.');
      }
    }
    return null;
  };

  // Helper function to restore scroll position and focus
  const restoreScrollAndFocus = useCallback(() => {
    if (!scrollRestoreRef.current) return;

    const { scrollTop, scrollLeft, element, activeElement, selectionStart, selectionEnd } = scrollRestoreRef.current;

    // Restore scroll position
    if (element) {
      element.scrollTop = scrollTop;
      element.scrollLeft = scrollLeft;
    } else {
      window.scrollTo(scrollLeft, scrollTop);
    }

    // Restore focus and cursor position
    if (activeElement) {
      activeElement.focus();
      if (activeElement.tagName === 'INPUT' && selectionStart !== null && selectionEnd !== null) {
        (activeElement as HTMLInputElement).setSelectionRange(selectionStart, selectionEnd);
      }
    }

    // Clear the ref after restoring
    scrollRestoreRef.current = null;
  }, []);

  // Helper function to convert UTC date string to local date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try {
      // If it's already in YYYY-MM-DD format, return as is (date input expects local date)
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      // Parse UTC date and convert to local date for display
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        // Get local date components (not UTC)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch (e) {
      // If parsing fails, try to extract date parts from common formats
      const parts = dateString.split(/[-\/]/);
      if (parts.length === 3) {
        // Try DD-MM-YYYY or MM-DD-YYYY
        if (parts[2].length === 4) {
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
    }
    return dateString;
  };

  // Helper function to convert local date + time to UTC ISO string
  const convertToUTC = (dateString: string, timeString?: string): string | null => {
    if (!dateString) return null;
    
    try {
      let date: Date;
      
      // If date is in YYYY-MM-DD format (from date input)
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        // Parse as local date
        const [year, month, day] = dateString.split('-').map(Number);
        date = new Date(year, month - 1, day);
        
        // If time is provided, add it
        if (timeString) {
          const timeMatch = timeString.match(/(\d{1,2}):?(\d{2})/);
          if (timeMatch) {
            const hours = parseInt(timeMatch[1]);
            const minutes = parseInt(timeMatch[2]);
            date.setHours(hours, minutes, 0, 0);
          }
        } else {
          // Default to midnight if no time provided
          date.setHours(0, 0, 0, 0);
        }
      } else {
        // Try to parse as existing date string
        date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return null;
        }
        
        // If time is provided separately, update it
        if (timeString) {
          const timeMatch = timeString.match(/(\d{1,2}):?(\d{2})/);
          if (timeMatch) {
            const hours = parseInt(timeMatch[1]);
            const minutes = parseInt(timeMatch[2]);
            date.setHours(hours, minutes, 0, 0);
          }
        }
      }
      
      // Convert to UTC ISO string
      return date.toISOString();
    } catch (e) {
      console.warn('Could not convert date to UTC:', dateString, e);
      return null;
    }
  };

  // Helper function to format time for time input (HH:MM)
  const formatTimeForInput = (timeString: string | undefined): string => {
    if (!timeString) return '';
    // If already in HH:MM format, return as is
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }
    // Try to extract time from various formats
    const timeMatch = timeString.match(/(\d{1,2}):?(\d{2})/);
    if (timeMatch) {
      const hours = String(parseInt(timeMatch[1])).padStart(2, '0');
      const minutes = String(parseInt(timeMatch[2])).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return timeString;
  };

  // Helper function to update field value while preserving scroll position and focus
  const updateField = useCallback((index: number, field: string, value: string) => {
    // Save current scroll position and active element BEFORE state update
    const activeElement = document.activeElement as HTMLInputElement | HTMLSelectElement | null;
    
    // Use the ref to the scroll container if available, otherwise try to find it
    let scrollContainer: HTMLElement | null = tableScrollContainerRef.current;
    
    if (!scrollContainer && activeElement) {
      // Fallback: try to find scroll container
      scrollContainer = activeElement.closest('.overflow-x-auto') as HTMLElement | null;
      if (!scrollContainer) {
        scrollContainer = activeElement.closest('.overflow-y-auto') as HTMLElement | null;
      }
      if (!scrollContainer) {
        scrollContainer = activeElement.closest('.max-h-96') as HTMLElement | null;
      }
    }

    const scrollTop = scrollContainer?.scrollTop ?? window.scrollY;
    const scrollLeft = scrollContainer?.scrollLeft ?? window.scrollX;
    
    // Only get selection for input elements (not select)
    let selectionStart: number | null = null;
    let selectionEnd: number | null = null;
    if (activeElement && activeElement.tagName === 'INPUT') {
      const inputElement = activeElement as HTMLInputElement;
      selectionStart = inputElement.selectionStart;
      selectionEnd = inputElement.selectionEnd;
    }

    // Store scroll info in ref
    scrollRestoreRef.current = {
      scrollTop,
      scrollLeft,
      element: scrollContainer,
      activeElement: activeElement as HTMLElement | null,
      selectionStart,
      selectionEnd
    };

    // Update state
    setUploadedData((prevData) => {
      const newData = [...prevData];
      if (newData[index]) {
        (newData[index] as any)[field] = value;
      }
      return newData;
    });

    // Restore scroll position and focus using multiple strategies
    // Use setTimeout to ensure it happens after React's render cycle
    setTimeout(() => {
      restoreScrollAndFocus();
    }, 0);
    
    // Also use requestAnimationFrame as backup
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        restoreScrollAndFocus();
      });
    });
  }, [restoreScrollAndFocus]);

  // Save participant function
  const saveParticipant = async (guest: any, index: number) => {
    try {
      // Convert date and time to UTC ISO format
      // The date input provides YYYY-MM-DD in local time, we need to convert to UTC
      const dateOfArrival = convertToUTC(guest.arrivalDate, guest.time);

      // Prepare the data for API update - match API expected format
      // All dates should be in UTC ISO format
      const participantData: any = {
        name: guest.name || '',
        category: guest.category || '',
        phoneNumber: guest.phoneNumber || '',
        city: guest.city || '',
        dateOfArrival: dateOfArrival, // Already in UTC ISO format
        modeOfArrival: guest.modeOfArrival || '',
        trainFlightNumber: guest.trainFlightNumber || '',
        time: guest.time || '', // Keep time as separate field if API expects it
        hotelName: guest.hotelName || '',
        roomType: guest.roomType || '',
        checkIn: guest.checkIn === 'Yes' || guest.checkIn === 'yes' ? 'Yes' : 'No',
        checkOut: guest.checkOut === 'Yes' || guest.checkOut === 'yes' ? 'Yes' : 'No',
        attending: guest.attending === 'Yes' || guest.attending === 'yes' ? 'Yes' : 'No',
      };

      // Only include remarks if they exist
      if (guest.remarks) {
        participantData.remarks = guest.remarks;
      }
      if (guest.remarksRound2) {
        participantData.remarksRound2 = guest.remarksRound2;
      }

      console.log('Saving participant data:', participantData);
      console.log('Participant ID:', guest.id);

      if (guest.id) {
        // Update existing participant
        const url = getApiUrl(API_CONFIG.ENDPOINTS.PARTICIPANTS.UPDATE(guest.id));
        console.log('Updating participant at:', url);
        
        const response = await axios.patch(
          url,
          participantData,
          {
            headers: getAuthHeaders()
          }
        );
        
        console.log('Update response:', response.data);
        
        // Refetch to get updated data
        await fetchParticipants();
        
        toast({
          title: "Success",
          description: `${guest.name}'s information has been saved successfully.`,
        });
      } else {
        // If no ID, create new participant (if eventId is available)
        if (eventId) {
          const url = getApiUrl(API_CONFIG.ENDPOINTS.PARTICIPANTS.CREATE(eventId));
          console.log('Creating participant at:', url);
          
          const response = await axios.post(
            url,
            participantData,
            {
              headers: getAuthHeaders()
            }
          );
          
          console.log('Create response:', response.data);
          
          // Refetch to get the ID
          await fetchParticipants();
          
          toast({
            title: "Success",
            description: `${guest.name}'s information has been saved successfully.`,
          });
        } else {
          toast({
            title: "Error",
            description: "Event ID is missing. Cannot save participant.",
            variant: "destructive"
          });
        }
      }
    } catch (error: any) {
      console.error('Error saving participant:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Request data:', error.config?.data);
      
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to save participant information.",
        variant: "destructive"
      });
    }
  };

  // Function to download uploaded data as Excel file
  const downloadAsExcel = useCallback(() => {
    if (!uploadedData || uploadedData.length === 0) {
      toast({
        title: "No Data",
        description: "No data available to download.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Prepare data for Excel export - match the table structure
      const excelData = uploadedData.map((guest, index) => ({
        'S.No': index + 1,
        'Name': guest.name || '',
        'Category': guest.category || '',
        'Mobile No.': guest.phoneNumber || '',
        'City': guest.city || '',
        'Date Of Arrival': guest.arrivalDate || '',
        'Mode of Arrival': guest.modeOfArrival || '',
        'Train/Flight Number': guest.trainFlightNumber || '',
        'Time': guest.time || '',
        'Hotel Name': guest.hotelName || '',
        'Room Type': guest.roomType || '',
        'Check-in': guest.checkIn || 'No',
        'Check-out': guest.checkOut || 'No',
        'Attending': guest.attending || 'No',
        'Remarks': guest.remarks || '',
        'Remarks (round 2)': guest.remarksRound2 || '',
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Guest Data');

      // Generate filename with event name and current date
      const eventName = eventDetails?.eventName || 'Event';
      const sanitizedEventName = eventName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `${sanitizedEventName}_guest_data_${currentDate}.xlsx`;

      // Download the file
      XLSX.writeFile(workbook, filename);

      toast({
        title: "Download Successful",
        description: `Excel file "${filename}" has been downloaded.`,
      });
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate Excel file. Please try again.",
        variant: "destructive"
      });
    }
  }, [uploadedData, eventDetails, toast]);

  // Restore scroll position after render (only when ref has data)
  useLayoutEffect(() => {
    if (scrollRestoreRef.current) {
      // Use a small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        restoreScrollAndFocus();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  });

  // Fetch event details and participants on component mount
  useEffect(() => {
    fetchEventDetails();
    fetchParticipants();
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
              {eventDetails?.food === "both" ? ["Veg", "Non-Veg"].join(", ") : eventDetails?.food || 'Loading...'}

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
                onDataProcessed={async (data) => {
                  console.log('Guest data processed:', data);
                  // Set the uploaded data immediately so the table shows up
                  if (data.guests && data.guests.length > 0) {
                    setUploadedData(data.guests);
                    setApiSuccess(true);
                  }
                  
                  // Then refetch participants to get IDs from the API
                  try {
                    const participants = await fetchParticipants();
                    if (participants && participants.length > 0) {
                      // Update with data that has IDs
                      setUploadedData(participants);
                    }
                  } catch (error) {
                    console.error('Error refetching participants:', error);
                    // Keep the uploaded data even if refetch fails
                  }
                  
                  toast({
                    title: "Success",
                    description: `Successfully uploaded ${data.totalProcessed} guest records to the server`,
                  });
                }}
                onError={(error) => {
                  setApiSuccess(false); // Reset API success state on error
                  setUploadedData([]); // Clear uploaded data on error
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
          
          {/* Uploaded Data Table - Show when data is uploaded */}
          {uploadedData && uploadedData.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Uploaded Guest Data</h3>
                  <p className="text-sm text-gray-600 mt-1">Review and edit guest information</p>
                  {apiSuccess && (
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">Successfully uploaded to server</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadAsExcel}
                    className="flex items-center gap-2 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                  >
                    <Download className="h-4 w-4" />
                    Download Excel
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div ref={tableScrollContainerRef} className="max-h-96 overflow-x-auto overflow-y-auto">
                  <div className="min-w-full inline-block">
                    <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-2 py-2 text-left font-medium text-gray-700 text-xs">S.No</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700 text-xs">Name</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700 text-xs">Category</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700 text-xs min-w-[120px]">Mobile No.</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700 text-xs">City</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700 text-xs">Date of Arrival</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700 text-xs">Mode of Arrival</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700 text-xs">Train/Flight No.</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700 text-xs">Time</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700 text-xs">Hotel Name</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700 text-xs">Room Type</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700 text-xs">Check-in</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700 text-xs">Check-out</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700 text-xs">Attending</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700 text-xs min-w-[120px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {uploadedData.map((guest: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {/* S.No */}
                          <td className="px-2 py-2 text-xs">{index + 1}</td>
                          
                          {/* Name */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={guest.name || ''}
                              onChange={(e) => updateField(index, 'name', e.target.value)}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            />
                          </td>
                          
                          {/* Category */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={guest.category || ''}
                              onChange={(e) => updateField(index, 'category', e.target.value)}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            />
                          </td>
                          
                          {/* Mobile No. */}
                          <td className="px-2 py-2 min-w-[120px]">
                            <input
                              type="text"
                              value={guest.phoneNumber || ''}
                              onChange={(e) => updateField(index, 'phoneNumber', e.target.value)}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs min-w-[100px]"
                              placeholder="10-digit number"
                            />
                          </td>
                          
                          {/* City */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={guest.city || ''}
                              onChange={(e) => updateField(index, 'city', e.target.value)}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            />
                          </td>
                          
                          {/* Date of Arrival */}
                          <td className="px-2 py-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
                              <input
                                type="date"
                                value={formatDateForInput(guest.arrivalDate)}
                                onChange={(e) => updateField(index, 'arrivalDate', e.target.value)}
                                className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                              />
                            </div>
                          </td>
                          
                          {/* Mode of Arrival */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={guest.modeOfArrival || ''}
                              onChange={(e) => updateField(index, 'modeOfArrival', e.target.value)}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            />
                          </td>
                          
                          {/* Train/Flight Number */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={guest.trainFlightNumber || ''}
                              onChange={(e) => updateField(index, 'trainFlightNumber', e.target.value)}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            />
                          </td>
                          
                          {/* Time */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={guest.time || ''}
                              onChange={(e) => updateField(index, 'time', e.target.value)}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            />
                          </td>
                          
                          {/* Hotel Name */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={guest.hotelName || ''}
                              onChange={(e) => updateField(index, 'hotelName', e.target.value)}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            />
                          </td>
                          
                          {/* Room Type */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={guest.roomType || ''}
                              onChange={(e) => updateField(index, 'roomType', e.target.value)}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            />
                          </td>
                          
                          {/* Check-in */}
                          <td className="px-2 py-2">
                            <select
                              value={guest.checkIn || 'No'}
                              onChange={(e) => updateField(index, 'checkIn', e.target.value)}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </td>
                          
                          {/* Check-out */}
                          <td className="px-2 py-2">
                            <select
                              value={guest.checkOut || 'No'}
                              onChange={(e) => updateField(index, 'checkOut', e.target.value)}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </td>
                          
                          {/* Attending */}
                          <td className="px-2 py-2">
                            <select
                              value={guest.attending || 'No'}
                              onChange={(e) => updateField(index, 'attending', e.target.value)}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </td>
                          
                          {/* Actions */}
                          <td className="px-2 py-2 min-w-[120px]">
                            <div className="flex gap-1 flex-wrap">
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
                                onClick={async () => {
                                  if (!eventId) {
                                    toast({
                                      title: "Error",
                                      description: "Event ID is missing.",
                                      variant: "destructive"
                                    });
                                    return;
                                  }

                                  // If guest has ID, navigate directly
                                  if (guest.id) {
                                    navigate(`/document-upload/${eventId}/${guest.id}`);
                                    return;
                                  }

                                  // If ID is missing, try to refetch participants to get the ID
                                  try {
                                    toast({
                                      title: "Loading...",
                                      description: "Fetching participant information...",
                                    });
                                    
                                    const participants = await fetchParticipants();
                                    
                                    if (participants && participants.length > 0) {
                                      // Find the participant by matching name and phone number
                                      const updatedGuest = participants.find((g: any) => 
                                        g.name === guest.name && 
                                        g.phoneNumber === guest.phoneNumber &&
                                        g.id
                                      );

                                      
                                      if (updatedGuest && updatedGuest.id) {
                                        navigate(`/document-upload/${eventId}/${updatedGuest.id}`);
                                      } else {
                                        toast({
                                          title: "Cannot Upload Documents",
                                          description: "Participant ID not found. Please refresh the page and try again.",
                                          variant: "destructive"
                                        });
                                      }
                                    } else {
                                      toast({
                                        title: "Cannot Upload Documents",
                                        description: "Participant not found. Please refresh the page and try again.",
                                        variant: "destructive"
                                      });
                                    }
                                  } catch (error) {
                                    toast({
                                      title: "Error",
                                      description: "Failed to fetch participant information. Please refresh the page.",
                                      variant: "destructive"
                                    });
                                  }
                                }}
                                className="bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700 flex items-center justify-center"
                                title="Upload ID Documents"
                                disabled={!eventId}
                              >
                                <FileText className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // Edit button - just visual indicator, fields are already editable
                                  toast({
                                    title: "Edit Mode",
                                    description: "You can edit the fields directly in the table. Click Save to save changes.",
                                  });
                                }}
                                title="Fields are editable - Click Save to save changes"
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
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="text-xs sm:text-sm text-gray-600 break-words">
                  <div className="flex flex-wrap gap-2">
                    <span>Total: {uploadedData.length} guests</span>
                    <span className="hidden sm:inline">|</span>
                    <span>Confirmed: {uploadedData.filter(g => g.status === 'Confirmed').length}</span>
                    <span className="hidden sm:inline">|</span>
                    <span>VIP: {uploadedData.filter(g => g.isVip).length}</span>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadedData([])}
                    className="flex-1 sm:flex-none"
                  >
                    Clear All
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Data Saved",
                        description: `Updated ${uploadedData.length} guest records`,
                      });
                    }}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex-1 sm:flex-none"
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
              {/* <div className="p-3 border rounded-lg bg-green-50">
                <div className="text-sm text-green-700">
                  ✓ Reminders sent to 45 guests<br/>
                  ✓ 38 confirmations received<br/>
                  ⏳ 7 pending responses
                </div>
              </div> */}
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
              {/* <div className="p-3 border rounded-lg bg-purple-50">
                <div className="text-sm text-purple-700">
                  ✓ 25 gifts delivered to rooms<br/>
                  ✓ 12 VIP preferences set<br/>
                  ⏳ 10 gifts remaining
                </div>
              </div> */}
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
              {/* <Button variant="outline">Bride's Side Schedule</Button>
              <Button variant="outline">Groom's Side Schedule</Button> */}
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
              {/* <div className="p-3 border rounded-lg bg-green-50">
                <div className="text-sm text-green-700">
                  ✓ 45 personalized messages sent<br/>
                  ⏳ 5 custom messages pending
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>


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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
      {/* Event Phase Navigation */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex-1">
              {/* <h1 className="text-xl sm:text-2xl font-bold">Event Management Dashboard</h1> */}
              <p className="text-blue-100 text-sm sm:text-base mt-1">Complete Event Management Workflow</p>
              {eventDetails && (
                <p className="text-blue-200 text-xs sm:text-sm mt-2 break-words">
                  Managing: {eventDetails.eventName} at {eventDetails.venue}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate(`/event-participants/${eventId}`)}
                className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
              >
                <Users className="h-4 w-4 mr-2" />
                View Participants
              </Button>
              <Badge variant="secondary" className="bg-white text-blue-600 text-center py-1.5 sm:py-1">
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
        <TabsList className={`grid mb-6 overflow-x-auto ${
          activePhase === "before-event" ? "grid-cols-3" : "grid-cols-2"
        } w-full`}>
          {activePhase === "before-event" ? (
            <>
              <TabsTrigger value="data-collection" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Collect Data</span>
              </TabsTrigger>
              {/* <TabsTrigger value="invites" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Broadcast Invites</span>
              </TabsTrigger> */}
              <TabsTrigger value="hotel" className="flex items-center gap-2">
                <Hotel className="h-4 w-4" />
                <span className="hidden sm:inline">Hotel Management</span>
              </TabsTrigger>
              <TabsTrigger value="logistics" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span className="hidden sm:inline">Logistics</span>
              </TabsTrigger>
              {/* <TabsTrigger value="pre-event" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Pre-Event</span>
              </TabsTrigger> */}
            </>
          ) : (
            <>
              {/* <TabsTrigger value="communication" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Communication</span>
              </TabsTrigger> */}
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