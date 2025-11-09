/**
 * Application Configuration
 * 
 * This file contains all the configuration constants used throughout the application
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://miosync-main-server-production.up.railway.app/api/v2',
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh'
    },
    // Event management endpoints
    EVENTS: {
      LIST: '/events',
      CREATE: '/events',
      GET_BY_ID: (id: string) => `/events/${id}`,
      UPDATE: (id: string) => `/events/${id}`,
      DELETE: (id: string) => `/events/${id}`
    },
    // Event participants endpoints
    PARTICIPANTS: {
      LIST: (eventId: string) => `/event-participants/${eventId}`,
      CREATE: (eventId: string) => `/event-participants/${eventId}`,
      GET_BY_EVENT: (eventId: string) => `/event-participants?eventId=${eventId}`,
      UPDATE: (id: string) => `/event-participants/${id}`,
      DELETE: (id: string) => `/event-participants/${id}`,
      UPLOAD_DOCUMENT: (eventId: string, participantId: string) => 
        `/event-participants/document/${eventId}/${participantId}`,
    },
    // Help desk endpoints
    HELP_DESK: {
      LIST: '/help-desk',
      CREATE: (eventId: string) => `/help-desk/${eventId}`,
      GET_BY_EVENT: (eventId: string) => `/help-desk/${eventId}`,
      GET_BY_ID: (eventId: string, ticketId: string) => `/help-desk/${eventId}/${ticketId}`,
      UPDATE: (eventId: string, ticketId: string) => `/help-desk/${eventId}/${ticketId}`,
      DELETE: (eventId: string, ticketId: string) => `/help-desk/${eventId}/${ticketId}`
    }
  }
} as const;

// User roles configuration
export const USER_ROLES = {
  SUPER_ADMIN: 'superAdmin',
  LOGISTICS: 'logistics',
  RSVP: 'rsvp',
  HELP_DESK: 'helpDesk'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Role descriptions and permissions
export const ROLE_DESCRIPTIONS = {
  [USER_ROLES.SUPER_ADMIN]: {
    title: 'Super Admin',
    description: 'Full system access',
    permissions: [
      'Manage all events',
      'Access all user accounts',
      'System configuration',
      'View all reports and analytics',
      'Manage other admin roles'
    ],
    icon: 'Shield',
    color: 'purple'
  },
  [USER_ROLES.LOGISTICS]: {
    title: 'Logistics Manager',
    description: 'Manage transportation & logistics',
    permissions: [
      'Manage transportation schedules',
      'Assign vehicles and drivers',
      'Track guest arrivals/departures',
      'Manage room allocations',
      'Coordinate with hotels'
    ],
    icon: 'Settings',
    color: 'blue'
  },
  [USER_ROLES.HELP_DESK]: {
    title: 'Help Desk Manager',
    description: 'Manage guest support tickets',
    permissions: [
      'View and respond to guest tickets',
      'Manage help desk staff',
      'Track ticket resolution times',
      'Generate support reports',
      'Escalate urgent issues'
    ],
    icon: 'Headphones',
    color: 'green'
  },
  [USER_ROLES.RSVP]: {
    title: 'RSVP Manager',
    description: 'Manage guest responses & invitations',
    permissions: [
      'Send invitations to guests',
      'Track RSVP responses',
      'Manage guest lists',
      'Send reminders',
      'Generate attendance reports'
    ],
    icon: 'UserCheck',
    color: 'orange'
  }
} as const;

// Application settings
export const APP_CONFIG = {
  NAME: 'Flambae Hospitality',
  VERSION: '1.0.0',
  DESCRIPTION: 'Your Wedding Planning Journey Begins Here',
  LOGO_URL: '/lovable-uploads/df5b7422-1f97-4754-b2f4-5822f3b683c0.png'
} as const;

// Helper functions
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userRole');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'userType': userType || ''
  };
};

export const getAuthHeadersForFormData = () => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userRole');
  return {
    'Authorization': `Bearer ${token}`,
    'userType': userType || ''
  };
};

// API response types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export interface ApiError {
  error: {
    category: string;
    code: string;
    details: string[];
    message: string;
    path: string;
    status: string;
    statusCode: number;
    timestamp: string;
  };
}
