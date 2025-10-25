
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users } from "lucide-react";
import { CustomLogo } from "./CustomLogo";

interface LoginFormProps {
  onLogin: (type: 'guest' | 'eventCompany') => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would authenticate against a backend service
    // For this example, we'll just log the credentials
    console.log('Email:', email, 'Password:', password);
    // After successful login, call the onLogin function
    // onLogin('customer'); // Or 'eventCompany' based on user selection
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
            <CustomLogo size="lg" showTagline={true} />
          </div>
          <h1 className="text-2xl font-elegant elegant-text-gradient mb-2">Welcome to Your Dream Wedding</h1>
          <p className="text-slate-600 font-light script-accent text-lg">Your Planning Journey Begins Here</p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => onLogin('guest')}
            className="w-full py-4 text-lg bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <Heart className="mr-3 h-5 w-5" />
            Continue as Guest
          </Button>

          <Button 
            onClick={() => onLogin('eventCompany')}
            className="w-full py-4 text-lg bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <Users className="mr-3 h-5 w-5" />
            Continue as Event Company
          </Button>
        </div>

        {/* Footer and Romantic Touch */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm font-classic">
            Crafted with <Heart className="inline-block h-4 w-4 text-rose-400 align-top mx-1" /> for unforgettable moments
          </p>
        </div>
      </div>
    </div>
  );
};
