
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Search, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const NotesCollaboration = () => {
  const { toast } = useToast();
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([
    {
      id: 1,
      content: "Remember to confirm final headcount with caterer by May 1st",
      author: "Sarah",
      timestamp: "2024-03-15 10:30 AM",
      category: "vendor",
      priority: "high"
    },
    {
      id: 2,
      content: "Photographer wants to do a venue walkthrough next week",
      author: "Michael",
      timestamp: "2024-03-14 2:15 PM",
      category: "meeting",
      priority: "medium"
    },
    {
      id: 3,
      content: "Mom suggested adding vegetarian options to the menu",
      author: "Sarah",
      timestamp: "2024-03-13 9:00 AM",
      category: "family",
      priority: "low"
    },
    {
      id: 4,
      content: "Need to book shuttle service for out-of-town guests",
      author: "Wedding Planner",
      timestamp: "2024-03-12 4:45 PM",
      category: "logistics",
      priority: "high"
    }
  ]);

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        content: newNote,
        author: "You",
        timestamp: new Date().toLocaleString(),
        category: "general",
        priority: "medium"
      };
      setNotes(prev => [note, ...prev]);
      setNewNote('');
      toast({
        title: "Note added",
        description: "Your note has been added to the collaboration board.",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vendor': return 'bg-blue-100 text-blue-800';
      case 'meeting': return 'bg-green-100 text-green-800';
      case 'family': return 'bg-purple-100 text-purple-800';
      case 'logistics': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-green-500" />
          <span>Notes & Collaboration</span>
        </CardTitle>
        <CardDescription>
          Keep important notes and collaborate with your team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-6">
          <Input
            placeholder="Add a new note or reminder..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addNote()}
            className="flex-1"
          />
          <Button onClick={addNote}>
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-lg font-bold text-blue-600">{notes.filter(n => n.priority === 'high').length}</p>
            <p className="text-sm text-blue-700">High Priority</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-lg font-bold text-green-600">{notes.filter(n => n.category === 'vendor').length}</p>
            <p className="text-sm text-green-700">Vendor Notes</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-lg font-bold text-purple-600">{notes.filter(n => n.category === 'family').length}</p>
            <p className="text-sm text-purple-700">Family Input</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-lg font-bold text-orange-600">{notes.filter(n => n.category === 'meeting').length}</p>
            <p className="text-sm text-orange-700">Meeting Notes</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {notes.map((note) => (
            <div key={note.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Badge variant={getPriorityColor(note.priority)} className="text-xs">
                    {note.priority}
                  </Badge>
                  <Badge className={`text-xs ${getCategoryColor(note.category)}`}>
                    {note.category}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {note.timestamp}
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-2">{note.content}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <User className="h-3 w-3 mr-1" />
                  {note.author}
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-xs">Reply</Button>
                  <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <Button className="bg-green-500 hover:bg-green-600">
            <MessageSquare className="h-4 w-4 mr-2" />
            Start Discussion
          </Button>
          <Button variant="outline">Export Notes</Button>
          <Button variant="outline">Invite Collaborator</Button>
        </div>
      </CardContent>
    </Card>
  );
};
