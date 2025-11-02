/**
 * Role-Based Access Control (RBAC) Utilities
 * 
 * This file provides utilities for managing user roles and permissions
 * throughout the application.
 */

import { USER_ROLES, UserRole } from './config';

// Permission definitions for different roles
export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: {
    name: 'Super Admin',
    permissions: [
      'events:read',
      'events:write',
      'events:delete',
      'participants:read',
      'participants:write',
      'participants:delete',
      'helpdesk:read',
      'helpdesk:write',
      'helpdesk:delete',
      'users:read',
      'users:write',
      'users:delete',
      'analytics:read',
      'settings:read',
      'settings:write'
    ],
    description: 'Full system access with all permissions'
  },
  [USER_ROLES.LOGISTICS]: {
    name: 'Logistics Manager',
    permissions: [
      'events:read',
      'events:write',
      'participants:read',
      'participants:write',
      'helpdesk:read',
      'analytics:read'
    ],
    description: 'Manage transportation, logistics, and event coordination'
  },
  [USER_ROLES.HELP_DESK]: {
    name: 'Help Desk Manager',
    permissions: [
      'events:read',
      'participants:read',
      'helpdesk:read',
      'helpdesk:write',
      'helpdesk:delete'
    ],
    description: 'Manage guest support tickets and help desk operations'
  },
  [USER_ROLES.RSVP]: {
    name: 'RSVP Manager',
    permissions: [
      'events:read',
      'participants:read',
      'participants:write',
      'helpdesk:read'
    ],
    description: 'Manage guest responses, invitations, and RSVP tracking'
  }
} as const;

// Get user role from localStorage
export const getCurrentUserRole = (): UserRole | null => {
  try {
    const userRole = localStorage.getItem('userRole');
    if (userRole && Object.values(USER_ROLES).includes(userRole as UserRole)) {
      return userRole as UserRole;
    }
    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

// Set user role in localStorage
export const setCurrentUserRole = (role: UserRole): void => {
  try {
    localStorage.setItem('userRole', role);
  } catch (error) {
    console.error('Error setting user role:', error);
  }
};

// Check if user has specific permission
export const hasPermission = (permission: string, userRole?: UserRole): boolean => {
  const role = userRole || getCurrentUserRole();
  if (!role) return false;
  
  const rolePermissions = ROLE_PERMISSIONS[role];
  return rolePermissions.permissions.includes(permission as any);
};

// Check if user has any of the specified permissions
export const hasAnyPermission = (permissions: string[], userRole?: UserRole): boolean => {
  const role = userRole || getCurrentUserRole();
  if (!role) return false;
  
  const rolePermissions = ROLE_PERMISSIONS[role];
  return permissions.some(permission => rolePermissions.permissions.includes(permission as any));
};

// Check if user has all of the specified permissions
export const hasAllPermissions = (permissions: string[], userRole?: UserRole): boolean => {
  const role = userRole || getCurrentUserRole();
  if (!role) return false;

  const rolePermissions = ROLE_PERMISSIONS[role];
  return permissions.every(
    (permission) =>
      (rolePermissions.permissions as readonly string[]).includes(permission)
  );
};

// Get user's role information
export const getUserRoleInfo = (userRole?: UserRole) => {
  const role = userRole || getCurrentUserRole();
  if (!role) return null;
  
  return ROLE_PERMISSIONS[role];
};

// Check if user can access events
export const canAccessEvents = (userRole?: UserRole): boolean => {
  return hasPermission('events:read', userRole);
};

// Check if user can create events
export const canCreateEvents = (userRole?: UserRole): boolean => {
  return hasPermission('events:write', userRole);
};

// Check if user can delete events
export const canDeleteEvents = (userRole?: UserRole): boolean => {
  return hasPermission('events:delete', userRole);
};

// Check if user can access participants
export const canAccessParticipants = (userRole?: UserRole): boolean => {
  return hasPermission('participants:read', userRole);
};

// Check if user can manage participants
export const canManageParticipants = (userRole?: UserRole): boolean => {
  return hasPermission('participants:write', userRole);
};

// Check if user can access help desk
export const canAccessHelpDesk = (userRole?: UserRole): boolean => {
  return hasPermission('helpdesk:read', userRole);
};

// Check if user can manage help desk
export const canManageHelpDesk = (userRole?: UserRole): boolean => {
  return hasPermission('helpdesk:write', userRole);
};

// Role-based API endpoint access
export const getRoleBasedApiEndpoints = (userRole?: UserRole) => {
  const role = userRole || getCurrentUserRole();
  if (!role) return { allowed: [], denied: [] };
  
  const rolePermissions = ROLE_PERMISSIONS[role];
  const allowedEndpoints: string[] = [];
  const deniedEndpoints: string[] = [];
  
  // Define endpoint permissions
  const endpointPermissions = {
    '/api/v2/events': ['events:read'],
    '/api/v2/event-participants': ['participants:read'],
    '/api/v2/help-desk': ['helpdesk:read']
  };
  
  Object.entries(endpointPermissions).forEach(([endpoint, requiredPermissions]) => {
    const hasAccess = requiredPermissions.every(permission => 
      rolePermissions.permissions.includes(permission as any)
    );
    
    if (hasAccess) {
      allowedEndpoints.push(endpoint);
    } else {
      deniedEndpoints.push(endpoint);
    }
  });
  
  return { allowed: allowedEndpoints, denied: deniedEndpoints };
};

// Role-based navigation
export const getRoleBasedNavigation = (userRole?: UserRole) => {
  const role = userRole || getCurrentUserRole();
  if (!role) return [];
  
  const baseNavigation = [
    { label: 'Dashboard', path: '/event-management', icon: 'Home', permission: 'events:read' },
    { label: 'Events', path: '/events', icon: 'Calendar', permission: 'events:read' },
    { label: 'Participants', path: '/participants', icon: 'Users', permission: 'participants:read' },
    { label: 'Help Desk', path: '/helpdesk', icon: 'Headphones', permission: 'helpdesk:read' },
    { label: 'Analytics', path: '/analytics', icon: 'BarChart', permission: 'analytics:read' },
    { label: 'Settings', path: '/settings', icon: 'Settings', permission: 'settings:read' }
  ];
  
  return baseNavigation.filter(item => hasPermission(item.permission, role));
};

// Role-based UI components visibility
export const getRoleBasedUIComponents = (userRole?: UserRole) => {
  const role = userRole || getCurrentUserRole();
  if (!role) return { showCreateEvent: false, showDeleteEvent: false, showAnalytics: false };
  
  return {
    showCreateEvent: canCreateEvents(role),
    showDeleteEvent: canDeleteEvents(role),
    showAnalytics: hasPermission('analytics:read', role),
    showUserManagement: hasPermission('users:read', role),
    showSettings: hasPermission('settings:read', role)
  };
};

// Error handling for role-based access
export const handleRoleBasedError = (error: any, userRole?: UserRole) => {
  const role = userRole || getCurrentUserRole();
  
  if (error.response?.status === 403) {
    const errorMessage = error.response.data?.error?.message || 'Access denied';
    const requiredRoles = error.response.data?.error?.details || [];
    
    return {
      isRoleError: true,
      message: errorMessage,
      requiredRoles,
      userRole: role,
      suggestion: role === USER_ROLES.SUPER_ADMIN 
        ? 'As a Super Admin, you should have access to all features. Please contact system administrator.'
        : `Your role (${role}) doesn't have permission for this action. Required roles: ${requiredRoles.join(', ')}`
    };
  }
  
  return {
    isRoleError: false,
    message: error.message || 'An error occurred',
    suggestion: 'Please try again or contact support if the issue persists.'
  };
};
export { USER_ROLES };

