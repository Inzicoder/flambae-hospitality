
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
  ArrowLeft,
  Star,
  Check
} from "lucide-react";
import { Link } from "react-router-dom";

interface GuestFeaturesPageProps {
  onGetStarted: () => void;
}

export const GuestFeaturesPage = ({ onGetStarted }: GuestFeaturesPageProps) => {
  const features = [
    { 
      icon: Users, 
      title: "Guest Management", 
      description: "Effortlessly manage RSVPs, track guest responses, and organize your guest list with detailed information and preferences.",
      benefits: ["RSVP tracking", "Guest preferences", "Dietary restrictions", "Plus-one management"]
    },
    { 
      icon: DollarSign, 
      title: "Budget Tracker", 
      description: "Keep your wedding finances on track with our comprehensive budget management tools and expense tracking.",
      benefits: ["Expense categories", "Real-time tracking", "Budget alerts", "Vendor payments"]
    },
    { 
      icon: CheckSquare, 
      title: "Task Manager", 
      description: "Stay organized with customizable to-do lists, deadlines, and priority management for all your wedding tasks.",
      benefits: ["Priority tasks", "Due dates", "Task categories", "Progress tracking"]
    },
    { 
      icon: Calendar, 
      title: "Event Schedule", 
      description: "Create and manage your wedding timeline, from engagement to honeymoon, with detailed scheduling tools.",
      benefits: ["Timeline creation", "Vendor coordination", "Guest notifications", "Schedule sharing"]
    },
    { 
      icon: Camera, 
      title: "Photo Gallery", 
      description: "Collect, organize, and share your wedding photos with family and friends in beautiful galleries.",
      benefits: ["Photo organization", "Guest uploads", "Private sharing", "Memory preservation"]
    },
    { 
      icon: MessageSquare, 
      title: "Collaboration", 
      description: "Communicate seamlessly with your wedding party, family, and vendors through integrated messaging.",
      benefits: ["Team messaging", "Vendor communication", "File sharing", "Real-time updates"]
    },
    { 
      icon: CreditCard, 
      title: "Payment Management", 
      description: "Handle all wedding-related payments, track expenses, and manage vendor payments in one place.",
      benefits: ["Payment tracking", "Invoice management", "Expense reports", "Financial overview"]
    },
    { 
      icon: MapPin, 
      title: "Vendor Management", 
      description: "Find, communicate with, and manage all your wedding vendors with detailed profiles and contact information.",
      benefits: ["Vendor directory", "Contract management", "Communication tools", "Reviews & ratings"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-25 via-blush-50 to-lavender-50 relative overflow-hidden"
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
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/95 backdrop-blur-xl border-b border-rose-200/50 romantic-shadow sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50 text-slate-700 rounded-2xl smooth-transition">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              </Link>
              <CustomLogo size="sm" showTagline={false} />
            </div>
            <Button 
              onClick={onGetStarted}
              size="sm"
              className="romantic-button"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-rose-400 to-pink-500 rounded-3xl flex items-center justify-center romantic-shadow smooth-transition hover:scale-105">
            <Heart className="h-8 w-8 md:h-10 md:w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold elegant-text-gradient mb-4 md:mb-6">
            Guest Dashboard Features
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-light mb-6 md:mb-8 max-w-3xl mx-auto px-4">
            Everything you need to plan your perfect wedding, from guest management to budget tracking, 
            all in one beautiful and intuitive platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 fill-current" />
              <span>Easy to use</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 fill-current" />
              <span>Mobile friendly</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 fill-current" />
              <span>Secure & private</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="responsive-card animate-stagger">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 smooth-transition hover:scale-105">
                    <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg md:text-xl font-serif text-slate-800 mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-600 text-sm md:text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-2">
                      <Check className="h-3 w-3 md:h-4 md:w-4 text-rose-500 flex-shrink-0" />
                      <span className="text-xs md:text-sm text-slate-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/95 backdrop-blur-xl border-2 border-rose-200/50 romantic-shadow rounded-3xl p-8 md:p-12 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-serif font-bold elegant-text-gradient mb-4 md:mb-6">
            Ready to Plan Your Dream Wedding?
          </h2>
          <p className="text-base md:text-lg text-slate-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of couples who have successfully planned their perfect wedding with Meliora Moments. 
            Start your journey today!
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg" 
            className="romantic-button text-lg md:text-xl px-8 md:px-12 py-4 md:py-6"
          >
            <Heart className="mr-3 h-5 w-5 md:h-6 md:w-6" />
            Start Planning Now
          </Button>
        </div>
      </section>
    </div>
  );
};
