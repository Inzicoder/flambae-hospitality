
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  onLogin: (type: 'guest' | 'eventCompany') => void;
  onRegister: (type: 'eventCompany') => void;
}

export const AuthForm = ({ onLogin, onRegister }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'guest' | 'eventCompany'>('guest');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (isLogin) {
      onLogin(userType);
    } else {
      if (userType === 'eventCompany') {
        onRegister('eventCompany');
      } else {
        onLogin('guest');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-25 via-blush-50 to-lavender-50 relative overflow-hidden"
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

      <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl romantic-shadow max-w-md w-full mx-4 border-2 border-rose-200/30">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/df5b7422-1f97-4754-b2f4-5822f3b683c0.png" 
              alt="Meliora Moments Logo" 
              className="h-20 w-auto drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-serif text-gradient mb-2">Welcome to Meliora Moments</h1>
          <p className="text-slate-600 font-light">Your Wedding Planning Journey Begins Here</p>
        </div>

        {/* Toggle between Login and Register */}
        <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-2xl">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
              isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
              !isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Register
          </button>
        </div>

        {/* User Type Selection */}
        <div className="space-y-3 mb-6">
          <Label className="text-sm font-medium text-gray-700">I am a:</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setUserType('guest')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                userType === 'guest' 
                  ? 'border-rose-400 bg-rose-50 text-rose-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Heart className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Guest</span>
            </button>
            <button
              onClick={() => setUserType('eventCompany')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                userType === 'eventCompany' 
                  ? 'border-purple-400 bg-purple-50 text-purple-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Users className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Event Company</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="rounded-2xl"
              required
            />
          </div>

          {!isLogin && userType === 'eventCompany' && (
            <div className="space-y-2">
              <Label htmlFor="companyName" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Company Name</span>
              </Label>
              <Input
                id="companyName"
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="rounded-2xl"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Password</span>
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="rounded-2xl"
              required
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>Confirm Password</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="rounded-2xl"
                required
              />
            </div>
          )}

          <Button 
            type="submit"
            className={`w-full py-4 text-lg rounded-2xl ${
              userType === 'guest' 
                ? 'romantic-button' 
                : 'bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500'
            }`}
          >
            {isLogin ? 'Sign In' : (userType === 'eventCompany' ? 'Register & Pay' : 'Create Account')}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Crafted with <Heart className="inline-block h-4 w-4 text-rose-400 align-top mx-1" /> for unforgettable moments
          </p>
        </div>
      </div>
    </div>
  );
};
