
import { BudgetTracker } from "@/components/BudgetTracker";
import { useBudget } from "@/hooks/useBudget";

export const BudgetPage = () => {
  const { categories, loading, addCategory } = useBudget();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  const totalEstimated = categories.reduce((sum, cat) => sum + cat.estimated_amount, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.actual_amount, 0);

  const budget = {
    total: totalEstimated,
    spent: totalSpent,
    categories: categories.map(cat => ({
      id: parseInt(cat.id.slice(-8), 16), // Convert UUID to number for component compatibility
      name: cat.name,
      estimated: cat.estimated_amount,
      actual: cat.actual_amount,
      status: cat.status
    }))
  };

  const handleAddCategory = async (categoryData: { name: string; estimated: number }) => {
    await addCategory({
      name: categoryData.name,
      estimated_amount: categoryData.estimated,
      actual_amount: 0,
      status: 'pending'
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">Budget Management</h1>
        <p className="text-gray-600">Track expenses and stay within your wedding budget</p>
      </div>
      <BudgetTracker budget={budget} onAddCategory={handleAddCategory} />
    </div>
  );
};
