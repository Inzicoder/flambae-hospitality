
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heart, Share2, Plus, Download, Settings, Users, Utensils, Hotel } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

interface RSVPTrackerProps {
  guestStats: {
    totalInvited: number;
    confirmed: number;
    pending: number;
    declined: number;
  };
  eventCode?: string;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
];

const countries = [
  'United States', 'United Kingdom', 'India', 'UAE', 'Canada', 'Australia'
];

export const RSVPTracker = ({ guestStats, eventCode }: RSVPTrackerProps) => {
  const { toast } = useToast();
  const [currency, setCurrency] = useState('USD');
  const [country, setCountry] = useState('United States');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      currency: 'USD',
      country: 'United States',
      rsvpDeadline: '',
      websiteUrl: '',
    }
  });

  const shareRSVPLink = () => {
    const rsvpUrl = `${window.location.origin}/rsvp/${eventCode || 'wedding123'}`;
    navigator.clipboard.writeText(rsvpUrl);
    toast({
      title: "RSVP Link Copied!",
      description: "Share this link with your guests to collect RSVPs.",
    });
  };

  const generateWhatsAppMessage = () => {
    const rsvpUrl = `${window.location.origin}/rsvp/${eventCode || 'wedding123'}`;
    const message = `Hi! Please RSVP to our wedding by clicking this link: ${rsvpUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const onSettingsSubmit = (data: any) => {
    setCurrency(data.currency);
    setCountry(data.country);
    setIsSettingsOpen(false);
    toast({
      title: "Settings Updated",
      description: `Currency set to ${currencies.find(c => c.code === data.currency)?.name} and country to ${data.country}`,
    });
  };

  const selectedCurrency = currencies.find(c => c.code === currency);
  const responseRate = Math.round((guestStats.confirmed + guestStats.declined) / guestStats.totalInvited * 100);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">RSVP Management</h2>
            <p className="text-slate-600">Track responses and manage your guest list</p>
          </div>
        </div>
        
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>RSVP Settings</DialogTitle>
              <DialogDescription>
                Configure your preferences and regional settings
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSettingsSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border shadow-lg z-50">
                          {currencies.map((curr) => (
                            <SelectItem key={curr.code} value={curr.code}>
                              {curr.symbol} {curr.code} - {curr.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border shadow-lg z-50">
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rsvpDeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RSVP Deadline</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                  Save Settings
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Stats Card */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-slate-800">Response Overview</CardTitle>
          <CardDescription className="text-slate-600">
            Current status: {responseRate}% response rate • {country} • {selectedCurrency?.symbol} {selectedCurrency?.code}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="text-3xl font-bold text-emerald-700 mb-1">{guestStats.confirmed}</div>
              <div className="text-sm font-medium text-emerald-600">Confirmed</div>
              <div className="text-xs text-emerald-500 mt-1">
                {Math.round(guestStats.confirmed/guestStats.totalInvited*100)}% of total
              </div>
            </div>
            
            <div className="text-center p-6 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="text-3xl font-bold text-amber-700 mb-1">{guestStats.pending}</div>
              <div className="text-sm font-medium text-amber-600">Pending</div>
              <div className="text-xs text-amber-500 mt-1">
                {Math.round(guestStats.pending/guestStats.totalInvited*100)}% waiting
              </div>
            </div>
            
            <div className="text-center p-6 bg-rose-50 rounded-2xl border border-rose-100">
              <div className="text-3xl font-bold text-rose-700 mb-1">{guestStats.declined}</div>
              <div className="text-sm font-medium text-rose-600">Declined</div>
              <div className="text-xs text-rose-500 mt-1">
                {Math.round(guestStats.declined/guestStats.totalInvited*100)}% declined
              </div>
            </div>
            
            <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-3xl font-bold text-slate-700 mb-1">{guestStats.totalInvited}</div>
              <div className="text-sm font-medium text-slate-600">Total Invited</div>
              <div className="text-xs text-slate-500 mt-1">
                {responseRate}% responded
              </div>
            </div>
          </div>

          {/* Planning Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-5 bg-teal-50 rounded-xl border border-teal-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Utensils className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-semibold text-teal-900">Catering</h3>
              </div>
              <p className="text-sm text-teal-700">~{Math.round(guestStats.confirmed * 0.4)} vegetarian</p>
              <p className="text-sm text-teal-700">~{guestStats.confirmed - Math.round(guestStats.confirmed * 0.4)} non-vegetarian</p>
            </div>
            
            <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Hotel className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-indigo-900">Accommodation</h3>
              </div>
              <p className="text-sm text-indigo-700">~{Math.round(guestStats.confirmed * 0.3)} guests need</p>
              <p className="text-sm text-indigo-700">accommodation help</p>
            </div>
            
            <div className="p-5 bg-purple-50 rounded-xl border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-900">Seating</h3>
              </div>
              <p className="text-sm text-purple-700">{Math.ceil(guestStats.confirmed / 8)} tables needed</p>
              <p className="text-sm text-purple-700">(8 guests per table)</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={shareRSVPLink} 
              className="bg-teal-600 hover:bg-teal-700 text-white px-6"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Copy RSVP Link
            </Button>
            <Button 
              onClick={generateWhatsAppMessage} 
              className="bg-green-600 hover:bg-green-700 text-white px-6"
            >
              <Share2 className="h-4 w-4 mr-2" />
              WhatsApp Invite
            </Button>
            <Button variant="outline" className="border-slate-300 hover:bg-slate-50 px-6">
              <Plus className="h-4 w-4 mr-2" />
              Add Guest
            </Button>
            <Button variant="outline" className="border-slate-300 hover:bg-slate-50 px-6">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
