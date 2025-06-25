
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Phone, Clock, Send, User, Filter } from 'lucide-react';

interface HelpDeskQuery {
  id: string;
  guestName: string;
  phoneNumber: string;
  message: string;
  timestamp: string;
  status: 'New' | 'Responded' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  assignedStaff: string;
  response: string;
  category: string;
}

export const HelpDeskIntegration = () => {
  const [queries, setQueries] = useState<HelpDeskQuery[]>([
    {
      id: '1',
      guestName: 'John Smith',
      phoneNumber: '+1234567890',
      message: 'Hi, I need help with my room key card. It\'s not working.',
      timestamp: '2024-06-15T14:30:00',
      status: 'New',
      priority: 'High',
      assignedStaff: 'Sarah Johnson',
      response: '',
      category: 'Room Issues'
    },
    {
      id: '2',
      guestName: 'Maria Garcia',
      phoneNumber: '+1234567891',
      message: 'Could you please tell me the timing for tomorrow\'s ceremony?',
      timestamp: '2024-06-15T15:15:00',
      status: 'Responded',
      priority: 'Medium',
      assignedStaff: 'Mike Wilson',
      response: 'The ceremony starts at 4:00 PM tomorrow. Please arrive by 3:30 PM.',
      category: 'Event Information'
    },
    {
      id: '3',
      guestName: 'David Lee',
      phoneNumber: '+1234567892',
      message: 'I have dietary restrictions. Can the kitchen accommodate gluten-free meals?',
      timestamp: '2024-06-15T16:00:00',
      status: 'Resolved',
      priority: 'Medium',
      assignedStaff: 'Emma Davis',
      response: 'Yes, we have gluten-free options available. I\'ve informed the kitchen about your requirements.',
      category: 'Dietary Requirements'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  const filteredQueries = queries.filter(query => {
    const matchesStatus = filterStatus === 'all' || query.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || query.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-red-100 text-red-800';
      case 'Responded': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
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

  const handleSendResponse = (queryId: string) => {
    if (!responseText.trim()) return;
    
    setQueries(prev => prev.map(query => 
      query.id === queryId 
        ? { ...query, response: responseText, status: 'Responded' as const }
        : query
    ));
    setResponseText('');
    setSelectedQuery(null);
  };

  const markAsResolved = (queryId: string) => {
    setQueries(prev => prev.map(query => 
      query.id === queryId 
        ? { ...query, status: 'Resolved' as const }
        : query
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Help Desk Integration (WhatsApp)
          </CardTitle>
          <CardDescription>
            Centralized help desk for guest queries and real-time communication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters and Stats */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Responded">Responded</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Query Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {queries.filter(q => q.status === 'New').length}
              </div>
              <div className="text-sm text-red-800">New Queries</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {queries.filter(q => q.status === 'Responded').length}
              </div>
              <div className="text-sm text-blue-800">Responded</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {queries.filter(q => q.status === 'Resolved').length}
              </div>
              <div className="text-sm text-green-800">Resolved</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((queries.filter(q => q.status === 'Resolved').length / queries.length) * 100)}%
              </div>
              <div className="text-sm text-purple-800">Resolution Rate</div>
            </div>
          </div>

          {/* Queries Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest Details</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueries.map((query) => (
                  <TableRow key={query.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          <User className="h-4 w-4 text-gray-400" />
                          {query.guestName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {query.phoneNumber}
                        </div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {query.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm truncate" title={query.message}>
                        {query.message}
                      </div>
                      {query.response && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                          <strong>Response:</strong> {query.response}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div className="text-sm">
                          <div>{new Date(query.timestamp).toLocaleDateString()}</div>
                          <div className="text-gray-500">
                            {new Date(query.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(query.priority)}>
                        {query.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(query.status)}>
                        {query.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{query.assignedStaff}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {query.status === 'New' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedQuery(query.id)}
                          >
                            Respond
                          </Button>
                        )}
                        {query.status === 'Responded' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => markAsResolved(query.id)}
                          >
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Response Panel */}
      {selectedQuery && (
        <Card>
          <CardHeader>
            <CardTitle>Send Response</CardTitle>
            <CardDescription>
              Respond to {queries.find(q => q.id === selectedQuery)?.guestName}'s query
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm">
                <strong>Original Message:</strong> {queries.find(q => q.id === selectedQuery)?.message}
              </p>
            </div>
            <Textarea
              placeholder="Type your response here..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="min-h-24"
            />
            <div className="flex gap-2">
              <Button onClick={() => handleSendResponse(selectedQuery)}>
                <Send className="h-4 w-4 mr-2" />
                Send Response
              </Button>
              <Button variant="outline" onClick={() => setSelectedQuery(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Communication History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Communications</CardTitle>
          <CardDescription>Latest interactions with guests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {queries.filter(q => q.response).slice(0, 3).map(query => (
              <div key={query.id} className="border-l-4 border-blue-200 pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{query.guestName}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(query.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  <strong>Query:</strong> {query.message}
                </p>
                <p className="text-xs text-blue-700">
                  <strong>Response:</strong> {query.response}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
