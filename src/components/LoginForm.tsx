
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: () => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [eventCode, setEventCode] = useState('');
  const { toast } = useToast();

  const handleLogin = () => {
    if (loginMethod === 'email' && email) {
      onLogin();
      toast({
        title: "Welcome back!",
        description: "You've successfully logged into your wedding dashboard.",
      });
    } else if (loginMethod === 'code' && eventCode) {
      onLogin();
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
};
