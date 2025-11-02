
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, Users, Calendar, DollarSign, CheckSquare, ArrowRight, Sparkles, Camera, Gift, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { CustomLogo } from "./CustomLogo";

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f8d7da' fill-opacity='0.4' fill-rule='nonzero'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-24 h-24 md:w-32 md:h-32 opacity-20 animate-float">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-rose-200 to-pink-300 blur-xl animate-pulse"></div>
        </div>
        <div className="absolute top-40 right-20 w-32 h-32 md:w-48 md:h-48 opacity-15 animate-float-delayed">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-lavender-200 to-purple-200 blur-2xl animate-pulse delay-1000"></div>
        </div>
        <div className="absolute bottom-20 left-1/3 w-28 h-28 md:w-40 md:h-40 opacity-10 animate-float">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-200 to-yellow-200 blur-xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex flex-col sm:flex-row items-center justify-between p-4 md:p-8 gap-4 sm:gap-0">
        <CustomLogo size="sm" showTagline={false} className="animate-fade-in" />
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/features/guest">
              <Button variant="ghost" className="text-slate-700 hover:bg-white/50 transition-all duration-300 text-sm sm:text-base">
                For Couples
              </Button>
            </Link>
            <Link to="/features/company">
              <Button variant="ghost" className="text-slate-700 hover:bg-white/50 transition-all duration-300 text-sm sm:text-base">
                For Companies
              </Button>
            </Link>
          </div>
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 text-white hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 text-sm sm:text-base px-4 sm:px-6">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in-up">
          <Badge className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 border-rose-200 px-4 py-2 text-sm font-medium animate-bounce-gentle">
            <Sparkles className="h-4 w-4 mr-2" />
            Your Dream Wedding Awaits
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight animate-text-shimmer">
            Plan Your Perfect
            <br />
            <span className="relative">
              Wedding
              <div className="absolute -right-4 -top-2 md:-right-8 md:-top-4">
                <Heart className="h-8 w-8 md:h-12 md:w-12 text-rose-400 animate-pulse" />
              </div>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            From guest management to budget tracking, create unforgettable moments with our comprehensive wedding planning platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-rose-400 via-pink-400 to-purple-500 text-white hover:from-rose-500 hover:via-pink-500 hover:to-purple-600 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 px-8 py-4 text-lg font-medium animate-pulse-glow"
              >
                Start Planning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/features/guest">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto border-2 border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-700 transition-all duration-300 px-8 py-4 text-lg"
              >
                View Features
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-slate-800 mb-4">Everything You Need</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Comprehensive tools to make your wedding planning seamless and stress-free</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
          {[
            {
              icon: Users,
              title: "Guest Management",
              description: "Track RSVPs, manage invitations, and organize seating arrangements effortlessly",
              gradient: "from-rose-400 to-pink-500",
              bgGradient: "from-rose-50 to-pink-50"
            },
            // {
            //   icon: DollarSign,
            //   title: "Budget Tracking",
            //   description: "Keep your finances on track with detailed budget management and expense tracking",
            //   gradient: "from-emerald-400 to-green-500",
            //   bgGradient: "from-emerald-50 to-green-50"
            // },
            {
              icon: CheckSquare,
              title: "Task Management",
              description: "Stay organized with comprehensive to-do lists and timeline management",
              gradient: "from-blue-400 to-indigo-500",
              bgGradient: "from-blue-50 to-indigo-50"
            },
            {
              icon: Calendar,
              title: "Event Scheduling",
              description: "Plan every detail of your special day with our intuitive scheduling tools",
              gradient: "from-purple-400 to-violet-500",
              bgGradient: "from-purple-50 to-violet-50"
            },
            // {
            //   icon: Camera,
            //   title: "Photo Gallery",
            //   description: "Collect and organize memories from your engagement to your honeymoon",
            //   gradient: "from-amber-400 to-orange-500",
            //   bgGradient: "from-amber-50 to-orange-50"
            // },
            {
              icon: MessageCircle,
              title: "Vendor Communication",
              description: "Streamline communication with all your wedding vendors in one place",
              gradient: "from-teal-400 to-cyan-500",
              bgGradient: "from-teal-50 to-cyan-50"
            }
          ].map((feature, index) => (
            <Card 
              key={index} 
              className={`bg-gradient-to-br ${feature.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 md:p-8 text-center">
                <div className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-500 text-white py-12 md:py-20 mx-4 md:mx-8 rounded-3xl mb-8 md:mb-12 shadow-2xl">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif mb-4 md:mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-lg md:text-xl text-purple-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Join thousands of couples who have planned their perfect wedding with Flambae Hospitality
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button 
                size="lg" 
                variant="secondary"
                className="w-full sm:w-auto bg-white text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg font-medium"
              >
                Start Your Free Plan
                <Heart className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/features/guest">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto border-2 border-white  text-purple-600
                hover:bg-white hover:text-purple-600 transition-all duration-300 px-8 py-4 text-lg"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 md:py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <CustomLogo size="md" showTagline={true} className="mb-6" />
          <p className="text-slate-500 text-sm">
            © 2024 Flambae Hospitality. Crafted with <Heart className="inline-block h-4 w-4 text-rose-400 mx-1" /> for your special day.
          </p>
        </div>
      </footer>
    </div>
  );
};
