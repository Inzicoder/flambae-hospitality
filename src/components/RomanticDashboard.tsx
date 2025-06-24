
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, Users, DollarSign, CheckCircle, Clock, Star, Sparkles } from "lucide-react";

interface DashboardProps {
  weddingData: {
    coupleNames: string;
    weddingDate: string;
    guestStats: {
      totalInvited: number;
      confirmed: number;
      pending: number;
      declined: number;
    };
    budget: {
      total: number;
      spent: number;
      categories: Array<{
        id: number;
        name: string;
        estimated: number;
        actual: number;
        status: string;
      }>;
    };
    todos: Array<{
      id: number;
      task: string;
      completed: boolean;
      urgent: boolean;
      dueDate: string;
    }>;
  };
}

export const RomanticDashboard = ({ weddingData }: DashboardProps) => {
  const completedTodos = weddingData.todos.filter(todo => todo.completed).length;
  const urgentTodos = weddingData.todos.filter(todo => !todo.completed && todo.urgent).length;
  const budgetProgress = (weddingData.budget.spent / weddingData.budget.total) * 100;

  const getTimeUntilWedding = () => {
    const weddingDate = new Date(weddingData.weddingDate);
    const today = new Date();
    const timeDiff = weddingDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const daysUntilWedding = getTimeUntilWedding();

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Header */}
      <div className="text-center py-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-100/50 via-pink-50/30 to-purple-100/50 rounded-3xl blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Heart className="h-8 w-8 text-rose-500 animate-pulse" />
            <h1 className="text-5xl font-serif text-gradient leading-tight">
              Welcome {weddingData.coupleNames}
            </h1>
            <Heart className="h-8 w-8 text-rose-500 animate-pulse" />
          </div>
          <p className="text-2xl text-slate-600 font-light mb-2">Your beautiful journey awaits</p>
          <p className="text-lg text-slate-500">Wedding Day: {weddingData.weddingDate}</p>
          {daysUntilWedding > 0 && (
            <Badge className="mt-4 bg-gradient-to-r from-rose-400 to-pink-400 text-white px-6 py-2 text-lg font-medium">
              <Sparkles className="h-4 w-4 mr-2" />
              {daysUntilWedding} days to go!
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/90 backdrop-blur-xl border-0 romantic-shadow hover-lift rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-rose-300 to-pink-300"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Guest Responses</p>
                <p className="text-3xl font-bold text-slate-800">{weddingData.guestStats.confirmed}</p>
                <p className="text-xs text-slate-500">of {weddingData.guestStats.totalInvited} invited</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full">
                <Users className="h-6 w-6 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-xl border-0 romantic-shadow hover-lift rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-300 to-indigo-300"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Budget Used</p>
                <p className="text-3xl font-bold text-slate-800">{budgetProgress.toFixed(0)}%</p>
                <p className="text-xs text-slate-500">${weddingData.budget.spent.toLocaleString()} spent</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-xl border-0 romantic-shadow hover-lift rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-300 to-teal-300"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Tasks Complete</p>
                <p className="text-3xl font-bold text-slate-800">{completedTodos}</p>
                <p className="text-xs text-slate-500">of {weddingData.todos.length} total</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-xl border-0 romantic-shadow hover-lift rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-amber-300 to-orange-300"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Urgent Tasks</p>
                <p className="text-3xl font-bold text-slate-800">{urgentTodos}</p>
                <p className="text-xs text-slate-500">need attention</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/90 backdrop-blur-xl border-0 romantic-shadow rounded-3xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-rose-300 via-pink-300 to-purple-300"></div>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-serif text-slate-700 flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-rose-600" />
              </div>
              <span>Recent Progress</span>
            </CardTitle>
            <CardDescription className="text-slate-600 font-light">
              Your latest completed tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {weddingData.todos.filter(todo => todo.completed).slice(0, 3).map((todo) => (
              <div key={todo.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-slate-700 font-medium">{todo.task}</span>
              </div>
            ))}
            {weddingData.todos.filter(todo => todo.completed).length === 0 && (
              <p className="text-slate-500 text-center py-4 font-light">No completed tasks yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-xl border-0 romantic-shadow rounded-3xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-amber-300 via-orange-300 to-red-300"></div>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-serif text-slate-700 flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <span>Priority Tasks</span>
            </CardTitle>
            <CardDescription className="text-slate-600 font-light">
              Tasks that need your attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {weddingData.todos.filter(todo => !todo.completed && todo.urgent).slice(0, 3).map((todo) => (
              <div key={todo.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <Clock className="h-5 w-5 text-amber-500" />
                <span className="text-slate-700 font-medium">{todo.task}</span>
              </div>
            ))}
            {urgentTodos === 0 && (
              <p className="text-slate-500 text-center py-4 font-light">All caught up! 🎉</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="text-center py-8">
        <h3 className="text-2xl font-serif text-slate-700 mb-6">Quick Actions</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className="romantic-button px-8 py-3">
            <Heart className="h-4 w-4 mr-2" />
            Add New Task
          </Button>
          <Button className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 px-8 py-3">
            <Calendar className="h-4 w-4 mr-2" />
            View Timeline
          </Button>
          <Button className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 px-8 py-3">
            <Users className="h-4 w-4 mr-2" />
            Manage Guests
          </Button>
        </div>
      </div>
    </div>
  );
};
