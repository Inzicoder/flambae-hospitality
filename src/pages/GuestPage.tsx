
import { GuestManager } from "@/components/GuestManager";

export const GuestPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">Guest Management</h1>
        <p className="text-gray-600">Organize your guest list and manage invitations</p>
      </div>
      <GuestManager />
    </div>
  );
};
