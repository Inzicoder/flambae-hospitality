
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Hotel, FileText, Plus, Share2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import our refactored components
import { LoginForm } from "@/components/LoginForm";
import { DashboardHeader } from "@/components/DashboardHeader";
import { QuickStats } from "@/components/QuickStats";
import { RSVPTracker } from "@/components/RSVPTracker";
import { BudgetTracker } from "@/components/BudgetTracker";
import { TodoList } from "@/components/TodoList";
import { GuestManager } from "@/components/GuestManager";
import { EventSchedule } from "@/components/EventSchedule";
import { VendorManager } from "@/components/VendorManager";
import { NotesCollaboration } from "@/components/NotesCollaboration";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sample data for demonstration
  const [weddingData, setWeddingData] = useState({
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
        { id: 1, name: "Venue", estimated: 15000, actual: 15000, status: "paid" },
        { id: 2, name: "Catering", estimated: 12000, actual: 11500, status: "paid" },
        { id: 3, name: "Photography", estimated: 8000, actual: 8500, status: "partial" },
        { id: 4, name: "Decor", estimated: 6000, actual: 4000, status: "pending" },
        { id: 5, name: "Outfits", estimated: 4000, actual: 3000, status: "paid" },
        { id: 6, name: "Music", estimated: 3000, actual: 0, status: "pending" },
        { id: 7, name: "Flowers", estimated: 2000, actual: 2500, status: "paid" }
      ]
    },
    todos: [
      { id: 1, task: "Send save the dates", completed: true, urgent: false, dueDate: "2024-01-15" },
      { id: 2, task: "Book wedding photographer", completed: true, urgent: false, dueDate: "2024-02-01" },
      { id: 3, task: "Order wedding cake", completed: false, urgent: true, dueDate: "2024-05-01" },
      { id: 4, task: "Finalize menu with caterer", completed: false, urgent: true, dueDate: "2024-04-15" },
      { id: 5, task: "Buy wedding rings", completed: false, urgent: false, dueDate: "2024-05-15" },
      { id: 6, task: "Plan honeymoon", completed: false, urgent: false, dueDate: "2024-06-01" }
    ],
    gallery: {
      categories: ["Pre-wedding", "Haldi", "Mehendi", "Wedding", "Reception"],
      photos: []
    }
  });

  const toggleTodo = (id: number) => {
    setWeddingData(prev => ({
      ...prev,
      todos: prev.todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };

  const addTodo = (task: string) => {
    const newTask = {
      id: Date.now(),
      task,
      completed: false,
      urgent: false,
      dueDate: new Date().toISOString().split('T')[0]
    };
    setWeddingData(prev => ({
      ...prev,
      todos: [...prev.todos, newTask]
    }));
  };

  const deleteTodo = (id: number) => {
    setWeddingData(prev => ({
      ...prev,
      todos: prev.todos.filter(todo => todo.id !== id)
    }));
  };

  const addBudgetCategory = (category: { name: string; estimated: number }) => {
    const newCategory = {
      id: Date.now(),
      name: category.name,
      estimated: category.estimated,
      actual: 0,
      status: "pending"
    };
    setWeddingData(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        categories: [...prev.budget.categories, newCategory]
      }
    }));
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  const completedTodos = weddingData.todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <DashboardHeader 
        coupleNames={weddingData.coupleNames}
        weddingDate={weddingData.weddingDate}
        onLogout={() => setIsLoggedIn(false)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QuickStats 
          guestStats={weddingData.guestStats}
          budget={weddingData.budget}
          completedTodos={completedTodos}
          totalTodos={weddingData.todos.length}
        />

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

          <TabsContent value="rsvp">
            <RSVPTracker guestStats={weddingData.guestStats} />
          </TabsContent>

          <TabsContent value="budget">
            <BudgetTracker 
              budget={weddingData.budget} 
              onAddCategory={addBudgetCategory}
            />
          </TabsContent>

          <TabsContent value="todos">
            <TodoList 
              todos={weddingData.todos}
              onToggleTodo={toggleTodo}
              onAddTodo={addTodo}
              onDeleteTodo={deleteTodo}
            />
          </TabsContent>

          <TabsContent value="vendors">
            <VendorManager />
          </TabsContent>

          <TabsContent value="schedule">
            <EventSchedule />
          </TabsContent>

          <TabsContent value="guests">
            <GuestManager />
          </TabsContent>

          <TabsContent value="gallery">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-6 w-6 text-purple-500" />
                  <span>Memories & Gallery</span>
                </CardTitle>
                <CardDescription>Store and share your wedding photos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {weddingData.gallery.categories.map((category, index) => (
                    <div key={index} className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-rose-300 transition-colors cursor-pointer">
                      <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm font-medium text-gray-600">{category}</p>
                      <p className="text-xs text-gray-500">0 photos</p>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <Button className="bg-purple-500 hover:bg-purple-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Photos
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Gallery Link
                  </Button>
                  <Button variant="outline">Create Slideshow</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <NotesCollaboration />
          </TabsContent>

          <TabsContent value="travel">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Hotel className="h-6 w-6 text-indigo-500" />
                  <span>Accommodation & Travel</span>
                </CardTitle>
                <CardDescription>Manage guest accommodations and travel arrangements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-3">Hotel Bookings</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Recommend nearby hotels to guests</p>
                      <p>• Track group booking discounts</p>
                      <p>• Manage check-in dates</p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-3">Transportation</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Shuttle schedules</p>
                      <p>• Airport transfer arrangements</p>
                      <p>• Parking information</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button className="bg-indigo-500 hover:bg-indigo-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Hotel
                  </Button>
                  <Button variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    View Map
                  </Button>
                  <Button variant="outline">Send Travel Info</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-emerald-500" />
                  <span>Invoice & Payment Manager</span>
                </CardTitle>
                <CardDescription>Track all invoices and payment statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">$25,000</p>
                    <p className="text-sm text-green-700">Paid</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">$8,500</p>
                    <p className="text-sm text-yellow-700">Pending</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">$2,000</p>
                    <p className="text-sm text-red-700">Overdue</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button className="bg-emerald-500 hover:bg-emerald-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Invoice
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Export Reports
                  </Button>
                  <Button variant="outline">Payment Reminders</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
