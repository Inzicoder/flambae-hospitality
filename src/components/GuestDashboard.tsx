
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
  ArrowRight,
  Heart,
  Camera,
  StickyNote,
  CreditCard
} from "lucide-react";

interface GuestDashboardProps {
  weddingData: any;
}

export const GuestDashboard = ({ weddingData }: GuestDashboardProps) => {
  const completedTodos = weddingData.todos.filter((todo: any) => todo.completed).length;
  const urgentTodos = weddingData.todos.filter((todo: any) => todo.urgent && !todo.completed).length;
  const budgetUsed = (weddingData.budget.spent / weddingData.budget.total) * 100;
  const rsvpRate = (weddingData.guestStats.confirmed / weddingData.guestStats.totalInvited) * 100;
  const daysToGo = Math.ceil((new Date(weddingData.weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {weddingData.coupleNames}
            </h1>
            <p className="text-xl md:text-2xl text-cyan-100 mb-2">
              {weddingData.weddingDate}
            </p>
            <p className="text-lg text-cyan-200">
              {daysToGo} days until your special day
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-rose-600">RSVP Rate</p>
                  <p className="text-3xl font-bold text-rose-700">{Math.round(rsvpRate)}%</p>
                </div>
                <Users className="h-8 w-8 text-rose-500" />
              </div>
              <Progress value={rsvpRate} className="mb-2" />
              <p className="text-xs text-rose-600">
                {weddingData.guestStats.confirmed} of {weddingData.guestStats.totalInvited} confirmed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-emerald-600">Budget Used</p>
                  <p className="text-3xl font-bold text-emerald-700">{Math.round(budgetUsed)}%</p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-500" />
              </div>
              <Progress value={budgetUsed} className="mb-2" />
              <p className="text-xs text-emerald-600">
                ${weddingData.budget.spent.toLocaleString()} spent
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-blue-600">Tasks Done</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {completedTodos}/{weddingData.todos.length}
                  </p>
                </div>
                <CheckSquare className="h-8 w-8 text-blue-500" />
              </div>
              <Progress value={(completedTodos / weddingData.todos.length) * 100} className="mb-2" />
              <p className="text-xs text-blue-600">
                {Math.round((completedTodos / weddingData.todos.length) * 100)}% complete
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-purple-600">Days to Go</p>
                  <p className="text-3xl font-bold text-purple-700">{daysToGo}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-xs text-purple-600">Until your big day</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-slate-800">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription className="text-slate-600">Jump to your most important tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/guests">
                <Button variant="outline" className="w-full justify-between hover:bg-teal-50 border-slate-200">
                  <span>Manage Guests</span>
                  <Badge variant="secondary">{weddingData.guestStats.pending} pending</Badge>
                </Button>
              </Link>
              <Link to="/budget">
                <Button variant="outline" className="w-full justify-between hover:bg-emerald-50 border-slate-200">
                  <span>Review Budget</span>
                  <Badge variant="secondary">${(weddingData.budget.total - weddingData.budget.spent).toLocaleString()} left</Badge>
                </Button>
              </Link>
              <Link to="/todos">
                <Button variant="outline" className="w-full justify-between hover:bg-blue-50 border-slate-200">
                  <span>Check Tasks</span>
                  {urgentTodos > 0 && <Badge variant="destructive">{urgentTodos} urgent</Badge>}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-slate-800">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span>Recent Updates</span>
              </CardTitle>
              <CardDescription className="text-slate-600">Latest changes to your wedding plans</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <CheckSquare className="h-5 w-5 text-emerald-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">Venue booked and paid</p>
                  <p className="text-xs text-slate-600">Budget category updated</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">New RSVP responses</p>
                  <p className="text-xs text-slate-600">5 guests confirmed attendance</p>
                </div>
              </div>
              {urgentTodos > 0 && (
                <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl border border-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">Urgent tasks pending</p>
                    <p className="text-xs text-slate-600">{urgentTodos} tasks need attention</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { to: '/guests', label: 'Guest Manager', icon: Users, color: 'from-rose-500 to-pink-500', bgColor: 'bg-rose-50', textColor: 'text-rose-700' },
            { to: '/budget', label: 'Budget', icon: DollarSign, color: 'from-emerald-500 to-green-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
            { to: '/vendors', label: 'Vendors', icon: TrendingUp, color: 'from-blue-500 to-indigo-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
            { to: '/todos', label: 'Tasks', icon: CheckSquare, color: 'from-purple-500 to-violet-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
            { to: '/schedule', label: 'Schedule', icon: Calendar, color: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
            { to: '/gallery', label: 'Gallery', icon: Camera, color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50', textColor: 'text-pink-700' },
            { to: '/notes', label: 'Notes', icon: StickyNote, color: 'from-indigo-500 to-blue-500', bgColor: 'bg-indigo-50', textColor: 'text-indigo-700' },
            { to: '/payments', label: 'Payments', icon: CreditCard, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', textColor: 'text-green-700' },
          ].map((item) => (
            <Link key={item.to} to={item.to}>
              <Card className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${item.bgColor} border-transparent`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className={`font-semibold ${item.textColor} mb-2`}>{item.label}</p>
                  <ArrowRight className="h-4 w-4 text-slate-400 mx-auto" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
