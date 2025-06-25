
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomLogo } from "./CustomLogo";
import { 
  Heart, 
  Users, 
  DollarSign, 
  CheckSquare, 
  Calendar,
  Camera,
  MessageSquare,
  CreditCard,
  MapPin,
  Building2,
  Headphones,
  ClipboardList,
  Car,
  BedDouble,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const guestFeatures = [
    { icon: Users, title: "Guest Management", description: "Manage RSVPs and guest information" },
    { icon: DollarSign, title: "Budget Tracker", description: "Track expenses and manage your wedding budget" },
    { icon: CheckSquare, title: "Task Manager", description: "Keep track of wedding planning tasks" },
    { icon: Calendar, title: "Event Schedule", description: "Organize your wedding timeline" },
    { icon: Camera, title: "Photo Gallery", description: "Share and organize wedding photos" },
    { icon: MessageSquare, title: "Collaboration", description: "Communicate with your wedding team" },
    { icon: CreditCard, title: "Payment Management", description: "Handle wedding-related payments" },
    { icon: MapPin, title: "Vendor Management", description: "Organize and communicate with vendors" }
  ];

  const companyFeatures = [
    { icon: Building2, title: "Event Management", description: "Comprehensive event planning dashboard" },
    { icon: Users, title: "Guest System", description: "Advanced guest management and tracking" },
    { icon: Car, title: "Logistics Management", description: "Transportation and logistics coordination" },
    { icon: BedDouble, title: "Room Allocation", description: "Manage guest accommodations" },
    { icon: ClipboardList, title: "Task Allocation", description: "Assign and track team tasks" },
    { icon: Headphones, title: "Help Desk", description: "Customer support integration" },
    { icon: MessageSquare, title: "AI Chatbot", description: "Automated customer assistance" },
    { icon: Calendar, title: "Event Scheduling", description: "Professional event timeline management" }
  ];

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

      {/* Header */}
      <div className="relative z-10 bg-white/95 backdrop-blur-xl border-b border-rose-200/50 romantic-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <CustomLogo size="md" showTagline={true} />
            <div className="flex items-center space-x-4">
              <Link to="/features/guest">
                <Button variant="outline" className="border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50 text-slate-700 rounded-2xl transition-all duration-300">
                  Guest Features
                </Button>
              </Link>
              <Link to="/features/company">
                <Button variant="outline" className="border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-slate-700 rounded-2xl transition-all duration-300">
                  Company Features
                </Button>
              </Link>
              <Button 
                onClick={onGetStarted}
                className="romantic-button"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Plan Your Perfect Wedding
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-light mb-8 max-w-3xl mx-auto">
            Whether you're a couple planning your dream wedding or an event company managing multiple celebrations, 
            we have the perfect tools for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/features/guest">
              <Button size="lg" className="romantic-button text-lg px-8 py-4">
                <Heart className="mr-2 h-5 w-5" />
                For Couples
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/features/company">
              <Button size="lg" variant="outline" className="border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 text-purple-700 rounded-2xl text-lg px-8 py-4">
                <Building2 className="mr-2 h-5 w-5" />
                For Event Companies
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Guest Dashboard Preview */}
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-rose-200/50 romantic-shadow rounded-3xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-serif elegant-text-gradient">For Couples</CardTitle>
              <CardDescription className="text-slate-600 text-lg">
                Everything you need to plan your dream wedding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {guestFeatures.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-rose-50/50 rounded-xl">
                    <feature.icon className="h-5 w-5 text-rose-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{feature.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/features/guest">
                <Button className="w-full mt-6 romantic-button">
                  Explore Guest Features
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Event Company Preview */}
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-purple-200/50 romantic-shadow rounded-3xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-serif bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">For Event Companies</CardTitle>
              <CardDescription className="text-slate-600 text-lg">
                Professional tools for managing multiple events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {companyFeatures.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50/50 rounded-xl">
                    <feature.icon className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{feature.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/features/company">
                <Button className="w-full mt-6 bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white rounded-2xl">
                  Explore Company Features
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">
            Ready to Start Planning?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of couples and event professionals who trust Meliora Moments 
            to make their special day perfect
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg" 
            className="romantic-button text-xl px-12 py-6"
          >
            <Heart className="mr-3 h-6 w-6" />
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
};
