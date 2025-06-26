
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Users, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'guest' | 'eventCompany'>('guest');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    companyName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) return;
    
    if (!isLogin && formData.password !== formData.confirmPassword) return;
    
    if (!isLogin && userType === 'eventCompany' && !formData.companyName) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (!error) {
          navigate('/dashboard');
        }
      } else {
        const userData = {
          full_name: formData.fullName,
          user_type: userType,
          company_name: userType === 'eventCompany' ? formData.companyName : null
        };
        
        const { error } = await signUp(formData.email, formData.password, userData);
        if (!error) {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-25 via-blush-50 to-lavender-50 relative overflow-hidden p-4"
         style={{ 
           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f8d7da' fill-opacity='0.1' fill-rule='nonzero'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
         }}>
      {/* Floating romantic elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-24 h-24 md:w-32 md:h-32 opacity-20">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-rose-200 to-pink-300 blur-xl animate-pulse"></div>
        </div>
        <div className="absolute top-40 right-20 w-32 h-32 md:w-48 md:h-48 opacity-15">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-lavender-200 to-purple-200 blur-2xl animate-pulse delay-1000"></div>
        </div>
        <div className="absolute bottom-20 left-1/3 w-28 h-28 md:w-40 md:h-40 opacity-10">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-200 to-yellow-200 blur-xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Back Button */}
      <Link to="/" className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
        <Button variant="outline" size="sm" className="border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50 text-slate-700 rounded-2xl transition-all duration-300">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Back</span>
        </Button>
      </Link>

      <div className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 border-2 border-rose-200/30 animate-fade-in-up">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex justify-center mb-4 md:mb-6">
            <img 
              src="/lovable-uploads/df5b7422-1f97-4754-b2f4-5822f3b683c0.png" 
              alt="Meliora Moments Logo" 
              className="h-16 md:h-20 w-auto drop-shadow-lg"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">Welcome to Meliora Moments</h1>
          <p className="text-slate-600 font-light text-sm md:text-base">Your Wedding Planning Journey Begins Here</p>
        </div>

        {/* Toggle between Login and Register */}
        <div className="flex space-x-2 mb-4 md:mb-6 bg-gray-100 p-1 rounded-2xl">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              !isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Register
          </button>
        </div>

        {/* User Type Selection */}
        <div className="space-y-3 mb-4 md:mb-6">
          <Label className="text-sm font-medium text-gray-700">I am a:</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUserType('guest')}
              className={`p-3 md:p-4 rounded-2xl border-2 transition-all duration-300 ${
                userType === 'guest' 
                  ? 'border-rose-400 bg-rose-50 text-rose-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Heart className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Guest</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('eventCompany')}
              className={`p-3 md:p-4 rounded-2xl border-2 transition-all duration-300 ${
                userType === 'eventCompany' 
                  ? 'border-purple-400 bg-purple-50 text-purple-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Users className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2" />
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
              className="rounded-2xl transition-all duration-300"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Full Name</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="rounded-2xl transition-all duration-300"
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>
          )}

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
                className="rounded-2xl transition-all duration-300"
                placeholder="Enter your company name"
                required
                disabled={isLoading}
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
              className="rounded-2xl transition-all duration-300"
              placeholder="Enter your password"
              required
              disabled={isLoading}
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
                className="rounded-2xl transition-all duration-300"
                placeholder="Confirm your password"
                required
                disabled={isLoading}
              />
            </div>
          )}

          <Button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 md:py-4 text-base md:text-lg rounded-2xl transition-all duration-300 hover:scale-105 ${
              userType === 'guest' 
                ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-purple-500 hover:from-rose-500 hover:via-pink-500 hover:to-purple-600 text-white shadow-lg' 
                : 'bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white shadow-lg'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 md:mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Crafted with <Heart className="inline-block h-4 w-4 text-rose-400 align-top mx-1" /> for unforgettable moments
          </p>
        </div>
      </div>
    </div>
  );
};
