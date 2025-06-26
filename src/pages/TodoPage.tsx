
import { TodoList } from "@/components/TodoList";

export const TodoPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">Task Management</h1>
        <p className="text-gray-600">Keep track of all your wedding planning tasks</p>
      </div>
      <TodoList />
    </div>
  );
};
