
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Users, Mail, Lock, User, ArrowLeft, Phone, Shield, Settings, HeadphonesIcon, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { set } from 'date-fns';

interface AuthFormProps {
  onLogin: (type: 'guest' | 'eventCompany') => void;
  onRegister: (type: 'eventCompany') => void;
}

export const AuthForm = ({ onLogin, onRegister }: AuthFormProps) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'guest' | 'eventCompany'>('eventCompany');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    // companyName: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    userType: 'superAdmin' as 'superAdmin' | 'logistics' | 'rsvp' | 'helpDesk',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Form submitted', { isLogin, userType, formData });
    
  
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (!formData.userType) {
      toast({
        title: "Error",
        description: "Please select a role",
        variant: "destructive"
      });
      return;
    }

    // if (!isLogin && userType === 'eventCompany' && !formData.companyName) {
    //   toast({
    //     title: "Error",
    //     description: "Company name is required",
    //     variant: "destructive"
    //   });
    //   return;
    // }

    try {
      console.log(formData,'formData')
      if (isLogin) {
        // Handle Login
        const response = await loginUser('https://miosync-main-server-production.up.railway.app/api/v2/auth/login', formData);
        console.log('Login data:', response);

        localStorage.setItem('token', response?.data?.access_token);
        
        // Store user role from API response
        const userRole = response?.data?.userType || response?.data?.role || 'superAdmin';
        localStorage.setItem('userRole', userRole);
        console.log('Stored user role:', userRole);
        
        onLogin(userType);
        toast({
          title: "Success",
          description: `Welcome back! Logged in as ${userType}`,
        });
        
        // Navigate based on user type
        navigate(userType === 'eventCompany' ? '/event-management' : '/dashboard');
      } else {
        // Handle Registration
        if (userType === 'eventCompany') {
          const response = await registerUser('https://miosync-main-server-production.up.railway.app/api/v2/auth/register', formData);
          console.log('Registration successful:', response);
          
          // Store user role from registration form data
          localStorage.setItem('userRole', formData.userType);
          console.log('Stored user role from registration:', formData.userType);
          
          onRegister(userType);
          toast({
            title: "Registration Started",
            description: `Account created successfully as ${formData.userType === 'superAdmin' ? 'Super Admin' : formData.userType === 'helpDesk' ? 'Help Desk Manager' : formData.userType === 'logistics' ? 'Logistics Manager' : 'RSVP Manager'}. Please complete the payment to finish registration`,
          });
          
          // Navigate to event management dashboard for event company registration
          navigate('/event-management');
        } else {
          // Guest registration - direct login after registration
          const response = await registerUser('https://miosync-main-server-production.up.railway.app/api/v2/auth/register', formData);
          console.log('Guest registration successful:', response);
          
          // Store user role from registration form data
          localStorage.setItem('userRole', formData.userType);
          console.log('Stored user role from guest registration:', formData.userType);
          
          onLogin(userType);
          toast({
            title: "Success",
            description: `Account created successfully as ${formData.userType === 'superAdmin' ? 'Super Admin' : formData.userType === 'helpDesk' ? 'Help Desk Manager' : formData.userType === 'logistics' ? 'Logistics Manager' : 'RSVP Manager'}!`,
          });
          
          // Navigate to guest dashboard
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.response.data.message, 
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }

  };


  async function registerUser(apiUrl: string, formData: any) {
  try {
    const response = await axios.post(apiUrl, {
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      // companyName: formData.companyName,
      phoneNumber: formData.phoneNumber,
      firstName: formData.firstName,
      lastName: formData.lastName,
      userType: formData.userType
    });
    // Do something with response if needed
    return response.data;
  
  } catch (error) {
    // Handle error appropriately
    console.error(error);
    throw error;
  }
}

async function loginUser(apiUrl: string, formData: any) {
  try {
    const response = await axios.post(apiUrl, {
      email: formData.email,
      password: formData.password,
      userType: formData.userType
    });
    // Do something with response if needed
    return response.data;
  
  } catch (error) {
    // Handle error appropriately
    console.error(error);
    throw error;
  }
}

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
              alt="Flambae Hospitality Logo" 
              className="h-16 md:h-20 w-auto drop-shadow-lg"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">Welcome to Flambae Hospitality</h1>
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
        {/* <div className="space-y-3 mb-4 md:mb-6">
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
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-4">

                         {!isLogin && (
              <div className="space-y-2">
              <Label htmlFor="firstname" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>First Name</span>
              </Label>
                <Input
                id="firstname"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="rounded-2xl transition-all duration-300"
                placeholder="enter your first name"
                required
                disabled={isLoading}
              />
              </div>
              )
              }

              {!isLogin && (
              <div className="space-y-2">
              <Label htmlFor="lastname" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Last Name</span>
              </Label>
                <Input
                id="lastname"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="rounded-2xl transition-all duration-300"
                placeholder="enter your last name"
                required
                disabled={isLoading}
              />
              </div>
              )
              }
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

          {/* {!isLogin && userType === 'eventCompany' && (
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
          )} */}

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


           {!isLogin && (
              <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Phone Number</span>
              </Label>
                <Input
                id="phone"
                type="phone"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="rounded-2xl transition-all duration-300"
                placeholder="enter your phone number"
                required
                disabled={isLoading}
              />
              </div>
              )}

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Select Your Role</span>
                </Label>
                <Select 
                  value={formData.userType} 
                  onValueChange={(value: 'superAdmin' | 'logistics' | 'rsvp' | 'helpDesk') => 
                    setFormData({...formData, userType: value})
                  }
                >
                  <SelectTrigger className="w-full rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-300">
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superAdmin">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-purple-600" />
                        <div>
                          <div className="font-medium">Super Admin</div>
                          <div className="text-xs text-gray-500">Full system access</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="logistics">
                      <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium">Logistics Manager</div>
                          <div className="text-xs text-gray-500">Manage transportation & logistics</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="helpDesk">
                      <div className="flex items-center space-x-2">
                        <HeadphonesIcon className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium">Help Desk Manager</div>
                          <div className="text-xs text-gray-500">Manage guest support tickets</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="rsvp">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4 text-orange-600" />
                        <div>
                          <div className="font-medium">RSVP Manager</div>
                          <div className="text-xs text-gray-500">Manage guest responses & invitations</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>




          <Button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 md:py-4 text-base md:text-lg rounded-2xl transition-all duration-300 hover:scale-105 ${
              userType === 'eventCompany' 
                ? 'bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white shadow-lg' 
                : 'bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white shadow-lg'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : (userType === 'eventCompany' ? 'Register' : 'Create Account'))}
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
