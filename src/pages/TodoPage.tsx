
import { TodoList } from "@/components/TodoList";

interface TodoPageProps {
  todos: any[];
  onToggleTodo: (id: number) => void;
  onAddTodo: (task: string) => void;
  onDeleteTodo: (id: number) => void;
}

export const TodoPage = ({ todos, onToggleTodo, onAddTodo, onDeleteTodo }: TodoPageProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">Wedding Tasks</h1>
        <p className="text-gray-600">Stay organized with your wedding planning checklist</p>
      </div>
      <TodoList 
        todos={todos}
        onToggleTodo={onToggleTodo}
        onAddTodo={onAddTodo}
        onDeleteTodo={onDeleteTodo}
      />
    </div>
  );
};
