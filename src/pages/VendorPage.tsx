
import { VendorManager } from "@/components/VendorManager";

export const VendorPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">Vendor Management</h1>
        <p className="text-gray-600">Manage all your wedding service providers</p>
      </div>
      <VendorManager />
    </div>
  );
};
