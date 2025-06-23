
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Users, 
  DollarSign, 
  CheckSquare, 
  Calendar,
  TrendingUp,
  AlertCircle,
  Star,
  ArrowRight
} from "lucide-react";

interface DashboardProps {
  weddingData: any;
}

export const Dashboard = ({ weddingData }: DashboardProps) => {
  const completedTodos = weddingData.todos.filter((todo: any) => todo.completed).length;
  const urgentTodos = weddingData.todos.filter((todo: any) => todo.urgent && !todo.completed).length;
  const budgetUsed = (weddingData.budget.spent / weddingData.budget.total) * 100;
  const rsvpRate = (weddingData.guestStats.confirmed / weddingData.guestStats.totalInvited) * 100;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gradient mb-4">
          Welcome to Your Wedding Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Track your progress, manage your budget, and stay organized for your special day.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-rose-600">RSVP Rate</p>
                <p className="text-2xl font-bold text-rose-700">{Math.round(rsvpRate)}%</p>
                <p className="text-xs text-rose-600">
                  {weddingData.guestStats.confirmed} of {weddingData.guestStats.totalInvited} confirmed
                </p>
              </div>
              <Users className="h-8 w-8 text-rose-500" />
            </div>
            <Progress value={rsvpRate} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Budget Used</p>
                <p className="text-2xl font-bold text-green-700">{Math.round(budgetUsed)}%</p>
                <p className="text-xs text-green-600">
                  ${weddingData.budget.spent.toLocaleString()} spent
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={budgetUsed} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Tasks Done</p>
                <p className="text-2xl font-bold text-blue-700">
                  {completedTodos}/{weddingData.todos.length}
                </p>
                <p className="text-xs text-blue-600">
                  {Math.round((completedTodos / weddingData.todos.length) * 100)}% complete
                </p>
              </div>
              <CheckSquare className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={(completedTodos / weddingData.todos.length) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Days to Go</p>
                <p className="text-2xl font-bold text-purple-700">
                  {Math.ceil((new Date(weddingData.weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </p>
                <p className="text-xs text-purple-600">Until your big day</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Jump to your most important tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/rsvp">
              <Button variant="outline" className="w-full justify-between hover:bg-rose-50">
                <span>Manage RSVPs</span>
                <Badge variant="secondary">{weddingData.guestStats.pending} pending</Badge>
              </Button>
            </Link>
            <Link to="/budget">
              <Button variant="outline" className="w-full justify-between hover:bg-green-50">
                <span>Review Budget</span>
                <Badge variant="secondary">${(weddingData.budget.total - weddingData.budget.spent).toLocaleString()} left</Badge>
              </Button>
            </Link>
            <Link to="/todos">
              <Button variant="outline" className="w-full justify-between hover:bg-blue-50">
                <span>Check Tasks</span>
                {urgentTodos > 0 && <Badge variant="destructive">{urgentTodos} urgent</Badge>}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span>Recent Updates</span>
            </CardTitle>
            <CardDescription>Latest changes to your wedding plans</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckSquare className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Venue booked and paid</p>
                <p className="text-xs text-gray-600">Budget category updated</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">New RSVP responses</p>
                <p className="text-xs text-gray-600">5 guests confirmed attendance</p>
              </div>
            </div>
            {urgentTodos > 0 && (
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Urgent tasks pending</p>
                  <p className="text-xs text-gray-600">{urgentTodos} tasks need attention</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { to: '/rsvp', label: 'RSVP Tracker', icon: Users, color: 'rose' },
          { to: '/budget', label: 'Budget', icon: DollarSign, color: 'green' },
          { to: '/vendors', label: 'Vendors', icon: TrendingUp, color: 'blue' },
          { to: '/todos', label: 'Tasks', icon: CheckSquare, color: 'purple' },
          { to: '/schedule', label: 'Schedule', icon: Calendar, color: 'orange' },
        ].map((item) => (
          <Link key={item.to} to={item.to}>
            <Card className={`hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 border-${item.color}-200`}>
              <CardContent className="p-6 text-center">
                <item.icon className={`h-8 w-8 text-${item.color}-600 mx-auto mb-3`} />
                <p className={`font-medium text-${item.color}-700`}>{item.label}</p>
                <ArrowRight className={`h-4 w-4 text-${item.color}-500 mx-auto mt-2`} />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
