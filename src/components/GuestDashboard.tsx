
import { useWedding } from "@/hooks/useWedding";
import { useGuests } from "@/hooks/useGuests";
import { useTodos } from "@/hooks/useTodos";
import { useBudget } from "@/hooks/useBudget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, CheckSquare, DollarSign, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const GuestDashboard = () => {
  const { wedding } = useWedding();
  const { guests } = useGuests();
  const { todos } = useTodos();
  const { categories } = useBudget();

  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;
  const todoProgress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  const totalBudget = categories.reduce((sum, cat) => sum + cat.estimated_amount, 0);
  const spentBudget = categories.reduce((sum, cat) => sum + cat.actual_amount, 0);
  const budgetProgress = totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0;

  const confirmedGuests = guests.filter(guest => guest.attendance_status === 'confirmed').length;
  const pendingGuests = guests.filter(guest => guest.attendance_status === 'pending').length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-serif bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
          {wedding?.couple_names || "Your Dream Wedding"}
        </h1>
        <p className="text-xl text-slate-600 font-light">
          {wedding?.wedding_date 
            ? `${new Date(wedding.wedding_date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}`
            : "Set your special date"
          }
        </p>
        {wedding?.venue && (
          <p className="text-lg text-slate-500 flex items-center justify-center">
            <CalendarDays className="h-5 w-5 mr-2" />
            {wedding.venue}
          </p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guests</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{guests.length}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Badge variant="default" className="bg-green-100 text-green-800">
                {confirmedGuests} confirmed
              </Badge>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {pendingGuests} pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedTodos}/{totalTodos}
            </div>
            <Progress value={todoProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(todoProgress)}% complete
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${spentBudget.toLocaleString()}
            </div>
            <Progress value={budgetProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              of ${totalBudget.toLocaleString()} budget
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Until</CardTitle>
            <CalendarDays className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {wedding?.wedding_date 
                ? Math.max(0, Math.ceil((new Date(wedding.wedding_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
                : '∞'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {wedding?.wedding_date ? 'days to go!' : 'Set your date'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Upcoming Tasks
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardTitle>
            <CardDescription>
              Your most important wedding planning tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todos.slice(0, 5).map((todo) => (
                <div key={todo.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className={`w-2 h-2 rounded-full ${todo.urgent ? 'bg-red-500' : 'bg-blue-500'}`} />
                  <div className="flex-1">
                    <p className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {todo.title}
                    </p>
                    {todo.due_date && (
                      <p className="text-xs text-gray-500">
                        Due: {new Date(todo.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {todo.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                </div>
              ))}
              {todos.length === 0 && (
                <p className="text-center text-gray-500 py-4">No tasks yet. Add your first task!</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent RSVPs
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Guest
              </Button>
            </CardTitle>
            <CardDescription>
              Latest guest responses and confirmations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {guests.slice(0, 5).map((guest) => (
                <div key={guest.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{guest.full_name}</p>
                    <p className="text-xs text-gray-500">{guest.email}</p>
                  </div>
                  <Badge 
                    variant={guest.attendance_status === 'confirmed' ? 'default' : guest.attendance_status === 'pending' ? 'secondary' : 'destructive'}
                    className={
                      guest.attendance_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      guest.attendance_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }
                  >
                    {guest.attendance_status}
                  </Badge>
                </div>
              ))}
              {guests.length === 0 && (
                <p className="text-center text-gray-500 py-4">No guests yet. Start building your guest list!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
