
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckSquare, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Todo {
  id: number;
  task: string;
  completed: boolean;
  urgent: boolean;
  dueDate: string;
}

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: number) => void;
  onAddTodo: (task: string) => void;
  onDeleteTodo: (id: number) => void;
}

export const TodoList = ({ todos, onToggleTodo, onAddTodo, onDeleteTodo }: TodoListProps) => {
  const [newTodo, setNewTodo] = useState('');
  const { toast } = useToast();

  const addTodo = () => {
    if (newTodo.trim()) {
      onAddTodo(newTodo);
      setNewTodo('');
      toast({
        title: "Task added",
        description: "New task has been added to your to-do list.",
      });
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckSquare className="h-6 w-6 text-blue-500" />
          <span>Wedding To-Do List</span>
        </CardTitle>
        <CardDescription>
          Stay organized with your wedding planning checklist
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">
              Progress: {completedCount} of {todos.length} completed
            </span>
          </div>
          <Progress 
            value={(completedCount / todos.length) * 100} 
          />
        </div>

        <div className="flex items-center space-x-2 mb-6">
          <Input
            placeholder="Add new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            className="flex-1"
          />
          <Button onClick={addTodo}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        <div className="space-y-3">
          {todos.map((todo) => (
            <div 
              key={todo.id} 
              className={`flex items-center space-x-3 p-4 rounded-lg border ${
                todo.completed 
                  ? 'bg-green-50 border-green-200' 
                  : todo.urgent 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-white border-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggleTodo(todo.id)}
                className="h-5 w-5 text-rose-500 rounded focus:ring-rose-500"
              />
              <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.task}
              </span>
              <span className="text-sm text-gray-500">{todo.dueDate}</span>
              {todo.urgent && !todo.completed && (
                <Badge variant="destructive">Urgent</Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
