
import { TodoList } from "@/components/TodoList";
import { useTodos } from "@/hooks/useTodos";

export const TodoPage = () => {
  const { todos, loading, addTodo, toggleTodo, deleteTodo } = useTodos();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  const formattedTodos = todos.map(todo => ({
    id: parseInt(todo.id.slice(-8), 16), // Convert UUID to number for component compatibility
    task: todo.title,
    completed: todo.completed,
    urgent: todo.urgent,
    dueDate: todo.due_date || new Date().toISOString().split('T')[0]
  }));

  const handleToggleTodo = async (id: number) => {
    const todoId = todos.find(t => parseInt(t.id.slice(-8), 16) === id)?.id;
    if (todoId) {
      await toggleTodo(todoId);
    }
  };

  const handleAddTodo = async (task: string) => {
    await addTodo({
      title: task,
      description: null,
      completed: false,
      urgent: false,
      due_date: null
    });
  };

  const handleDeleteTodo = async (id: number) => {
    const todoId = todos.find(t => parseInt(t.id.slice(-8), 16) === id)?.id;
    if (todoId) {
      await deleteTodo(todoId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">Task Management</h1>
        <p className="text-gray-600">Keep track of all your wedding planning tasks</p>
      </div>
      <TodoList 
        todos={formattedTodos}
        onToggleTodo={handleToggleTodo}
        onAddTodo={handleAddTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </div>
  );
};
