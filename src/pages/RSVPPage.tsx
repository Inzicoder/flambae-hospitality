
import { RSVPTracker } from "@/components/RSVPTracker";
import { GuestList } from "@/components/GuestList";

interface RSVPPageProps {
  guestStats: any;
}

export const RSVPPage = ({ guestStats }: RSVPPageProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">RSVP Management</h1>
        <p className="text-gray-600">Track guest responses and manage your wedding attendance</p>
      </div>
      
      <RSVPTracker guestStats={guestStats} />
      
      <GuestList />
    </div>
  );
};
