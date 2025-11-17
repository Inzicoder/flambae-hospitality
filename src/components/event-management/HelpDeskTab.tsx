import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ticket, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  User,
  Phone,
  Home,
  MessageSquare,
  Filter,
  Search,
  Loader2
} from 'lucide-react';
import { HelpDeskForm } from './HelpDeskForm';
import { 
  getHelpDeskTickets, 
  updateTicketStatus, 
  HelpDeskTicket, 
  PRIORITY_COLORS, 
  STATUS_COLORS,
  PRIORITY_LABELS,
  STATUS_LABELS
} from '@/lib/helpDeskApi';
import { useToast } from '@/hooks/use-toast';

export const HelpDeskTab = ({ eventId }: { eventId: string }) => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<HelpDeskTicket[]>([]);
  const [activeTab, setActiveTab] = useState('submit');
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, [eventId]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const fetchedTickets = await getHelpDeskTickets(eventId);
      setTickets(fetchedTickets);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch tickets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTicketSubmit = (ticket: HelpDeskTicket) => {
    setTickets(prev => [ticket, ...prev]);
    console.log(tickets,'tickets')
    setActiveTab('tickets'); // Switch to tickets view after submission
  };

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

  const handleStatusUpdate = async (ticketId: string, newStatus: 'open' | 'inProgress' | 'resolved' | 'closed') => {
    try {
      const updatedTicket = await updateTicketStatus(eventId, ticketId, newStatus);
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? updatedTicket : ticket
      ));
      toast({
        title: "Status Updated",
        description: `Ticket status updated to ${STATUS_LABELS[newStatus]}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update ticket status",
        variant: "destructive"
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Clock className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Filter tickets based on priority
  const filteredTickets = filterPriority === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.priority === filterPriority);

    console.log({filteredTickets})



  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'inProgress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Ticket className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{tickets.length}</div>
            <div className="text-sm text-muted-foreground">Total Tickets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{openTickets}</div>
            <div className="text-sm text-muted-foreground">Open</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{inProgressTickets}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{resolvedTickets}</div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </CardContent>
        </Card>
      </div>

      {/* Help Desk Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submit" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Submit Ticket
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            View Tickets ({tickets.length})
          </TabsTrigger>
        </TabsList>

        {/* Submit Ticket Tab */}
        <TabsContent value="submit" className="space-y-4">
          <HelpDeskForm eventId={eventId} onSubmit={handleTicketSubmit} />
        </TabsContent>

        {/* View Tickets Tab */}
        <TabsContent value="tickets" className="space-y-4">
          {loading ? (
            <Card className="text-center py-12">
              <CardContent>
                <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading Tickets...</h3>
                <p className="text-gray-500">Fetching help desk tickets for this event</p>
              </CardContent>
            </Card>
          ) : tickets.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Tickets Yet</h3>
                <p className="text-gray-500 mb-4">No support tickets have been submitted for this event</p>
                <Button 
                  onClick={() => setActiveTab('submit')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit First Ticket
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Filter Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filter Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={filterPriority === 'all' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setFilterPriority('all')}
                    >
                      All ({tickets.length})
                    </Button>
                    <Button 
                      variant={filterPriority === 'urgent' ? 'default' : 'outline'} 
                      size="sm" 
                      className={filterPriority === 'urgent' ? '' : 'bg-red-50 text-red-700 border-red-200'}
                      onClick={() => setFilterPriority('urgent')}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Urgent ({tickets.filter(t => t.priority === 'urgent').length})
                    </Button>
                    <Button 
                      variant={filterPriority === 'high' ? 'default' : 'outline'} 
                      size="sm" 
                      className={filterPriority === 'high' ? '' : 'bg-red-50 text-red-700 border-red-200'}
                      onClick={() => setFilterPriority('high')}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      High Priority ({tickets.filter(t => t.priority === 'high').length})
                    </Button>
                    <Button 
                      variant={filterPriority === 'medium' ? 'default' : 'outline'} 
                      size="sm" 
                      className={filterPriority === 'medium' ? '' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}
                      onClick={() => setFilterPriority('medium')}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Medium Priority ({tickets.filter(t => t.priority === 'medium').length})
                    </Button>
                    <Button 
                      variant={filterPriority === 'low' ? 'default' : 'outline'} 
                      size="sm" 
                      className={filterPriority === 'low' ? '' : 'bg-green-50 text-green-700 border-green-200'}
                      onClick={() => setFilterPriority('low')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Low Priority ({tickets.filter(t => t.priority === 'low').length})
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tickets List */}
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Ticket Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold">Ticket #{ticket.id}</h3>
                            <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                              {getPriorityIcon(ticket.priority)}
                              <span className="ml-1">{PRIORITY_LABELS[ticket.priority]}</span>
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(ticket.status)}>
                              {STATUS_LABELS[ticket.status]}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{ticket.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Home className="h-4 w-4 text-gray-500" />
                              <span>Room {ticket.roomNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span>{ticket.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>{formatDate(ticket.createdAt)}</span>
                            </div>
                          </div>

                          {/* Request Description */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-gray-700">Request Description:</span>
                            </div>
                            <p className="text-gray-600">{ticket.request}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          {ticket.status === 'open' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusUpdate(ticket.id, 'inProgress')}
                            >
                              Mark In Progress
                            </Button>
                          )}
                          {ticket.status === 'inProgress' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusUpdate(ticket.id, 'resolved')}
                            >
                              Mark Resolved
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePhoneCall(ticket.phoneNumber, ticket.name)}
                            className="flex items-center gap-2"
                          >
                            <Phone className="h-4 w-4" />
                            Contact Guest
                          </Button>
                          <Button variant="outline" size="sm">
                            Add Notes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

