
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { AuthForm } from "@/components/AuthForm";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Navigation } from "@/components/Navigation";
import { GuestDashboard } from "@/components/GuestDashboard";
import { EventCompanyDashboard } from "@/components/EventCompanyDashboard";
import { LandingPage } from "@/components/LandingPage";
import { GuestFeaturesPage } from "@/components/GuestFeaturesPage";
import { EventCompanyFeaturesPage } from "@/components/EventCompanyFeaturesPage";
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
import { useWedding } from "@/hooks/useWedding";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Dashboard Route Component that handles user type routing
const DashboardRoute = () => {
  const { profile, loading } = useUserProfile();
  const { wedding } = useWedding();

  console.log('DashboardRoute - Profile:', profile, 'Loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!profile) {
    console.log('No profile found, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('Routing based on user_type:', profile.user_type);

  // Route to appropriate dashboard based on user type
  if (profile.user_type === 'eventCompany') {
    console.log('Rendering EventCompanyDashboard');
    return <EventCompanyDashboard weddingData={wedding} />;
  }

  console.log('Rendering GuestDashboard');
  return <GuestDashboard />;
};

// Dashboard Layout wrapper
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut } = useAuth();
  const { profile } = useUserProfile();

  const handleLogout = async () => {
    await signOut();
  };

  const userType = profile?.user_type || 'guest';

  return (
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
        coupleNames="Your Wedding"
        onLogout={handleLogout}
        userType={userType}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32 relative z-10">
        {children}
      </main>
    </div>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage onGetStarted={handleGetStarted} />} />
      <Route path="/features/guest" element={<GuestFeaturesPage onGetStarted={handleGetStarted} />} />
      <Route path="/features/company" element={<EventCompanyFeaturesPage onGetStarted={handleGetStarted} />} />
      
      {/* Auth Route */}
      <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthForm />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <DashboardRoute />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Guest-only routes */}
      <Route path="/budget" element={
        <ProtectedRoute>
          <DashboardLayout>
            <BudgetPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/todos" element={
        <ProtectedRoute>
          <DashboardLayout>
            <TodoPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/gallery" element={
        <ProtectedRoute>
          <DashboardLayout>
            <GalleryPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/notes" element={
        <ProtectedRoute>
          <DashboardLayout>
            <NotesPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/payments" element={
        <ProtectedRoute>
          <DashboardLayout>
            <PaymentPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/vendors" element={
        <ProtectedRoute>
          <DashboardLayout>
            <VendorManager />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/guests" element={
        <ProtectedRoute>
          <DashboardLayout>
            <GuestPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/schedule" element={
        <ProtectedRoute>
          <DashboardLayout>
            <SchedulePage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
