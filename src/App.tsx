import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import { LoginForm } from "@/components/LoginForm";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/pages/Dashboard";
import { RSVPPage } from "@/pages/RSVPPage";
import { BudgetPage } from "@/pages/BudgetPage";
import { TodoPage } from "@/pages/TodoPage";
import { SchedulePage } from "@/pages/SchedulePage";
import { GuestPage } from "@/pages/GuestPage";
import { GalleryPage } from "@/pages/GalleryPage";
import { NotesPage } from "@/pages/NotesPage";
import { TravelPage } from "@/pages/TravelPage";
import { PaymentPage } from "@/pages/PaymentPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
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
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoginForm onLogin={() => setIsLoggedIn(true)} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 via-purple-50 to-indigo-100">
            <DashboardHeader onLogout={() => setIsLoggedIn(false)} />
            <Navigation 
              coupleNames={weddingData.coupleNames}
              onLogout={() => setIsLoggedIn(false)}
            />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
              <Routes>
                <Route path="/" element={<Dashboard weddingData={weddingData} />} />
                <Route path="/rsvp" element={<RSVPPage guestStats={weddingData.guestStats} />} />
                <Route path="/budget" element={<BudgetPage budget={weddingData.budget} onAddCategory={addBudgetCategory} />} />
                <Route path="/todos" element={<TodoPage todos={weddingData.todos} onToggleTodo={toggleTodo} onAddTodo={addTodo} onDeleteTodo={deleteTodo} />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/guests" element={<GuestPage />} />
                <Route path="/gallery" element={<GalleryPage gallery={weddingData.gallery} />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/travel" element={<TravelPage />} />
                <Route path="/payments" element={<PaymentPage />} />
                <Route path="/vendors" element={<div className="text-center py-8"><h1 className="text-2xl font-bold">Vendor Management</h1><p>Coming soon...</p></div>} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
