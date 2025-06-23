
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DollarSign, Plus, Download, Settings, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

interface BudgetCategory {
  id: number;
  name: string;
  estimated: number;
  actual: number;
  status: string;
}

interface BudgetTrackerProps {
  budget: {
    total: number;
    spent: number;
    categories: BudgetCategory[];
  };
  onAddCategory: (category: { name: string; estimated: number }) => void;
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

export const BudgetTracker = ({ budget, onAddCategory }: BudgetTrackerProps) => {
  const [newBudgetCategory, setNewBudgetCategory] = useState({ name: '', estimated: 0 });
  const [currency, setCurrency] = useState('USD');
  const [country, setCountry] = useState('United States');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      currency: 'USD',
      country: 'United States',
      budgetDeadline: '',
      taxRate: '',
    }
  });

  const selectedCurrency = currencies.find(c => c.code === currency);

  const addBudgetCategory = () => {
    if (newBudgetCategory.name && newBudgetCategory.estimated > 0) {
      onAddCategory(newBudgetCategory);
      setNewBudgetCategory({ name: '', estimated: 0 });
      toast({
        title: "Budget category added",
        description: "New budget category has been created.",
      });
    }
  };

  const onSettingsSubmit = (data: any) => {
    setCurrency(data.currency);
    setCountry(data.country);
    setIsSettingsOpen(false);
    toast({
      title: "Budget Settings Updated",
      description: `Currency set to ${currencies.find(c => c.code === data.currency)?.name} and country to ${data.country}`,
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-green-500" />
            <span className="text-xl font-semibold">Budget Tracker</span>
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
                <DialogTitle>Budget Settings</DialogTitle>
                <DialogDescription>
                  Configure your budget preferences and regional settings
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
                    name="budgetDeadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Deadline</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Rate (%)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 10" {...field} />
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
          Monitor your wedding expenses across all categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Total Budget</span>
            <span className="text-2xl font-bold">{selectedCurrency?.symbol}{budget.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Spent</span>
            <span className="text-lg font-semibold text-red-600">{selectedCurrency?.symbol}{budget.spent.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Remaining</span>
            <span className="text-lg font-semibold text-green-600">
              {selectedCurrency?.symbol}{(budget.total - budget.spent).toLocaleString()}
            </span>
          </div>
          <Progress 
            value={(budget.spent / budget.total) * 100} 
            className="mt-3"
          />
        </div>

        <div className="space-y-4 mb-6">
          {budget.categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{category.name}</h3>
                  <Badge 
                    variant={category.status === 'paid' ? 'default' : category.status === 'partial' ? 'secondary' : 'destructive'}
                  >
                    {category.status}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Estimated: {selectedCurrency?.symbol}{category.estimated.toLocaleString()}</span>
                  <span>Actual: {selectedCurrency?.symbol}{category.actual.toLocaleString()}</span>
                </div>
                <Progress 
                  value={category.actual > 0 ? (category.actual / category.estimated) * 100 : 0} 
                  className="mt-2 h-2"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <Input
            placeholder="Category name"
            value={newBudgetCategory.name}
            onChange={(e) => setNewBudgetCategory(prev => ({ ...prev, name: e.target.value }))}
            className="flex-1"
          />
          <Input
            type="number"
            placeholder="Estimated amount"
            value={newBudgetCategory.estimated || ''}
            onChange={(e) => setNewBudgetCategory(prev => ({ ...prev, estimated: Number(e.target.value) }))}
            className="w-40"
          />
          <Button onClick={addBudgetCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        <div className="flex space-x-4">
          <Button className="bg-green-500 hover:bg-green-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
