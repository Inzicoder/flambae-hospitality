
import { PaymentManager } from "@/components/PaymentManager";

export const PaymentPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">Payment Management</h1>
        <p className="text-gray-600">Track invoices and manage payment schedules</p>
      </div>
      <PaymentManager />
    </div>
  );
};
