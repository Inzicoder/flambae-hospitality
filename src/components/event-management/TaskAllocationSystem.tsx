
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, Clock, User, AlertTriangle, Plus, MessageSquare } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  comments: string[];
  category: string;
}

interface Coordinator {
  name: string;
  tasksAssigned: number;
  tasksCompleted: number;
  pendingTasks: number;
}

export const TaskAllocationSystem = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Setup Welcome Desk',
      description: 'Arrange welcome desk with guest registration materials',
      assignedTo: 'Alice Cooper',
      dueDate: '2024-06-15T09:00',
      priority: 'High',
      status: 'In Progress',
      comments: ['Started setup process', 'Need additional signage'],
      category: 'Setup'
    },
    {
      id: '2',
      title: 'Coordinate Catering Delivery',
      description: 'Ensure all catering items are delivered on time',
      assignedTo: 'Bob Wilson',
      dueDate: '2024-06-15T11:00',
      priority: 'High',
      status: 'Pending',
      comments: [],
      category: 'Catering'
    },
    {
      id: '3',
      title: 'Sound System Check',
      description: 'Test all audio equipment and microphones',
      assignedTo: 'Charlie Brown',
      dueDate: '2024-06-15T13:00',
      priority: 'Medium',
      status: 'Completed',
      comments: ['All systems working perfectly'],
      category: 'Technical'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');

  const coordinators: Coordinator[] = [
    { name: 'Alice Cooper', tasksAssigned: 1, tasksCompleted: 0, pendingTasks: 1 },
    { name: 'Bob Wilson', tasksAssigned: 1, tasksCompleted: 0, pendingTasks: 1 },
    { name: 'Charlie Brown', tasksAssigned: 1, tasksCompleted: 1, pendingTasks: 0 }
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesAssignee = filterAssignee === 'all' || task.assignedTo === filterAssignee;
    return matchesStatus && matchesPriority && matchesAssignee;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Task Allocation & Team Coordination
          </CardTitle>
          <CardDescription>
            Assign and track tasks with your event coordination team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Coordinators</SelectItem>
                {coordinators.map(coord => (
                  <SelectItem key={coord.name} value={coord.name}>{coord.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="flex-shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>

          {/* Task Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
              <div className="text-sm text-blue-800">Total Tasks</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {tasks.filter(t => t.status === 'Pending').length}
              </div>
              <div className="text-sm text-yellow-800">Pending</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter(t => t.status === 'Completed').length}
              </div>
              <div className="text-sm text-green-800">Completed</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'Completed').length}
              </div>
              <div className="text-sm text-red-800">Overdue</div>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Details</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {task.title}
                          {isOverdue(task.dueDate) && task.status !== 'Completed' && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{task.description}</div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {task.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{task.assignedTo}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div className="text-sm">
                          <div>{new Date(task.dueDate).toLocaleDateString()}</div>
                          <div className={`${isOverdue(task.dueDate) && task.status !== 'Completed' ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                            {new Date(task.dueDate).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{task.comments.length} comments</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Team Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance Summary</CardTitle>
          <CardDescription>Coordinator performance and workload overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coordinators.map((coordinator) => (
              <div key={coordinator.name} className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{coordinator.name}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tasks Assigned:</span>
                    <span className="font-medium">{coordinator.tasksAssigned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium text-green-600">{coordinator.tasksCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending:</span>
                    <span className="font-medium text-yellow-600">{coordinator.pendingTasks}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between">
                      <span>Completion Rate:</span>
                      <span className="font-medium">
                        {coordinator.tasksAssigned > 0 
                          ? Math.round((coordinator.tasksCompleted / coordinator.tasksAssigned) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
