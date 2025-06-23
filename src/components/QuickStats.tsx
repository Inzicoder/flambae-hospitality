
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, CheckSquare, Calendar } from "lucide-react";

interface QuickStatsProps {
  guestStats: {
    totalInvited: number;
    confirmed: number;
    pending: number;
    declined: number;
  };
  budget: {
    total: number;
    spent: number;
  };
  completedTodos: number;
  totalTodos: number;
}

export const QuickStats = ({ guestStats, budget, completedTodos, totalTodos }: QuickStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invited</p>
              <p className="text-3xl font-bold text-gray-900">{guestStats.totalInvited}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-3xl font-bold text-green-600">{guestStats.confirmed}</p>
            </div>
            <CheckSquare className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Budget Used</p>
            <p className="text-3xl font-bold text-gray-900">
              ${budget.spent.toLocaleString()}
            </p>
            <Progress 
              value={(budget.spent / budget.total) * 100} 
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasks Left</p>
              <p className="text-3xl font-bold text-orange-600">
                {totalTodos - completedTodos}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
