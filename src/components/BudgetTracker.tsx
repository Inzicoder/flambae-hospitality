
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Plus, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export const BudgetTracker = ({ budget, onAddCategory }: BudgetTrackerProps) => {
  const [newBudgetCategory, setNewBudgetCategory] = useState({ name: '', estimated: 0 });
  const { toast } = useToast();

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

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-6 w-6 text-green-500" />
          <span>Budget Tracker</span>
        </CardTitle>
        <CardDescription>
          Monitor your wedding expenses across all categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Total Budget</span>
            <span className="text-2xl font-bold">${budget.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Spent</span>
            <span className="text-lg font-semibold text-red-600">${budget.spent.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Remaining</span>
            <span className="text-lg font-semibold text-green-600">
              ${(budget.total - budget.spent).toLocaleString()}
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
                  <span>Estimated: ${category.estimated.toLocaleString()}</span>
                  <span>Actual: ${category.actual.toLocaleString()}</span>
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
