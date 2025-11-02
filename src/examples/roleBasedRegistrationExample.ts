/**
 * Role-Based Registration API Usage Examples
 * 
 * This file demonstrates how to use the role-based registration system
 * with the different user roles: superadmin, logistics_manager, helpdesk_manager, rsvp_manager
 */

import { useState } from 'react';
import axios from 'axios';

// Role types
export type UserRole = 'superadmin' | 'logistics_manager' | 'helpdesk_manager' | 'rsvp_manager';

// Registration request interface
export interface RegistrationRequest {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  userType: UserRole; 
}

// API Response interface
interface ApiResponse {
  status: 'success' | 'error';
  message: string;
  data?: any;
}

// Role descriptions and permissions
export const ROLE_DESCRIPTIONS = {
  superadmin: {
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
  logistics_manager: {
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
  helpdesk_manager: {
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
  rsvp_manager: {
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
};

// Base API URL
const BASE_URL = 'https://miosync-main-server-production.up.railway.app/api/v2';

/**
 * Register a new user with role
 * @param registrationData - User registration data including role
 * @returns Promise<ApiResponse>
 */
export const registerUserWithRole = async (registrationData: RegistrationRequest): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, registrationData);
    
    if (response.data.status === 'success') {
      return {
        status: 'success',
        message: `User registered successfully as ${ROLE_DESCRIPTIONS[registrationData.userType].title}`,
        data: response.data.data
      };
    } else {
      throw new Error(response.data.message || 'Registration failed');
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      status: 'error',
      message: error.response?.data?.message || error.message || 'Registration failed'
    };
  }
};

/**
 * Login user (role is determined by server based on user account)
 * @param email - User email
 * @param password - User password
 * @returns Promise<ApiResponse>
 */
export const loginUser = async (email: string, password: string): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password
    });
    
    if (response.data.status === 'success') {
      return {
        status: 'success',
        message: 'Login successful',
        data: response.data.data
      };
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      status: 'error',
      message: error.response?.data?.message || error.message || 'Login failed'
    };
  }
};

// Example 1: Register different types of users
export const registrationExamples = async () => {
  console.log('=== Role-Based Registration Examples ===');

  // Example 1: Register Super Admin
  const superAdminData: RegistrationRequest = {
    email: 'admin@melioramoments.com',
    password: 'SecurePassword123!',
    confirmPassword: 'SecurePassword123!',
    phoneNumber: '+1234567890',
    firstName: 'John',
    lastName: 'Admin',
    userType: 'superadmin'
  };

  try {
    const superAdminResult = await registerUserWithRole(superAdminData);
    console.log('Super Admin Registration:', superAdminResult);
  } catch (error) {
    console.error('Super Admin registration failed:', error);
  }

  // Example 2: Register Logistics Manager
  const logisticsManagerData: RegistrationRequest = {
    email: 'logistics@melioramoments.com',
    password: 'LogisticsPass123!',
    confirmPassword: 'LogisticsPass123!',
    phoneNumber: '+1234567891',
    firstName: 'Sarah',
    lastName: 'Logistics',
    userType: 'logistics_manager'
  };

  try {
    const logisticsResult = await registerUserWithRole(logisticsManagerData);
    console.log('Logistics Manager Registration:', logisticsResult);
  } catch (error) {
    console.error('Logistics Manager registration failed:', error);
  }

  // Example 3: Register Help Desk Manager
  const helpDeskManagerData: RegistrationRequest = {
    email: 'helpdesk@melioramoments.com',
    password: 'HelpDeskPass123!',
    confirmPassword: 'HelpDeskPass123!',
    phoneNumber: '+1234567892',
    firstName: 'Mike',
    lastName: 'Support',
    userType: 'helpdesk_manager'
  };

  try {
    const helpDeskResult = await registerUserWithRole(helpDeskManagerData);
    console.log('Help Desk Manager Registration:', helpDeskResult);
  } catch (error) {
    console.error('Help Desk Manager registration failed:', error);
  }

  // Example 4: Register RSVP Manager
  const rsvpManagerData: RegistrationRequest = {
    email: 'rsvp@melioramoments.com',
    password: 'RSVPPass123!',
    confirmPassword: 'RSVPPass123!',
    phoneNumber: '+1234567893',
    firstName: 'Emma',
    lastName: 'RSVP',
    userType: 'rsvp_manager'
  };

  try {
    const rsvpResult = await registerUserWithRole(rsvpManagerData);
    console.log('RSVP Manager Registration:', rsvpResult);
  } catch (error) {
    console.error('RSVP Manager registration failed:', error);
  }
};

// Example 2: Role-based dashboard routing
export const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case 'superadmin':
      return '/admin/dashboard'; // Full admin dashboard
    case 'logistics_manager':
      return '/logistics/dashboard'; // Logistics management dashboard
    case 'helpdesk_manager':
      return '/helpdesk/dashboard'; // Help desk management dashboard
    case 'rsvp_manager':
      return '/rsvp/dashboard'; // RSVP management dashboard
    default:
      return '/dashboard'; // Default dashboard
  }
};

// Example 3: Role-based permissions check
export const hasPermission = (userRole: UserRole, requiredPermission: string): boolean => {
  const rolePermissions = ROLE_DESCRIPTIONS[userRole].permissions;
  
  // Super admin has all permissions
  if (userRole === 'superadmin') {
    return true;
  }
  
  // Check if user's role has the required permission
  return rolePermissions.includes(requiredPermission);
};

// Example 4: Role-based UI components
export const getRoleBasedComponents = (role: UserRole) => {
  const components = {
    superadmin: [
      'EventManagementDashboard',
      'UserManagementPanel',
      'SystemSettingsPanel',
      'AnalyticsDashboard',
      'RoleManagementPanel'
    ],
    logistics_manager: [
      'TransportationSchedule',
      'VehicleAssignment',
      'RoomAllocation',
      'GuestArrivalTracker',
      'HotelCoordination'
    ],
    helpdesk_manager: [
      'TicketManagement',
      'GuestSupportPanel',
      'StaffManagement',
      'ResolutionTracker',
      'SupportReports'
    ],
    rsvp_manager: [
      'InvitationManager',
      'RSVPTracker',
      'GuestListManager',
      'ReminderSystem',
      'AttendanceReports'
    ]
  };

  return components[role] || [];
};

// Example 5: React component integration
export const useRoleBasedAuth = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = async (registrationData: RegistrationRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await registerUserWithRole(registrationData);
      
      if (result.status === 'success') {
        setUserRole(registrationData.userType);
        return result;
      } else {
        setError(result.message);
        throw new Error(result.message);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await loginUser(email, password);
      
      if (result.status === 'success') {
        // Extract userType from response data
        const userType = result.data?.userType || 'superadmin';
        setUserRole(userType);
        return result;
      } else {
        setError(result.message);
        throw new Error(result.message);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUserRole(null);
    setError(null);
  };

  return {
    userRole,
    isLoading,
    error,
    registerUser,
    loginUser,
    logout,
    hasPermission: (permission: string) => userRole ? hasPermission(userRole, permission) : false,
    dashboardRoute: userRole ? getDashboardRoute(userRole) : '/login',
    availableComponents: userRole ? getRoleBasedComponents(userRole) : []
  };
};

// Example 6: Form validation for role selection
export const validateRoleSelection = (role: UserRole | null): string | null => {
  if (!role) {
    return 'Please select a role';
  }
  
  const validRoles: UserRole[] = ['superadmin', 'logistics_manager', 'helpdesk_manager', 'rsvp_manager'];
  
  if (!validRoles.includes(role)) {
    return 'Please select a valid role';
  }
  
  return null;
};

// Example 7: Role-based navigation
export const getNavigationItems = (role: UserRole) => {
  const navigationItems = {
    superadmin: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: 'Home' },
      { label: 'Events', path: '/admin/events', icon: 'Calendar' },
      { label: 'Users', path: '/admin/users', icon: 'Users' },
      { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
      { label: 'Analytics', path: '/admin/analytics', icon: 'BarChart' }
    ],
    logistics_manager: [
      { label: 'Dashboard', path: '/logistics/dashboard', icon: 'Home' },
      { label: 'Transportation', path: '/logistics/transport', icon: 'Truck' },
      { label: 'Room Allocation', path: '/logistics/rooms', icon: 'Home' },
      { label: 'Guest Tracking', path: '/logistics/guests', icon: 'Users' },
      { label: 'Reports', path: '/logistics/reports', icon: 'FileText' }
    ],
    helpdesk_manager: [
      { label: 'Dashboard', path: '/helpdesk/dashboard', icon: 'Home' },
      { label: 'Tickets', path: '/helpdesk/tickets', icon: 'Ticket' },
      { label: 'Staff', path: '/helpdesk/staff', icon: 'Users' },
      { label: 'Reports', path: '/helpdesk/reports', icon: 'BarChart' },
      { label: 'Settings', path: '/helpdesk/settings', icon: 'Settings' }
    ],
    rsvp_manager: [
      { label: 'Dashboard', path: '/rsvp/dashboard', icon: 'Home' },
      { label: 'Invitations', path: '/rsvp/invitations', icon: 'Mail' },
      { label: 'Responses', path: '/rsvp/responses', icon: 'CheckCircle' },
      { label: 'Guest Lists', path: '/rsvp/guests', icon: 'Users' },
      { label: 'Reports', path: '/rsvp/reports', icon: 'FileText' }
    ]
  };

  return navigationItems[role] || [];
};

// Example 8: Role-based API access
export const canAccessAPI = (userRole: UserRole, apiEndpoint: string): boolean => {
  const roleAPIAccess = {
    superadmin: ['*'], // Access to all APIs
    logistics_manager: [
      '/api/v2/events',
      '/api/v2/transportation',
      '/api/v2/rooms',
      '/api/v2/guests'
    ],
    helpdesk_manager: [
      '/api/v2/help-desk',
      '/api/v2/tickets',
      '/api/v2/guests'
    ],
    rsvp_manager: [
      '/api/v2/rsvp',
      '/api/v2/invitations',
      '/api/v2/guests'
    ]
  };

  const allowedEndpoints = roleAPIAccess[userRole];
  
  // Super admin has access to everything
  if (allowedEndpoints.includes('*')) {
    return true;
  }
  
  // Check if the endpoint is allowed for this role
  return allowedEndpoints.some(endpoint => apiEndpoint.startsWith(endpoint));
};
