
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heart, Share2, Plus, Download, Settings, Globe, DollarSign, Users, Utensils, Hotel } from "lucide-react";
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
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

const countries = [
  'United States', 'United Kingdom', 'India', 'UAE', 'Canada', 'Australia',
  'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Singapore'
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

  // Calculate additional stats
  const responseRate = Math.round((guestStats.confirmed + guestStats.declined) / guestStats.totalInvited * 100);
  const accommodationNeeded = Math.round(guestStats.confirmed * 0.3); // Estimate 30% need accommodation
  const vegetarianMeals = Math.round(guestStats.confirmed * 0.4); // Estimate 40% vegetarian

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-semibold">RSVP Tracker</span>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Globe className="h-4 w-4" />
              <span>{country}</span>
              <DollarSign className="h-4 w-4 ml-2" />
              <span>{selectedCurrency?.symbol} {selectedCurrency?.code}</span>
            </div>
          </div>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>RSVP Settings</DialogTitle>
                <DialogDescription>
                  Configure your RSVP preferences and regional settings
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
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
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
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
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
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wedding Website URL</FormLabel>
                        <FormControl>
                          <Input placeholder="www.yourwedding.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Save Settings</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          Track guest responses, manage meal preferences, and accommodation needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-2xl font-bold text-green-600">{guestStats.confirmed}</p>
            <p className="text-sm text-green-700">Confirmed</p>
            <p className="text-xs text-green-600">{Math.round(guestStats.confirmed/guestStats.totalInvited*100)}% of total</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-2xl font-bold text-yellow-600">{guestStats.pending}</p>
            <p className="text-sm text-yellow-700">Pending</p>
            <p className="text-xs text-yellow-600">{Math.round(guestStats.pending/guestStats.totalInvited*100)}% remaining</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-2xl font-bold text-red-600">{guestStats.declined}</p>
            <p className="text-sm text-red-700">Declined</p>
            <p className="text-xs text-red-600">{Math.round(guestStats.declined/guestStats.totalInvited*100)}% declined</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">{responseRate}%</p>
            <p className="text-sm text-blue-700">Response Rate</p>
            <p className="text-xs text-blue-600">{guestStats.confirmed + guestStats.declined} of {guestStats.totalInvited}</p>
          </div>
        </div>

        {/* Additional Planning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Utensils className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Meal Planning</h3>
            </div>
            <p className="text-sm text-purple-700">Est. {vegetarianMeals} vegetarian meals</p>
            <p className="text-sm text-purple-700">{guestStats.confirmed - vegetarianMeals} non-vegetarian meals</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <Hotel className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold text-indigo-900">Accommodation</h3>
            </div>
            <p className="text-sm text-indigo-700">Est. {accommodationNeeded} guests need</p>
            <p className="text-sm text-indigo-700">accommodation assistance</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold text-emerald-900">Seating</h3>
            </div>
            <p className="text-sm text-emerald-700">{Math.ceil(guestStats.confirmed / 8)} tables needed</p>
            <p className="text-sm text-emerald-700">(8 guests per table)</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Button onClick={shareRSVPLink} className="bg-rose-500 hover:bg-rose-600">
            <Share2 className="h-4 w-4 mr-2" />
            Share RSVP Link
          </Button>
          <Button onClick={generateWhatsAppMessage} className="bg-green-500 hover:bg-green-600">
            <Share2 className="h-4 w-4 mr-2" />
            Send WhatsApp RSVP
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Upload Guest List
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Guest Manually
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export RSVP Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
