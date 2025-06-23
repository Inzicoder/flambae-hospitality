// Update this page (the content is just a fallback if you fail to update the page)

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Heart, Users, DollarSign, CheckSquare, Camera, MapPin, MessageSquare, Hotel, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [eventCode, setEventCode] = useState('');
  const { toast } = useToast();

  // Sample data for demonstration
  const weddingData = {
    coupleNames: "Sarah & Michael",
    weddingDate: "June 15, 2024",
    guestStats: {
      totalInvited: 150,
      confirmed: 89,
      pending: 45,
      declined: 16
    },
    budget: {
      total: 50000,
      spent: 32000,
      categories: [
        { name: "Venue", estimated: 15000, actual: 15000, status: "paid" },
        { name: "Catering", estimated: 12000, actual: 11500, status: "paid" },
        { name: "Photography", estimated: 8000, actual: 8500, status: "partial" },
        { name: "Decor", estimated: 6000, actual: 4000, status: "pending" },
        { name: "Outfits", estimated: 4000, actual: 3000, status: "paid" },
        { name: "Music", estimated: 3000, actual: 0, status: "pending" },
        { name: "Flowers", estimated: 2000, actual: 2500, status: "paid" }
      ]
    },
    todos: [
      { id: 1, task: "Send save the dates", completed: true, urgent: false },
      { id: 2, task: "Book wedding photographer", completed: true, urgent: false },
      { id: 3, task: "Order wedding cake", completed: false, urgent: true },
      { id: 4, task: "Finalize menu with caterer", completed: false, urgent: true },
      { id: 5, task: "Buy wedding rings", completed: false, urgent: false },
      { id: 6, task: "Plan honeymoon", completed: false, urgent: false }
    ]
  };

  const handleLogin = () => {
    if (loginMethod === 'email' && email) {
      setIsLoggedIn(true);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged into your wedding dashboard.",
      });
    } else if (loginMethod === 'code' && eventCode) {
      setIsLoggedIn(true);
      toast({
        title: "Welcome!",
        description: "You've successfully accessed your wedding dashboard.",
      });
    } else {
      toast({
        title: "Please fill in the required field",
        description: loginMethod === 'email' ? "Enter your email address" : "Enter your event code",
        variant: "destructive"
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-3 rounded-full">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Meliora Moments
            </h1>
            <p className="text-xl text-gray-600 mt-2 font-medium">Your Wedding OS</p>
            <p className="text-gray-500 mt-4">
              Plan, organize, and celebrate your perfect day
            </p>
          </div>

          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader className="space-y-4">
              <CardTitle className="text-center text-2xl">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Access your personalized wedding dashboard
              </CardDescription>
              
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    loginMethod === 'email'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Email Login
                </button>
                <button
                  onClick={() => setLoginMethod('code')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    loginMethod === 'code'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Event Code
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {loginMethod === 'email' ? (
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-200 focus:border-rose-500 focus:ring-rose-500"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="eventCode">Event Code</Label>
                  <Input
                    id="eventCode"
                    type="text"
                    placeholder="Enter your unique event code"
                    value={eventCode}
                    onChange={(e) => setEventCode(e.target.value)}
                    className="border-gray-200 focus:border-rose-500 focus:ring-rose-500"
                  />
                </div>
              )}

              <Button 
                onClick={handleLogin} 
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium py-2.5"
              >
                Access Dashboard
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Don't have access yet? Contact your wedding planner to get your login details.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  {weddingData.coupleNames}
                </h1>
                <p className="text-sm text-gray-600">{weddingData.weddingDate}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsLoggedIn(false)}
              className="border-gray-300"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invited</p>
                  <p className="text-3xl font-bold text-gray-900">{weddingData.guestStats.totalInvited}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-3xl font-bold text-green-600">{weddingData.guestStats.confirmed}</p>
                </div>
                <CheckSquare className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Used</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${weddingData.budget.spent.toLocaleString()}
                </p>
                <Progress 
                  value={(weddingData.budget.spent / weddingData.budget.total) * 100} 
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasks Left</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {weddingData.todos.filter(todo => !todo.completed).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="rsvp" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-lg">
            <TabsTrigger value="rsvp" className="text-xs">💌 RSVP</TabsTrigger>
            <TabsTrigger value="budget" className="text-xs">💰 Budget</TabsTrigger>
            <TabsTrigger value="vendors" className="text-xs">🧾 Vendors</TabsTrigger>
            <TabsTrigger value="todos" className="text-xs">✅ To-Do</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs">🗓️ Schedule</TabsTrigger>
            <TabsTrigger value="guests" className="text-xs">📦 Guests</TabsTrigger>
            <TabsTrigger value="gallery" className="text-xs">📸 Gallery</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">💬 Notes</TabsTrigger>
            <TabsTrigger value="travel" className="text-xs">🛏️ Travel</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs">🧾 Payments</TabsTrigger>
          </TabsList>

          {/* RSVP Tracker */}
          <TabsContent value="rsvp">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-rose-500" />
                  <span>RSVP Tracker</span>
                </CardTitle>
                <CardDescription>
                  Track your guest responses and meal preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{weddingData.guestStats.confirmed}</p>
                    <p className="text-sm text-green-700">Confirmed</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{weddingData.guestStats.pending}</p>
                    <p className="text-sm text-yellow-700">Pending</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{weddingData.guestStats.declined}</p>
                    <p className="text-sm text-red-700">Declined</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{weddingData.guestStats.totalInvited}</p>
                    <p className="text-sm text-blue-700">Total Invited</p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button className="bg-rose-500 hover:bg-rose-600">
                    Share RSVP Link
                  </Button>
                  <Button variant="outline">
                    Upload Guest List
                  </Button>
                  <Button variant="outline">
                    Add Guest Manually
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budget Tracker */}
          <TabsContent value="budget">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-6 w-6 text-green-500" />
                  <span>Budget Tracker</span>
                </CardTitle>
                <CardDescription>
                  Monitor your wedding expenses across all categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold">Total Budget</span>
                    <span className="text-2xl font-bold">${weddingData.budget.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Spent</span>
                    <span className="text-lg font-semibold text-red-600">${weddingData.budget.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Remaining</span>
                    <span className="text-lg font-semibold text-green-600">
                      ${(weddingData.budget.total - weddingData.budget.spent).toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={(weddingData.budget.spent / weddingData.budget.total) * 100} 
                    className="mt-3"
                  />
                </div>

                <div className="space-y-4">
                  {weddingData.budget.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{category.name}</h3>
                          <Badge 
                            variant={category.status === 'paid' ? 'default' : category.status === 'partial' ? 'secondary' : 'destructive'}
                          >
                            {category.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Estimated: ${category.estimated.toLocaleString()}</span>
                          <span>Actual: ${category.actual.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={category.actual > 0 ? (category.actual / category.estimated) * 100 : 0} 
                          className="mt-2 h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex space-x-4">
                  <Button className="bg-green-500 hover:bg-green-600">
                    Add Expense
                  </Button>
                  <Button variant="outline">
                    Download PDF Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* To-Do List */}
          <TabsContent value="todos">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckSquare className="h-6 w-6 text-blue-500" />
                  <span>Wedding To-Do List</span>
                </CardTitle>
                <CardDescription>
                  Stay organized with your wedding planning checklist
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">
                      Progress: {weddingData.todos.filter(todo => todo.completed).length} of {weddingData.todos.length} completed
                    </span>
                  </div>
                  <Progress 
                    value={(weddingData.todos.filter(todo => todo.completed).length / weddingData.todos.length) * 100} 
                  />
                </div>

                <div className="space-y-3">
                  {weddingData.todos.map((todo) => (
                    <div 
                      key={todo.id} 
                      className={`flex items-center space-x-3 p-4 rounded-lg border ${
                        todo.completed 
                          ? 'bg-green-50 border-green-200' 
                          : todo.urgent 
                            ? 'bg-red-50 border-red-200' 
                            : 'bg-white border-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        className="h-5 w-5 text-rose-500 rounded focus:ring-rose-500"
                        readOnly
                      />
                      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                        {todo.task}
                      </span>
                      {todo.urgent && !todo.completed && (
                        <Badge variant="destructive">Urgent</Badge>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Add New Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs with placeholder content */}
          <TabsContent value="vendors">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Vendor Manager</CardTitle>
                <CardDescription>Manage all your wedding vendors in one place</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Keep track of all your wedding vendors, contracts, and payments.</p>
                <Button>Add New Vendor</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Event Schedule</CardTitle>
                <CardDescription>Plan your wedding timeline and events</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Create a detailed schedule for all your wedding events.</p>
                <Button>Add Event</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guests">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Guest Manager</CardTitle>
                <CardDescription>Manage your guest list and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Organize guest details, group them by families, and track attendance.</p>
                <Button>Add Guest</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Memories & Gallery</CardTitle>
                <CardDescription>Store and share your wedding photos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Upload and organize photos from all your wedding events.</p>
                <Button>Upload Photos</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Notes & Collaboration</CardTitle>
                <CardDescription>Keep important notes and collaborate with your team</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Add personal notes, vendor meeting notes, and collaborate with family.</p>
                <Button>Add Note</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="travel">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Accommodation & Travel</CardTitle>
                <CardDescription>Manage guest accommodations and travel arrangements</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Track hotel bookings, travel schedules, and shuttle arrangements.</p>
                <Button>Add Booking</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Invoice & Payment Manager</CardTitle>
                <CardDescription>Track all invoices and payment statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Monitor payment due dates, upload receipts, and track vendor payments.</p>
                <Button>Add Invoice</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
