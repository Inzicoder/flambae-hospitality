/**
 * Help Desk API Usage Examples
 * 
 * This file demonstrates how to use the help desk API functions
 * for creating, fetching, and managing help desk tickets.
 */

import { 
  createHelpDeskTicket, 
  getHelpDeskTickets, 
  updateTicketStatus, 
  deleteHelpDeskTicket,
  getHelpDeskStats,
  CreateTicketRequest,
  HelpDeskTicket
} from '@/lib/helpDeskApi';

// Example 1: Creating a new help desk ticket
export const createTicketExample = async () => {
  try {
    const ticketData: CreateTicketRequest = {
      name: 'John Smith',
      roomNumber: 'B-101',
      phoneNumber: '+1987654321',
      request: 'Water leak in bathroom - water is dripping from the ceiling and pooling on the floor. This needs immediate attention to prevent water damage.',
      priority: 'urgent',
      eventId: '3f596c2e-4c27-4494-a453-2c21072a5093'
    };

    const newTicket = await createHelpDeskTicket(ticketData);
    console.log('Ticket created successfully:', newTicket);
    
    return newTicket;
  } catch (error) {
    console.error('Failed to create ticket:', error);
    throw error;
  }
};

// Example 2: Fetching all tickets for an event
export const fetchTicketsExample = async (eventId: string) => {
  try {
    const tickets = await getHelpDeskTickets(eventId);
    console.log(`Found ${tickets.length} tickets for event ${eventId}:`, tickets);
    
    return tickets;
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    throw error;
  }
};

// Example 3: Updating ticket status
export const updateTicketStatusExample = async (ticketId: string) => {
  try {
    // Mark ticket as in progress
    const updatedTicket = await updateTicketStatus(ticketId, 'inProgress');
    console.log('Ticket status updated:', updatedTicket);
    
    // Later, mark as resolved
    const resolvedTicket = await updateTicketStatus(ticketId, 'resolved');
    console.log('Ticket resolved:', resolvedTicket);
    
    return resolvedTicket;
  } catch (error) {
    console.error('Failed to update ticket status:', error);
    throw error;
  }
};

// Example 4: Getting help desk statistics
export const getStatsExample = async (eventId: string) => {
  try {
    const stats = await getHelpDeskStats(eventId);
    console.log('Help desk statistics:', stats);
    
    // Example output:
    // {
    //   total: 4,
    //   open: 3,
    //   inProgress: 1,
    //   resolved: 0,
    //   urgent: 4
    // }
    
    return stats;
  } catch (error) {
    console.error('Failed to get stats:', error);
    throw error;
  }
};

// Example 5: Complete workflow - Create, Update, and Track tickets
export const completeWorkflowExample = async (eventId: string) => {
  try {
    console.log('=== Help Desk Workflow Example ===');
    
    // Step 1: Create a new ticket
    console.log('1. Creating new ticket...');
    const newTicket = await createTicketExample();
    
    // Step 2: Fetch all tickets to see the new one
    console.log('2. Fetching all tickets...');
    const allTickets = await fetchTicketsExample(eventId);
    
    // Step 3: Update the ticket status
    console.log('3. Updating ticket status...');
    const updatedTicket = await updateTicketStatus(newTicket.id, 'inProgress');
    
    // Step 4: Get statistics
    console.log('4. Getting statistics...');
    const stats = await getStatsExample(eventId);
    
    // Step 5: Resolve the ticket
    console.log('5. Resolving ticket...');
    const resolvedTicket = await updateTicketStatus(newTicket.id, 'resolved');
    
    console.log('=== Workflow Complete ===');
    return {
      createdTicket: newTicket,
      allTickets,
      updatedTicket,
      stats,
      resolvedTicket
    };
    
  } catch (error) {
    console.error('Workflow failed:', error);
    throw error;
  }
};

// Example 6: React component integration
export const ReactComponentExample = () => {
  // This would be used in a React component
  const [tickets, setTickets] = useState<HelpDeskTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTicket = async (ticketData: CreateTicketRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const newTicket = await createHelpDeskTicket(ticketData);
      setTickets(prev => [newTicket, ...prev]);
      
      return newTicket;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTickets = async (eventId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedTickets = await getHelpDeskTickets(eventId);
      setTickets(fetchedTickets);
      
      return fetchedTickets;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: 'open' | 'inProgress' | 'resolved' | 'closed') => {
    try {
      setError(null);
      
      const updatedTicket = await updateTicketStatus(ticketId, status);
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? updatedTicket : ticket
      ));
      
      return updatedTicket;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    tickets,
    loading,
    error,
    handleCreateTicket,
    handleFetchTickets,
    handleUpdateStatus
  };
};

// Example 7: Error handling patterns
export const errorHandlingExample = async () => {
  try {
    // Attempt to create a ticket with invalid data
    const invalidTicketData = {
      name: '', // Empty name should cause validation error
      roomNumber: 'B-101',
      phoneNumber: '+1987654321',
      request: 'Test request',
      priority: 'medium' as const,
      eventId: 'invalid-event-id'
    };

    await createHelpDeskTicket(invalidTicketData);
  } catch (error: any) {
    // Handle different types of errors
    if (error.message.includes('Validation Error')) {
      console.log('Client-side validation error:', error.message);
    } else if (error.message.includes('Failed to create')) {
      console.log('Server-side error:', error.message);
    } else if (error.message.includes('Network')) {
      console.log('Network error:', error.message);
    } else {
      console.log('Unknown error:', error.message);
    }
  }
};

// Example 8: Batch operations
export const batchOperationsExample = async (eventId: string) => {
  try {
    // Create multiple tickets
    const ticketPromises = [
      createHelpDeskTicket({
        name: 'Alice Johnson',
        roomNumber: 'A-201',
        phoneNumber: '+1234567890',
        request: 'Room temperature too cold',
        priority: 'medium',
        eventId
      }),
      createHelpDeskTicket({
        name: 'Bob Wilson',
        roomNumber: 'C-301',
        phoneNumber: '+1234567891',
        request: 'WiFi not working',
        priority: 'high',
        eventId
      }),
      createHelpDeskTicket({
        name: 'Carol Davis',
        roomNumber: 'D-401',
        phoneNumber: '+1234567892',
        request: 'Extra towels needed',
        priority: 'low',
        eventId
      })
    ];

    const newTickets = await Promise.all(ticketPromises);
    console.log('Created multiple tickets:', newTickets);

    // Update all tickets to in progress
    const updatePromises = newTickets.map(ticket => 
      updateTicketStatus(ticket.id, 'inProgress')
    );

    const updatedTickets = await Promise.all(updatePromises);
    console.log('Updated all tickets:', updatedTickets);

    return { newTickets, updatedTickets };
  } catch (error) {
    console.error('Batch operations failed:', error);
    throw error;
  }
};

// Example 9: Real-time ticket monitoring
export const realTimeMonitoringExample = async (eventId: string) => {
  const pollInterval = 30000; // 30 seconds
  
  const startMonitoring = () => {
    const interval = setInterval(async () => {
      try {
        const tickets = await getHelpDeskTickets(eventId);
        const stats = await getHelpDeskStats(eventId);
        
        console.log('Current ticket status:', {
          timestamp: new Date().toISOString(),
          totalTickets: tickets.length,
          openTickets: stats.open,
          urgentTickets: stats.urgent,
          recentTickets: tickets
            .filter(t => new Date(t.createdAt) > new Date(Date.now() - 5 * 60 * 1000)) // Last 5 minutes
            .length
        });
        
        // Alert if there are urgent tickets
        if (stats.urgent > 0) {
          console.warn(`🚨 ${stats.urgent} urgent tickets require immediate attention!`);
        }
        
      } catch (error) {
        console.error('Monitoring error:', error);
      }
    }, pollInterval);
    
    return () => clearInterval(interval);
  };
  
  return startMonitoring;
};

// Example 10: Integration with React Query (if using @tanstack/react-query)
export const reactQueryIntegrationExample = () => {
  // This would be used with React Query hooks
  const useHelpDeskTickets = (eventId: string) => {
    return useQuery({
      queryKey: ['helpDeskTickets', eventId],
      queryFn: () => getHelpDeskTickets(eventId),
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 10000, // Consider data stale after 10 seconds
    });
  };

  const useCreateTicket = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: createHelpDeskTicket,
      onSuccess: (newTicket) => {
        // Invalidate and refetch tickets
        queryClient.invalidateQueries({ queryKey: ['helpDeskTickets', newTicket.eventId] });
      },
    });
  };

  const useUpdateTicketStatus = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: ({ ticketId, status }: { ticketId: string; status: 'open' | 'inProgress' | 'resolved' | 'closed' }) =>
        updateTicketStatus(ticketId, status),
      onSuccess: (updatedTicket) => {
        // Update the cache directly
        queryClient.setQueryData(['helpDeskTickets', updatedTicket.eventId], (oldTickets: HelpDeskTicket[]) =>
          oldTickets?.map(ticket => 
            ticket.id === updatedTicket.id ? updatedTicket : ticket
          )
        );
      },
    });
  };

  return {
    useHelpDeskTickets,
    useCreateTicket,
    useUpdateTicketStatus
  };
};
