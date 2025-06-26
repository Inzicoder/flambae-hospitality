
import { BudgetTracker } from "@/components/BudgetTracker";

export const BudgetPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">Budget Management</h1>
        <p className="text-gray-600">Track expenses and stay within your wedding budget</p>
      </div>
      <BudgetTracker />
    </div>
  );
};
