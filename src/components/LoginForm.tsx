
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Sparkles, Users, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (userType: 'customer' | 'eventCompany') => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [userType, setUserType] = useState<'customer' | 'eventCompany'>('customer');
  const [loginMethod, setLoginMethod] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [eventCode, setEventCode] = useState('');
  const { toast } = useToast();

  const handleLogin = () => {
    if (loginMethod === 'email' && email) {
      onLogin(userType);
      toast({
        title: "Welcome back!",
        description: `You've successfully logged in as ${userType === 'customer' ? 'a customer' : 'an event company'}.`,
      });
    } else if (loginMethod === 'code' && eventCode) {
      onLogin(userType);
      toast({
        title: "Welcome!",
        description: `You've successfully accessed your ${userType === 'customer' ? 'customer' : 'event company'} dashboard.`,
      });
    } else {
      toast({
        title: "Please fill in the required field",
        description: loginMethod === 'email' ? "Enter your email address" : "Enter your event code",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fade-in-up">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 p-4 rounded-2xl shadow-2xl animate-pulse-glow">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gradient mb-4">
            Meliora Moments
          </h1>
          <p className="text-2xl text-gray-700 font-semibold mb-2">Your Wedding OS</p>
          <p className="text-gray-600 text-lg">
            Plan, organize, and celebrate your perfect day
          </p>
        </div>

        <Card className="glass-effect border-0 shadow-2xl modern-shadow hover-lift animate-slide-in-right">
          <CardHeader className="space-y-6 pb-8">
            <CardTitle className="text-center text-3xl font-bold text-gray-800">Welcome Back</CardTitle>
            <CardDescription className="text-center text-gray-600 text-lg">
              Choose your account type to continue
            </CardDescription>
            
            {/* User Type Selection */}
            <div className="flex rounded-xl bg-gray-100/80 p-1.5 backdrop-blur-sm">
              <button
                onClick={() => setUserType('customer')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  userType === 'customer'
                    ? 'bg-white text-gray-900 shadow-lg transform scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Customer</span>
              </button>
              <button
                onClick={() => setUserType('eventCompany')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  userType === 'eventCompany'
                    ? 'bg-white text-gray-900 shadow-lg transform scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Building2 className="h-4 w-4" />
                <span>Event Company</span>
              </button>
            </div>

            {/* Login Method Selection */}
            <div className="flex rounded-xl bg-gray-100/80 p-1.5 backdrop-blur-sm">
              <button
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  loginMethod === 'email'
                    ? 'bg-white text-gray-900 shadow-lg transform scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                Email Login
              </button>
              <button
                onClick={() => setLoginMethod('code')}
                className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  loginMethod === 'code'
                    ? 'bg-white text-gray-900 shadow-lg transform scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                Event Code
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {loginMethod === 'email' ? (
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-semibold text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-2 border-gray-200 focus:border-rose-400 focus:ring-rose-400 rounded-xl text-base transition-all duration-300"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <Label htmlFor="eventCode" className="text-base font-semibold text-gray-700">Event Code</Label>
                <Input
                  id="eventCode"
                  type="text"
                  placeholder="Enter your unique event code"
                  value={eventCode}
                  onChange={(e) => setEventCode(e.target.value)}
                  className="h-12 border-2 border-gray-200 focus:border-rose-400 focus:ring-rose-400 rounded-xl text-base transition-all duration-300"
                />
              </div>
            )}

            <Button 
              onClick={handleLogin} 
              className="w-full h-12 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Access {userType === 'customer' ? 'Customer' : 'Event Company'} Dashboard
            </Button>

            <div className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
              <p className="mb-2">
                <strong>Customer:</strong> Access all wedding planning features including budget tracking, todos, gallery, and more.
              </p>
              <p>
                <strong>Event Company:</strong> Specialized tools for RSVP management, event scheduling, guest management, and travel coordination.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
