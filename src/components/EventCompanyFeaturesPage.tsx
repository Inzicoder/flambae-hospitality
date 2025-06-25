
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomLogo } from "./CustomLogo";
import { 
  Building2, 
  Users, 
  Car, 
  BedDouble, 
  ClipboardList,
  Headphones,
  MessageSquare,
  Calendar,
  ArrowLeft,
  Star,
  Check,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

interface EventCompanyFeaturesPageProps {
  onGetStarted: () => void;
}

export const EventCompanyFeaturesPage = ({ onGetStarted }: EventCompanyFeaturesPageProps) => {
  const features = [
    { 
      icon: Building2, 
      title: "Event Management Dashboard", 
      description: "Comprehensive overview of all your events with real-time updates, analytics, and management tools for professional event coordination.",
      benefits: ["Multi-event dashboard", "Real-time analytics", "Client management", "Revenue tracking"]
    },
    { 
      icon: Users, 
      title: "Advanced Guest Management", 
      description: "Professional-grade guest management system with bulk operations, advanced filtering, and detailed guest profiles.",
      benefits: ["Bulk guest operations", "Advanced search & filters", "Guest preferences", "Communication tools"]
    },
    { 
      icon: Car, 
      title: "Logistics Management", 
      description: "Coordinate transportation, deliveries, and logistics with scheduling tools and real-time tracking capabilities.",
      benefits: ["Transport scheduling", "Delivery coordination", "Route optimization", "Real-time tracking"]
    },
    { 
      icon: BedDouble, 
      title: "Room Allocation System", 
      description: "Efficiently manage guest accommodations with room assignment tools, availability tracking, and preference matching.",
      benefits: ["Room assignment", "Availability tracking", "Guest preferences", "Occupancy management"]
    },
    { 
      icon: ClipboardList, 
      title: "Task Allocation & Management", 
      description: "Assign tasks to team members, track progress, set deadlines, and ensure nothing falls through the cracks.",
      benefits: ["Team task assignment", "Progress tracking", "Deadline management", "Workload distribution"]
    },
    { 
      icon: Headphones, 
      title: "Help Desk Integration", 
      description: "Integrated customer support system with ticketing, live chat, and knowledge base for exceptional client service.",
      benefits: ["Support ticketing", "Live chat", "Knowledge base", "Response tracking"]
    },
    { 
      icon: MessageSquare, 
      title: "AI-Powered Chatbot", 
      description: "Automated customer assistance with intelligent responses, FAQ handling, and seamless handover to human agents.",
      benefits: ["24/7 availability", "Intelligent responses", "FAQ automation", "Human handover"]
    },
    { 
      icon: Calendar, 
      title: "Professional Event Scheduling", 
      description: "Advanced scheduling tools with timeline management, vendor coordination, and automated reminders for flawless execution.",
      benefits: ["Timeline management", "Vendor sync", "Automated reminders", "Resource allocation"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-25 to-blue-50 relative overflow-hidden"
         style={{ 
           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238b5cf6' fill-opacity='0.1' fill-rule='nonzero'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
         }}>
      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 opacity-20">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-200 to-indigo-300 blur-xl animate-pulse"></div>
        </div>
        <div className="absolute top-40 right-20 w-48 h-48 opacity-15">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-purple-200 blur-2xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/95 backdrop-blur-xl border-b border-purple-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-slate-700 rounded-2xl">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <CustomLogo size="sm" showTagline={false} />
            </div>
            <Button 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white rounded-2xl"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-3xl flex items-center justify-center shadow-xl">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Event Company Features
          </h1>
          <p className="text-xl text-slate-600 font-light mb-8 max-w-3xl mx-auto">
            Professional-grade tools designed for event companies to manage multiple weddings and events 
            with efficiency, precision, and exceptional client service.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <span>Scalable solution</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-purple-500 fill-current" />
              <span>Professional grade</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-purple-500" />
              <span>Enterprise ready</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/95 backdrop-blur-xl border-2 border-purple-200/30 shadow-lg rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-serif text-slate-800">{feature.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-slate-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-slate-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/95 backdrop-blur-xl border-2 border-purple-200/50 shadow-lg rounded-3xl p-12">
          <h2 className="text-3xl font-serif font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Scale Your Event Business
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join leading event companies who trust Meliora Moments to deliver exceptional wedding experiences 
            while streamlining their operations and growing their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white rounded-2xl text-xl px-12 py-6"
            >
              <Building2 className="mr-3 h-6 w-6" />
              Start Free Trial
            </Button>
            <Button 
              variant="outline"
              size="lg" 
              className="border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 text-purple-700 rounded-2xl text-xl px-12 py-6"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
