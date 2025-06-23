
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, CheckSquare, Calendar, DollarSign } from "lucide-react";

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
  const statCards = [
    {
      title: "Total Invited",
      value: guestStats.totalInvited,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      title: "Confirmed",
      value: guestStats.confirmed,
      icon: CheckSquare,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      title: "Budget Used",
      value: `$${budget.spent.toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      showProgress: true,
      progress: (budget.spent / budget.total) * 100
    },
    {
      title: "Tasks Left",
      value: totalTodos - completedTodos,
      icon: Calendar,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {statCards.map((card, index) => (
        <Card 
          key={card.title}
          className="glass-effect border-0 shadow-lg hover-lift relative overflow-hidden"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50`}></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            {card.showProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">of ${budget.total.toLocaleString()}</span>
                  <span className="font-semibold text-gray-700">{Math.round(card.progress)}%</span>
                </div>
                <Progress 
                  value={card.progress} 
                  className="h-2 bg-white/50"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
