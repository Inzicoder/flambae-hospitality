
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
import { PhotoGallery } from "@/components/PhotoGallery";
import { TravelAccommodation } from "@/components/TravelAccommodation";
import { PaymentManager } from "@/components/PaymentManager";

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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 via-purple-50 to-indigo-100 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-10 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
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

          <Tabs defaultValue="rsvp" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 glass-effect p-2 rounded-2xl shadow-xl border-0 h-auto">
              {[
                { value: "rsvp", label: "💌 RSVP" },
                { value: "budget", label: "💰 Budget" },
                { value: "vendors", label: "🧾 Vendors" },
                { value: "todos", label: "✅ To-Do" },
                { value: "schedule", label: "🗓️ Schedule" },
                { value: "guests", label: "📦 Guests" },
                { value: "gallery", label: "📸 Gallery" },
                { value: "notes", label: "💬 Notes" },
                { value: "travel", label: "🛏️ Travel" },
                { value: "payments", label: "🧾 Payments" }
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-gray-900 data-[state=active]:transform data-[state=active]:scale-105"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="rsvp" className="animate-fade-in-up">
              <RSVPTracker guestStats={weddingData.guestStats} />
            </TabsContent>

            <TabsContent value="budget" className="animate-fade-in-up">
              <BudgetTracker 
                budget={weddingData.budget} 
                onAddCategory={addBudgetCategory}
              />
            </TabsContent>

            <TabsContent value="todos" className="animate-fade-in-up">
              <TodoList 
                todos={weddingData.todos}
                onToggleTodo={toggleTodo}
                onAddTodo={addTodo}
                onDeleteTodo={deleteTodo}
              />
            </TabsContent>

            <TabsContent value="vendors" className="animate-fade-in-up">
              <VendorManager />
            </TabsContent>

            <TabsContent value="schedule" className="animate-fade-in-up">
              <EventSchedule />
            </TabsContent>

            <TabsContent value="guests" className="animate-fade-in-up">
              <GuestManager />
            </TabsContent>

            <TabsContent value="gallery" className="animate-fade-in-up">
              <PhotoGallery gallery={weddingData.gallery} />
            </TabsContent>

            <TabsContent value="notes" className="animate-fade-in-up">
              <NotesCollaboration />
            </TabsContent>

            <TabsContent value="travel" className="animate-fade-in-up">
              <TravelAccommodation />
            </TabsContent>

            <TabsContent value="payments" className="animate-fade-in-up">
              <PaymentManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
