/**
 * Help Desk API Test Example
 * 
 * This file demonstrates how to use the help desk API endpoints
 * with the actual API: https://miosync-main-server-production.up.railway.app/api/v2/help-desk/
 */

import { 
  createHelpDeskTicket, 
  getHelpDeskTickets, 
  getHelpDeskTicketById,
  updateTicketStatus, 
  deleteHelpDeskTicket,
  getHelpDeskStats,
  CreateTicketRequest,
  HelpDeskTicket
} from '@/lib/helpDeskApi';

// Example event ID (replace with actual event ID)
const EVENT_ID = '3f596c2e-4c27-4494-a453-2c21072a5093';

/**
 * Example: Create a new help desk ticket
 */
export const createTicketExample = async () => {
  const ticketData: CreateTicketRequest = {
    name: 'John Doe',
    roomNumber: 'A-101',
    phoneNumber: '+1234567890',
    request: 'Need extra towels and room service menu',
    priority: 'medium',
    eventId: EVENT_ID
  };

  try {
    const ticket = await createHelpDeskTicket(ticketData);
    console.log('Created ticket:', ticket);
    return ticket;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

/**
 * Example: Get all tickets for an event
 */
export const getTicketsExample = async () => {
  try {
    const tickets = await getHelpDeskTickets(EVENT_ID);
    console.log('Fetched tickets:', tickets);
    return tickets;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

/**
 * Example: Get a specific ticket by ID
 */
export const getTicketByIdExample = async (ticketId: string) => {
  try {
    const ticket = await getHelpDeskTicketById(EVENT_ID, ticketId);
    console.log('Fetched ticket by ID:', ticket);
    return ticket;
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
    throw error;
  }
};

/**
 * Example: Update ticket status
 */
export const updateTicketExample = async (ticketId: string) => {
  try {
    const updatedTicket = await updateTicketStatus(EVENT_ID, ticketId, 'inProgress');
    console.log('Updated ticket:', updatedTicket);
    return updatedTicket;
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

/**
 * Example: Delete a ticket
 */
export const deleteTicketExample = async (ticketId: string) => {
  try {
    await deleteHelpDeskTicket(EVENT_ID, ticketId);
    console.log('Ticket deleted successfully');
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
};

/**
 * Example: Get help desk statistics
 */
export const getStatsExample = async () => {
  try {
    const stats = await getHelpDeskStats(EVENT_ID);
    console.log('Help desk stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error getting stats:', error);
    throw error;
  }
};

/**
 * Complete workflow example
 */
export const completeWorkflowExample = async () => {
  try {
    console.log('=== Help Desk API Test Workflow ===');
    
    // 1. Create a ticket
    console.log('1. Creating a new ticket...');
    const newTicket = await createTicketExample();
    
    // 2. Get all tickets
    console.log('2. Fetching all tickets...');
    const allTickets = await getTicketsExample();
    
    // 3. Update ticket status
    console.log('3. Updating ticket status...');
    const updatedTicket = await updateTicketExample(newTicket.id);
    
    // 4. Get statistics
    console.log('4. Getting help desk statistics...');
    const stats = await getStatsExample();
    
    // 5. Delete the ticket (cleanup)
    console.log('5. Cleaning up - deleting ticket...');
    await deleteTicketExample(newTicket.id);
    
    console.log('=== Workflow completed successfully ===');
    
    return {
      createdTicket: newTicket,
      allTickets,
      updatedTicket,
      stats
    };
    
  } catch (error) {
    console.error('Workflow failed:', error);
    throw error;
  }
};

// API Response Structure Example (based on actual API response)
export const apiResponseExample = {
  status: "success",
  statusCode: 200,
  message: "Operation successful",
  data: [
    {
      id: "43b6ec67-0dbb-4406-a123-4bcec563b2c1",
      name: "Sarah Smith",
      roomNumber: "B-101",
      phoneNumber: "+1987654321",
      request: "Water leak in bathroom - water is dripping from the ceiling and pooling on the floor. This needs immediate attention to prevent water damage.",
      priority: "urgent",
      status: "open",
      isActive: true,
      createdAt: "2025-10-12T07:50:46.072Z",
      updatedAt: "2025-10-12T07:50:46.072Z",
      eventID: null,
      eventId: "3f596c2e-4c27-4494-a453-2c21072a5093"
    }
  ],
  timestamp: "2025-10-22T17:39:03.748Z",
  path: "/api/v2/help-desk/3f596c2e-4c27-4494-a453-2c21072a5093"
};

// Correct API Endpoints:
// POST /api/v2/help-desk/{eventId} - Create ticket
// GET  /api/v2/help-desk/{eventId} - Get tickets for event
// GET  /api/v2/help-desk/{eventId}/{ticketId} - Get specific ticket
// PATCH /api/v2/help-desk/{eventId}/{ticketId} - Update ticket
// DELETE /api/v2/help-desk/{eventId}/{ticketId} - Delete ticket

export default {
  createTicketExample,
  getTicketsExample,
  getTicketByIdExample,
  updateTicketExample,
  deleteTicketExample,
  getStatsExample,
  completeWorkflowExample,
  apiResponseExample
};
