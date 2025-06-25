
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GuestManagementSystem } from './event-management/GuestManagementSystem';
import { LogisticsManagement } from './event-management/LogisticsManagement';
import { RoomAllocationTracker } from './event-management/RoomAllocationTracker';
import { TaskAllocationSystem } from './event-management/TaskAllocationSystem';
import { HelpDeskIntegration } from './event-management/HelpDeskIntegration';
import { Users, Truck, Hotel, CheckSquare, MessageCircle, BarChart3 } from 'lucide-react';

export const EventManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState("guests");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-800">Event Management Dashboard</h1>
          <p className="text-slate-600">Professional event coordination and management system</p>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="guests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Guest Management</span>
              <span className="sm:hidden">Guests</span>
            </TabsTrigger>
            <TabsTrigger value="logistics" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">Logistics</span>
            </TabsTrigger>
            <TabsTrigger value="rooms" className="flex items-center gap-2">
              <Hotel className="h-4 w-4" />
              <span className="hidden sm:inline">Rooms & Gifts</span>
              <span className="sm:hidden">Rooms</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Task Management</span>
              <span className="sm:hidden">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="helpdesk" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Help Desk</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guests" className="space-y-4">
            <GuestManagementSystem />
          </TabsContent>

          <TabsContent value="logistics" className="space-y-4">
            <LogisticsManagement />
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4">
            <RoomAllocationTracker />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <TaskAllocationSystem />
          </TabsContent>

          <TabsContent value="helpdesk" className="space-y-4">
            <HelpDeskIntegration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
