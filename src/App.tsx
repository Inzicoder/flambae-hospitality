import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react';
import { AuthForm } from "@/components/AuthForm";
import { PaymentFlow } from "@/components/PaymentFlow";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Navigation } from "@/components/Navigation";
import { GuestDashboard } from "@/components/GuestDashboard";
import { EventCompanyDashboard } from "@/components/EventCompanyDashboard";
import { LandingPage } from "@/components/LandingPage";
import { GuestFeaturesPage } from "@/components/GuestFeaturesPage";
import { EventCompanyFeaturesPage } from "@/components/EventCompanyFeaturesPage";
import { RSVPPage } from "@/pages/RSVPPage";
import { BudgetPage } from "@/pages/BudgetPage";
import { TodoPage } from "@/pages/TodoPage";
import { SchedulePage } from "@/pages/SchedulePage";
import { GuestPage } from "@/pages/GuestPage";
import { GalleryPage } from "@/pages/GalleryPage";
import { NotesPage } from "@/pages/NotesPage";
import { TravelPage } from "@/pages/TravelPage";
import { PaymentPage } from "@/pages/PaymentPage";
import { VendorManager } from "@/components/VendorManager";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'guest' | 'eventCompany'>('guest');
  const [showPayment, setShowPayment] = useState(false);
  const [eventCode, setEventCode] = useState('');
  
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

  const handleGetStarted = () => {
    setIsLoggedIn(false);
  };

  const handleLogin = (type: 'guest' | 'eventCompany') => {
    setUserType(type);
    setIsLoggedIn(true);
  };

  const handleRegister = (type: 'eventCompany') => {
    setUserType(type);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (code: string) => {
    setEventCode(code);
    setShowPayment(false);
    setIsLoggedIn(true);
  };

  const handleBackToAuth = () => {
    setShowPayment(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {showPayment ? (
            <PaymentFlow 
              onPaymentSuccess={handlePaymentSuccess}
              onBack={handleBackToAuth}
            />
          ) : !isLoggedIn ? (
            <Routes>
              <Route path="/" element={<LandingPage onGetStarted={handleGetStarted} />} />
              <Route path="/features/guest" element={<GuestFeaturesPage onGetStarted={handleGetStarted} />} />
              <Route path="/features/company" element={<EventCompanyFeaturesPage onGetStarted={handleGetStarted} />} />
              <Route path="/auth" element={<AuthForm onLogin={handleLogin} onRegister={handleRegister} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-25 via-blush-50 to-lavender-50 relative overflow-hidden"
                 style={{ 
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f8d7da' fill-opacity='0.1' fill-rule='nonzero'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
                 }}>
              {/* Floating romantic elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-32 h-32 opacity-20">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-rose-200 to-pink-300 blur-xl animate-pulse"></div>
                </div>
                <div className="absolute top-40 right-20 w-48 h-48 opacity-15">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-lavender-200 to-purple-200 blur-2xl animate-pulse delay-1000"></div>
                </div>
                <div className="absolute bottom-20 left-1/3 w-40 h-40 opacity-10">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-200 to-yellow-200 blur-xl animate-pulse delay-2000"></div>
                </div>
              </div>
              
              <DashboardHeader onLogout={() => setIsLoggedIn(false)} userType={userType} />
              <Navigation 
                coupleNames={weddingData.coupleNames}
                onLogout={() => setIsLoggedIn(false)}
                userType={userType}
              />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32 relative z-10">
                <Routes>
                  {userType === 'guest' ? (
                    <>
                      <Route path="/" element={<GuestDashboard weddingData={weddingData} />} />
                      <Route path="/dashboard" element={<GuestDashboard weddingData={weddingData} />} />
                      <Route path="/budget" element={<BudgetPage budget={weddingData.budget} onAddCategory={addBudgetCategory} />} />
                      <Route path="/todos" element={<TodoPage todos={weddingData.todos} onToggleTodo={toggleTodo} onAddTodo={addTodo} onDeleteTodo={deleteTodo} />} />
                      <Route path="/gallery" element={<GalleryPage gallery={weddingData.gallery} />} />
                      <Route path="/notes" element={<NotesPage />} />
                      <Route path="/payments" element={<PaymentPage />} />
                      <Route path="/vendors" element={<VendorManager />} />
                      <Route path="/guests" element={<GuestPage />} />
                      <Route path="/schedule" element={<SchedulePage />} />
                    </>
                  ) : (
                    <>
                      <Route path="/" element={<EventCompanyDashboard weddingData={weddingData} />} />
                      <Route path="/dashboard" element={<EventCompanyDashboard weddingData={weddingData} />} />
                    </>
                  )}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </main>
            </div>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
