import axios from 'axios';
import { API_CONFIG, getApiUrl, getAuthHeaders, ApiResponse } from './config';

// Help Desk Ticket Interface based on API response
export interface HelpDeskTicket {
  id: string;
  name: string;
  roomNumber: string;
  phoneNumber: string;
  request: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'inProgress' | 'resolved' | 'closed';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  eventID?: string | null;
  eventId: string;
}

// Create Ticket Request Interface
export interface CreateTicketRequest {
  name: string;
  roomNumber: string;
  phoneNumber: string;
  request: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  eventId: string;
}

// API Response Interface
interface HelpDeskApiResponse<T> extends ApiResponse<T> {}

// Get Authorization Header
const getHelpDeskAuthHeaders = () => getAuthHeaders();

/**
 * Create a new help desk ticket
 * @param ticketData - The ticket data to create
 * @returns Promise<HelpDeskTicket>
 */
export const createHelpDeskTicket = async (ticketData: CreateTicketRequest): Promise<HelpDeskTicket> => {
  try {
    const response = await axios.post<HelpDeskApiResponse<HelpDeskTicket>>(
      getApiUrl(API_CONFIG.ENDPOINTS.HELP_DESK.CREATE(ticketData.eventId)),
      ticketData,
      {
        headers: getHelpDeskAuthHeaders()
      }
    );

    if (response.data.status === 'success') {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to create ticket');
    }
  } catch (error: any) {
    console.error('Error creating help desk ticket:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to create help desk ticket'
    );
  }
};

/**
 * Get a specific help desk ticket by ID
 * @param eventId - The event ID
 * @param ticketId - The ticket ID to fetch
 * @returns Promise<HelpDeskTicket>
 */
export const getHelpDeskTicketById = async (eventId: string, ticketId: string): Promise<HelpDeskTicket> => {
  try {
    const response = await axios.get<HelpDeskApiResponse<HelpDeskTicket>>(
      getApiUrl(API_CONFIG.ENDPOINTS.HELP_DESK.GET_BY_ID(eventId, ticketId)),
      {
        headers: getHelpDeskAuthHeaders()
      }
    );

    if (response.data.status === 'success') {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch ticket');
    }
  } catch (error: any) {
    console.error('Error fetching help desk ticket:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch help desk ticket'
    );
  }
};

/**
 * Get all help desk tickets for a specific event
 * @param eventId - The event ID to fetch tickets for
 * @returns Promise<HelpDeskTicket[]>
 */
export const getHelpDeskTickets = async (eventId: string): Promise<HelpDeskTicket[]> => {
  try {
    const response = await axios.get<HelpDeskApiResponse<HelpDeskTicket[]>>(
      getApiUrl(API_CONFIG.ENDPOINTS.HELP_DESK.GET_BY_EVENT(eventId)),
      {
        headers: getHelpDeskAuthHeaders()
      }
    );

    if (response.data.status === 'success') {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch tickets');
    }
  } catch (error: any) {
    console.error('Error fetching help desk tickets:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch help desk tickets'
    );
  }
};

/**
 * Update a help desk ticket status
 * @param ticketId - The ticket ID to update
 * @param status - The new status
 * @returns Promise<HelpDeskTicket>
 */
export const updateTicketStatus = async (
  eventId: string,
  ticketId: string, 
  status: 'open' | 'inProgress' | 'resolved' | 'closed'
): Promise<HelpDeskTicket> => {
  try {
    const response = await axios.patch<HelpDeskApiResponse<HelpDeskTicket>>(
      getApiUrl(API_CONFIG.ENDPOINTS.HELP_DESK.UPDATE(eventId, ticketId)),
      { status },
      {
        headers: getHelpDeskAuthHeaders()
      }
    );

    if (response.data.status === 'success') {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to update ticket');
    }
  } catch (error: any) {
    console.error('Error updating ticket status:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to update ticket status'
    );
  }
};

/**
 * Delete a help desk ticket
 * @param ticketId - The ticket ID to delete
 * @returns Promise<void>
 */
export const deleteHelpDeskTicket = async (eventId: string, ticketId: string): Promise<void> => {
  try {
    const response = await axios.delete<HelpDeskApiResponse<void>>(
      getApiUrl(API_CONFIG.ENDPOINTS.HELP_DESK.DELETE(eventId, ticketId)),
      {
        headers: getHelpDeskAuthHeaders()
      }
    );

    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to delete ticket');
    }
  } catch (error: any) {
    console.error('Error deleting help desk ticket:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to delete help desk ticket'
    );
  }
};

/**
 * Get help desk ticket statistics for an event
 * @param eventId - The event ID
 * @returns Promise<{total: number, open: number, inProgress: number, resolved: number}>
 */
export const getHelpDeskStats = async (eventId: string): Promise<{
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  urgent: number;
}> => {
  try {
    const tickets = await getHelpDeskTickets(eventId);
    
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'inProgress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      urgent: tickets.filter(t => t.priority === 'urgent').length
    };
  } catch (error) {
    console.error('Error getting help desk stats:', error);
    return {
      total: 0,
      open: 0,
      inProgress: 0,
      resolved: 0,
      urgent: 0
    };
  }
};

// Priority mapping for display
export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium', 
  high: 'High',
  urgent: 'Urgent'
} as const;

// Status mapping for display
export const STATUS_LABELS = {
  open: 'Open',
  inProgress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed'
} as const;

// Priority colors for UI
export const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  urgent: 'bg-red-100 text-red-800 border-red-200'
} as const;

// Status colors for UI
export const STATUS_COLORS = {
  open: 'bg-red-100 text-red-800 border-red-200',
  inProgress: 'bg-blue-100 text-blue-800 border-blue-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-gray-100 text-gray-800 border-gray-200'
} as const;
