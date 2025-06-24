
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Sparkles, Users, Building2, CreditCard, Mail, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (userType: 'customer' | 'eventCompany') => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [userType, setUserType] = useState<'customer' | 'eventCompany'>('customer');
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginEventCode, setLoginEventCode] = useState('');
  
  // Registration form states
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  // Payment states
  const [showPayment, setShowPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  const { toast } = useToast();

  const handleLogin = () => {
    if (loginEmail && loginEventCode) {
      onLogin(userType);
      toast({
        title: "Welcome back!",
        description: `You've successfully logged in to your ${userType} dashboard.`,
      });
    } else {
      toast({
        title: "Please fill in all fields",
        description: "Both email and event code are required",
        variant: "destructive"
      });
    }
  };

  const handleRegister = () => {
    if (userType === 'customer' && (!registerEmail || !registerName || !weddingDate)) {
      toast({
        title: "Please fill in all fields",
        description: "Email, name, and wedding date are required",
        variant: "destructive"
      });
      return;
    }
    
    if (userType === 'eventCompany' && (!registerEmail || !companyName)) {
      toast({
        title: "Please fill in all fields", 
        description: "Email and company name are required",
        variant: "destructive"
      });
      return;
    }

    setShowPayment(true);
  };

  const handlePayment = () => {
    if (!cardNumber || !expiryDate || !cvv) {
      toast({
        title: "Please fill in payment details",
        description: "All payment fields are required",
        variant: "destructive"
      });
      return;
    }

    // Simulate payment processing
    toast({
      title: "Payment Successful!",
      description: "Your event code will be sent to your email shortly.",
    });
    
    // Reset form
    setShowPayment(false);
    setActiveTab('login');
    setRegisterEmail('');
    setRegisterName('');
    setRegisterPhone('');
    setWeddingDate('');
    setCompanyName('');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
  };

  if (showPayment) {
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
              <img 
                src="/placeholder.svg" 
                alt="Meliora Moments Logo" 
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-4">Complete Your Registration</h1>
            <p className="text-gray-600 text-lg">Secure payment to activate your account</p>
          </div>

          <Card className="glass-effect border-0 shadow-2xl modern-shadow">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-800 flex items-center justify-center space-x-2">
                <CreditCard className="h-6 w-6" />
                <span>Payment Details</span>
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                One-time setup fee: $49.99
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="cardNumber" className="text-base font-semibold text-gray-700">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="h-12 border-2 border-gray-200 focus:border-rose-400 focus:ring-rose-400 rounded-xl text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="expiryDate" className="text-base font-semibold text-gray-700">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="h-12 border-2 border-gray-200 focus:border-rose-400 focus:ring-rose-400 rounded-xl text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="cvv" className="text-base font-semibold text-gray-700">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="h-12 border-2 border-gray-200 focus:border-rose-400 focus:ring-rose-400 rounded-xl text-base"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={() => setShowPayment(false)}
                  variant="outline"
                  className="flex-1 h-12 border-2 border-gray-300 hover:border-gray-400 rounded-xl text-base"
                >
                  Back
                </Button>
                <Button 
                  onClick={handlePayment}
                  className="flex-1 h-12 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 text-white font-semibold text-base rounded-xl"
                >
                  Complete Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <img 
              src="/placeholder.svg" 
              alt="Meliora Moments Logo" 
              className="h-16 w-auto"
            />
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

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6 mt-6">
                <CardTitle className="text-center text-3xl font-bold text-gray-800">Welcome Back</CardTitle>
                <CardDescription className="text-center text-gray-600 text-lg">
                  Enter your credentials to access your dashboard
                </CardDescription>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="loginEmail" className="text-base font-semibold text-gray-700 flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Email Address</span>
                    </Label>
                    <Input
                      id="loginEmail"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-rose-400 focus:ring-rose-400 rounded-xl text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="loginEventCode" className="text-base font-semibold text-gray-700 flex items-center space-x-2">
                      <Key className="h-4 w-4" />
                      <span>Event Code</span>
                    </Label>
                    <Input
                      id="loginEventCode"
                      type="text"
                      placeholder="Enter your event code"
                      value={loginEventCode}
                      onChange={(e) => setLoginEventCode(e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-rose-400 focus:ring-rose-400 rounded-xl text-base"
                    />
                  </div>

                  <Button 
                    onClick={handleLogin} 
                    className="w-full h-12 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Access Dashboard
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-6 mt-6">
                <CardTitle className="text-center text-3xl font-bold text-gray-800">Create Account</CardTitle>
                <CardDescription className="text-center text-gray-600 text-lg">
                  Register for your {userType === 'customer' ? 'wedding planning' : 'event management'} dashboard
                </CardDescription>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="registerEmail" className="text-base font-semibold text-gray-700">Email Address</Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="your.email@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-rose-400 focus:ring-rose-400 rounded-xl text-base"
                    />
                  </div>

                  {userType === 'customer' ? (
                    <>
                      <div className="space-y-3">
                        <Label htmlFor="registerName" className="text-base font-semibold text-gray-700">Couple Names</Label>
                        <Input
                          id="registerName"
                          type="text"
                          placeholder="Sarah & Michael"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          className="h-12 border-2 border-gray-200 focus:border-rose-400 focus:ring-rose-400 rounded-xl text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="weddingDate" className="text-base font-semibold text-gray-700">Wedding Date</Label>
                        <Input
                          id="weddingDate"
                          type="date"
                          value={weddingDate}
                          onChange={(e) => setWeddingDate(e.target.value)}
                          className="h-12 border-2 border-gray-200 focus:border-rose-400 focus:ring-rose-400 rounded-xl text-base"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Label htmlFor="companyName" className="text-base font-semibold text-gray-700">Company Name</Label>
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Your Event Company"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="h-12 border-2 border-gray-200 focus:border-rose-400 focus:ring-rose-400 rounded-xl text-base"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="registerPhone" className="text-base font-semibold text-gray-700">Phone Number (Optional)</Label>
                    <Input
                      id="registerPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-rose-400 focus:ring-rose-400 rounded-xl text-base"
                    />
                  </div>

                  <Button 
                    onClick={handleRegister}
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Continue to Payment
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
