import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import { AuthForm } from "@/components/AuthForm";
import { PaymentFlow } from "@/components/PaymentFlow";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Navigation } from "@/components/Navigation";
import { BackButton } from "@/components/ui/BackButton";
import { GuestDashboard } from "@/components/GuestDashboard";
import { EventManagementDashboard } from "@/components/event-management/EventManagementDashboard";
import { EventCompanyHeader } from "@/components/event-management/EventCompanyHeader";
import EventsListingDashboard from "@/components/event-management/EventsListingDashboard";
import { LandingPage } from "@/components/LandingPage";
import { GuestFeaturesPage } from "@/components/GuestFeaturesPage";
import { EventCompanyFeaturesPage } from "@/components/EventCompanyFeaturesPage";
import { BudgetPage } from "@/pages/BudgetPage";
import { TodoPage } from "@/pages/TodoPage";
import { EventParticipantsPage } from "@/pages/EventParticipantsPage";

import { GalleryPage } from "@/pages/GalleryPage";
import { DocumentUploadPage } from "@/pages/DocumentUploadPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Navigation guard component to prevent browser back navigation to auth screen
const NavigationGuard = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Block browser back navigation when on event-management page
    const handlePopState = (event: PopStateEvent) => {
      if (location.pathname === '/event-management' && isLoggedIn) {
        // Prevent navigation away from event-management page
        event.preventDefault();
        window.history.pushState(null, '', '/event-management');
      }
    };

    // Override browser back button
    window.addEventListener('popstate', handlePopState);

    // Push a state to prevent going back to auth
    if (location.pathname === '/event-management' && isLoggedIn) {
      window.history.pushState(null, '', '/event-management');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, isLoggedIn, navigate]);

  return null;
};

// Auth wrapper component to handle navigation
const AuthWrapper = ({ 
  onLogin, 
  onRegister, 
  showPayment, 
  onPaymentSuccess, 
  onBackToAuth 
}: {
  onLogin: (type: 'guest' | 'eventCompany') => void;
  onRegister: (type: 'eventCompany') => void;
  showPayment: boolean;
  onPaymentSuccess: (code: string) => void;
  onBackToAuth: () => void;
}) => {
  const navigate = useNavigate();

  const handleLogin = (type: 'guest' | 'eventCompany') => {
    console.log('AuthWrapper - handleLogin called with type:', type);
    onLogin(type);
    // Navigate to dashboard after successful login
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 100);
  };

  const handleRegister = (type: 'eventCompany') => {
    console.log('AuthWrapper - handleRegister called');
    onRegister(type);
  };

  const handlePaymentSuccess = (code: string) => {
    console.log('AuthWrapper - handlePaymentSuccess called');
    onPaymentSuccess(code);
    // Navigate to dashboard after successful payment
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 100);
  };

  if (showPayment) {
    return (
      <PaymentFlow 
        onPaymentSuccess={handlePaymentSuccess}
        onBack={onBackToAuth}
      />
    );
  }

  return (
    <AuthForm 
      onLogin={handleLogin} 
      onRegister={handleRegister} 
    />
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'guest' | 'eventCompany'>('guest');
  const [showPayment, setShowPayment] = useState(false);
  const [eventCode, setEventCode] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  
  // Restore authentication state from localStorage on app load
  useEffect(() => {
    const savedAuthState = localStorage.getItem('authState');
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    console.log('Checking auth state:', { savedAuthState, token, userRole });
    
    if (savedAuthState && token) {
      try {
        const { isLoggedIn: savedIsLoggedIn, userType: savedUserType } = JSON.parse(savedAuthState);
        if (savedIsLoggedIn && savedUserType) {
          setIsLoggedIn(savedIsLoggedIn);
          setUserType(savedUserType);
          console.log('Successfully restored auth state:', { isLoggedIn: savedIsLoggedIn, userType: savedUserType, userRole });
        } else {
          console.log('Invalid auth state, clearing...');
          localStorage.removeItem('authState');
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          setIsLoggedIn(false);
          setUserType('guest');
        }
      } catch (error) {
        console.error('Error parsing saved auth state:', error);
        localStorage.removeItem('authState');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUserType('guest');
      }
    } else {
      console.log('No valid auth state found, setting defaults');
      setIsLoggedIn(false);
      setUserType('guest');
      if (!token) {
        localStorage.removeItem('authState');
        localStorage.removeItem('userRole');
      }
    }
    
    // Set loading to false after auth state is restored
    setIsLoading(false);
  }, []);
  
  // Save authentication state to localStorage whenever it changes
  useEffect(() => {
    const authState = { isLoggedIn, userType };
    localStorage.setItem('authState', JSON.stringify(authState));
    console.log('Saved auth state:', authState);
  }, [isLoggedIn, userType]);
  
  // Debug logging
  useEffect(() => {
    console.log('App state changed:', { isLoggedIn, userType, showPayment });
  }, [isLoggedIn, userType, showPayment]);

  // Sample data for demonstration
  const [weddingData, setWeddingData] = useState({

  });

  // const toggleTodo = (id: number) => {
  //   setWeddingData(prev => ({
  //     ...prev,
  //     todos: prev.todos.map(todo => 
  //       todo.id === id ? { ...todo, completed: !todo.completed } : todo
  //     )
  //   }));
  // };

  // const addTodo = (task: string) => {
  //   const newTask = {
  //     id: Date.now(),
  //     task,
  //     completed: false,
  //     urgent: false,
  //     dueDate: new Date().toISOString().split('T')[0]
  //   };
  //   setWeddingData(prev => ({
  //     ...prev,
  //     todos: [...prev.todos, newTask]
  //   }));
  // };

  // const deleteTodo = (id: number) => {
  //   setWeddingData(prev => ({
  //     ...prev,
  //     todos: prev.todos.filter(todo => todo.id !== id)
  //   }));
  // };

  // const addBudgetCategory = (category: { name: string; estimated: number }) => {
  //   const newCategory = {
  //     id: Date.now(),
  //     name: category.name,
  //     estimated: category.estimated,
  //     actual: 0,
  //     status: "pending"
  //   };
  //   setWeddingData(prev => ({
  //     ...prev,
  //     budget: {
  //       ...prev.budget,
  //       categories: [...prev.budget.categories, newCategory]
  //     }
  //   }));
  // };

  const handleGetStarted = () => {
    console.log('Get started clicked - navigating to auth');
  };

  const handleLogin = (type: 'guest' | 'eventCompany') => {
    console.log('App - Login successful for type:', type);

    setUserType(type);
    setIsLoggedIn(true);
    setShowPayment(false);
  };

  const handleRegister = (type: 'eventCompany') => {
    console.log('App - Register requested for type:', type);


    setUserType(type);
    setShowPayment(true);
    setIsLoggedIn(false); // Keep logged out until payment is complete
  };



  const handlePaymentSuccess = (code: string) => {
    console.log('App - Payment successful with code:', code);
    setEventCode(code);
    setShowPayment(false);
    setIsLoggedIn(true);
  };

  const handleBackToAuth = () => {
    console.log('App - Back to auth');
    setShowPayment(false);
  };

  const handleLogout = () => {
    console.log('App - Logout');
    setIsLoggedIn(false);
    setShowPayment(false);
    setUserType('guest');
    setEventCode('');
    // Clear authentication state from localStorage
    localStorage.removeItem('authState');
    localStorage.removeItem('token'); // Also clear any stored token
    localStorage.removeItem('userRole');
  };

  // Common layout component for authenticated pages
  const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
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
      
      <DashboardHeader onLogout={handleLogout} userType={userType} />
      <Navigation 
        coupleNames={''}
        onLogout={handleLogout}
        userType={userType}
      />
      
      {/* Common Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 relative z-10">
        <BackButton className="mb-4" />
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
        {children}
      </main>
    </div>
  );

  // Show loading screen while restoring authentication state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Flambae Hospitality</h2>
          <p className="text-gray-500">Restoring your session...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NavigationGuard isLoggedIn={isLoggedIn} />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage onGetStarted={handleGetStarted} />} />
            <Route path="/features/guest" element={<GuestFeaturesPage onGetStarted={handleGetStarted} />} />
            <Route path="/features/company" element={<EventCompanyFeaturesPage onGetStarted={handleGetStarted} />} />
            <Route path="/document-upload/:eventId/:participantId" element={<DocumentUploadPage />} />
            
            {/* Auth Route */}
            <Route path="/auth" element={
              <AuthWrapper
                onLogin={handleLogin}
                onRegister={handleRegister}
                showPayment={showPayment}
                onPaymentSuccess={handlePaymentSuccess}
                onBackToAuth={handleBackToAuth}
              />
            } />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              isLoggedIn ? (
                <DashboardLayout>
                  {userType === 'guest' ? (
                    <GuestDashboard weddingData={weddingData} />
                  ) : (
                    <Navigate to="/event-management" replace />
                  )}
                </DashboardLayout>
              ) : (
                <Navigate to="/auth" replace />
              )
            } />
            
            {/* Event Company Events Listing */}
            <Route path="/event-management" element={
              isLoggedIn && userType === 'eventCompany' ? (
                <DashboardLayout>
                  <EventsListingDashboard weddingData={weddingData} />
                </DashboardLayout>
              ) : (
                <Navigate to="/auth" replace />
              )
            } />

            {/* Individual Event Management Dashboard */}
            <Route path="/event-management/:eventId" element={
              isLoggedIn && userType === 'eventCompany' ? (
                <DashboardLayout>
                  <EventCompanyHeader weddingData={weddingData} />
                  <EventManagementDashboard />
                </DashboardLayout>
              ) : (
                <Navigate to="/auth" replace />
              )
            } />

            {/* Event Participants Page */}
            <Route path="/event-participants/:eventId" element={
              isLoggedIn && userType === 'eventCompany' ? (
                <DashboardLayout>
                  <EventParticipantsPage />
                </DashboardLayout>
              ) : (
                <Navigate to="/auth" replace />
              )
            } />
            
            {/* Simplified guest-only routes for personal planning */}
            {/* <Route path="/budget" element={
              isLoggedIn && userType === 'guest' ? (
                <DashboardLayout>
                  <BudgetPage budget={weddingData.budget} onAddCategory={addBudgetCategory} />
                </DashboardLayout>
              ) : (
                <Navigate to="/auth" replace />
              )
            } />
{/*              */}
            {/* <Route path="/todos" element={
              isLoggedIn && userType === 'guest' ? (
                <DashboardLayout>
                  <TodoPage todos={weddingData.todos} onToggleTodo={toggleTodo} onAddTodo={addTodo} onDeleteTodo={deleteTodo} />
                </DashboardLayout>
              ) : (
                <Navigate to="/auth" replace />
              )
            } /> */} 
            
            {/* <Route path="/gallery" element={
              isLoggedIn && userType === 'guest' ? (
                <DashboardLayout>
                  <GalleryPage gallery={weddingData.gallery} />
                </DashboardLayout>
              ) : (
                <Navigate to="/auth" replace />
              )
            } /> */}
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>

  );
};

export default App;
