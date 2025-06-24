
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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-25 via-blush-50 to-lavender-50 flex items-center justify-center p-4 relative overflow-hidden" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f8d7da' fill-opacity='0.1' fill-rule='nonzero'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
           }}>
        {/* Floating floral elements */}
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

        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/74588944-94cf-4442-8a35-20fd018532a2.png" 
                alt="Meliora Moments Logo" 
                className="h-20 w-auto drop-shadow-lg"
              />
            </div>
            <h1 className="text-4xl font-serif text-slate-700 mb-2">Complete Your Registration</h1>
            <p className="text-slate-600 text-lg font-light">Secure payment to activate your account</p>
          </div>

          <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-rose-300 via-pink-300 to-purple-300"></div>
            <CardHeader className="text-center pt-8 pb-6">
              <CardTitle className="text-2xl font-serif text-slate-700 flex items-center justify-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full">
                  <CreditCard className="h-5 w-5 text-rose-600" />
                </div>
                <span>Payment Details</span>
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg font-light">
                One-time setup fee: <span className="font-medium text-rose-700">$49.99</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <div className="space-y-3">
                <Label htmlFor="cardNumber" className="text-slate-700 font-medium flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span>Card Number</span>
                </Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="h-12 border-2 border-rose-200 focus:border-rose-400 focus:ring-rose-300 rounded-2xl bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="expiryDate" className="text-slate-700 font-medium">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="h-12 border-2 border-rose-200 focus:border-rose-400 focus:ring-rose-300 rounded-2xl bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="cvv" className="text-slate-700 font-medium">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="h-12 border-2 border-rose-200 focus:border-rose-400 focus:ring-rose-300 rounded-2xl bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={() => setShowPayment(false)}
                  variant="outline"
                  className="flex-1 h-12 border-2 border-slate-300 hover:border-rose-300 hover:bg-rose-50 rounded-2xl font-medium text-slate-700"
                >
                  Back
                </Button>
                <Button 
                  onClick={handlePayment}
                  className="flex-1 h-12 bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 hover:from-rose-500 hover:via-pink-500 hover:to-purple-500 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-25 via-blush-50 to-lavender-50 flex items-center justify-center p-4 relative overflow-hidden"
         style={{ 
           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f8d7da' fill-opacity='0.1' fill-rule='nonzero'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
         }}>
      {/* Floating floral elements */}
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

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/74588944-94cf-4442-8a35-20fd018532a2.png" 
              alt="Meliora Moments Logo" 
              className="h-24 w-auto drop-shadow-lg"
            />
          </div>
          <h1 className="text-5xl font-serif text-slate-700 mb-3 leading-tight">
            Meliora Moments
          </h1>
          <p className="text-2xl text-slate-600 font-light mb-2">Your Wedding OS</p>
          <p className="text-slate-500 text-lg font-light">
            Plan, organize, and celebrate your perfect day
          </p>
        </div>

        <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden transform hover:-translate-y-1 transition-all duration-500">
          <div className="h-2 bg-gradient-to-r from-rose-300 via-pink-300 to-purple-300"></div>
          
          <CardHeader className="space-y-6 pt-8 pb-6">
            {/* User Type Selection */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif text-slate-700 mb-6">Welcome Back</h2>
              <p className="text-slate-600 font-light">Choose your account type to continue</p>
            </div>
            
            <div className="flex rounded-full bg-slate-100/80 p-1.5 backdrop-blur-sm">
              <button
                onClick={() => setUserType('customer')}
                className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                  userType === 'customer'
                    ? 'bg-gradient-to-r from-rose-300 to-pink-300 text-white shadow-lg transform scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Customer</span>
              </button>
              <button
                onClick={() => setUserType('eventCompany')}
                className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                  userType === 'eventCompany'
                    ? 'bg-gradient-to-r from-rose-300 to-pink-300 text-white shadow-lg transform scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                <Building2 className="h-4 w-4" />
                <span>Event Company</span>
              </button>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
              <TabsList className="grid w-full grid-cols-2 bg-slate-100/80 rounded-full p-1">
                <TabsTrigger value="login" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Login</TabsTrigger>
                <TabsTrigger value="register" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6 mt-8">
                <div className="space-y-4 px-2">
                  <div className="space-y-3">
                    <Label htmlFor="loginEmail" className="text-slate-700 font-medium flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-rose-500" />
                      <span>Email Address</span>
                    </Label>
                    <Input
                      id="loginEmail"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="h-12 border-2 border-rose-200 focus:border-rose-400 focus:ring-rose-300 rounded-2xl bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="loginEventCode" className="text-slate-700 font-medium flex items-center space-x-2">
                      <Key className="h-4 w-4 text-rose-500" />
                      <span>Event Code</span>
                    </Label>
                    <Input
                      id="loginEventCode"
                      type="text"
                      placeholder="Enter your event code"
                      value={loginEventCode}
                      onChange={(e) => setLoginEventCode(e.target.value)}
                      className="h-12 border-2 border-rose-200 focus:border-rose-400 focus:ring-rose-300 rounded-2xl bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  <Button 
                    onClick={handleLogin} 
                    className="w-full h-12 bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 hover:from-rose-500 hover:via-pink-500 hover:to-purple-500 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 mt-6"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Access Dashboard
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-6 mt-8">
                <div className="space-y-4 px-2">
                  <div className="space-y-3">
                    <Label htmlFor="registerEmail" className="text-slate-700 font-medium">Email Address</Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="your.email@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="h-12 border-2 border-rose-200 focus:border-rose-400 focus:ring-rose-300 rounded-2xl bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  {userType === 'customer' ? (
                    <>
                      <div className="space-y-3">
                        <Label htmlFor="registerName" className="text-slate-700 font-medium">Couple Names</Label>
                        <Input
                          id="registerName"
                          type="text"
                          placeholder="Sarah & Michael"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          className="h-12 border-2 border-rose-200 focus:border-rose-400 focus:ring-rose-300 rounded-2xl bg-white/80 backdrop-blur-sm"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="weddingDate" className="text-slate-700 font-medium">Wedding Date</Label>
                        <Input
                          id="weddingDate"
                          type="date"
                          value={weddingDate}
                          onChange={(e) => setWeddingDate(e.target.value)}
                          className="h-12 border-2 border-rose-200 focus:border-rose-400 focus:ring-rose-300 rounded-2xl bg-white/80 backdrop-blur-sm"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Label htmlFor="companyName" className="text-slate-700 font-medium">Company Name</Label>
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Your Event Company"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="h-12 border-2 border-rose-200 focus:border-rose-400 focus:ring-rose-300 rounded-2xl bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="registerPhone" className="text-slate-700 font-medium">Phone Number (Optional)</Label>
                    <Input
                      id="registerPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      className="h-12 border-2 border-rose-200 focus:border-rose-400 focus:ring-rose-300 rounded-2xl bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  <Button 
                    onClick={handleRegister}
                    className="w-full h-12 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 mt-6"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Continue to Payment
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        {/* Decorative bottom text */}
        <div className="text-center mt-8 text-slate-500 font-light">
          <p className="text-sm">
            {userType === 'customer' 
              ? 'Access comprehensive wedding planning tools including budget tracking, vendor management, and timeline coordination.'
              : 'Manage events, track RSVPs, coordinate schedules, and provide exceptional client experiences.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};
