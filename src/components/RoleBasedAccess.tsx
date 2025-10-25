/**
 * Role-Based Access Control Component
 * 
 * This component provides role-based UI rendering and access control
 */

import React from 'react';
import { 
  getCurrentUserRole, 
  getUserRoleInfo,
  USER_ROLES 
} from '@/lib/rbac';

interface RoleBasedAccessProps {
  children: React.ReactNode;
  permission?: string;
  role?: string;
  fallback?: React.ReactNode;
}

export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({ 
  children, 
  permission, 
  role, 
  fallback = null 
}) => {
  const currentRole = getCurrentUserRole();
  
  // If no role is set, deny access
  if (!currentRole) {
    return <>{fallback}</>;
  }
  
  // Check specific role requirement
  if (role && currentRole !== role) {
    return <>{fallback}</>;
  }
  
  // Check permission requirement
  if (permission) {
    const roleInfo = getUserRoleInfo(currentRole);
    const hasAccess = roleInfo?.permissions.includes(permission as any);
    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }
  
  return <>{children}</>;
};

// Specific role-based components
export const SuperAdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <RoleBasedAccess role={USER_ROLES.SUPER_ADMIN} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const LogisticsManagerOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <RoleBasedAccess role={USER_ROLES.LOGISTICS} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const HelpDeskManagerOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <RoleBasedAccess role={USER_ROLES.HELP_DESK} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const RSVPManagerOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <RoleBasedAccess role={USER_ROLES.RSVP} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

// Permission-based components
export const CanCreateEvents: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <RoleBasedAccess permission="events:write" fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const CanDeleteEvents: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <RoleBasedAccess permission="events:delete" fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const CanAccessEvents: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <RoleBasedAccess permission="events:read" fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const CanManageParticipants: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <RoleBasedAccess permission="participants:write" fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const CanAccessHelpDesk: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <RoleBasedAccess permission="helpdesk:read" fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

// User role display component
export const UserRoleDisplay: React.FC = () => {
  const currentRole = getCurrentUserRole();
  const roleInfo = getUserRoleInfo();
  
  if (!currentRole || !roleInfo) {
    return (
      <div className="text-sm text-gray-500">
        Role not set
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">Logged in as:</span>
      <span className="font-medium text-blue-600">{roleInfo.name}</span>
    </div>
  );
};

// Access denied component
export const AccessDeniedMessage: React.FC<{ 
  requiredPermission?: string; 
  requiredRole?: string;
  customMessage?: string;
}> = ({ requiredPermission, requiredRole, customMessage }) => {
  const currentRole = getCurrentUserRole();
  const roleInfo = getUserRoleInfo();
  
  const getMessage = () => {
    if (customMessage) return customMessage;
    
    if (requiredRole) {
      return `Access denied. Required role: ${requiredRole}. Your role: ${currentRole || 'None'}`;
    }
    
    if (requiredPermission) {
      return `Access denied. Required permission: ${requiredPermission}. Your role: ${roleInfo?.name || 'None'}`;
    }
    
    return 'Access denied. You do not have permission to access this resource.';
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-red-500 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
      <p className="text-gray-600 mb-4">{getMessage()}</p>
      {currentRole === USER_ROLES.SUPER_ADMIN && (
        <p className="text-sm text-blue-600">
          As a Super Admin, you should have access to all features. Please contact system administrator.
        </p>
      )}
    </div>
  );
};
