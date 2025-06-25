
import { RSVPTracker } from "@/components/RSVPTracker";

interface EventCompanyDashboardProps {
  weddingData: any;
}

export const EventCompanyDashboard = ({ weddingData }: EventCompanyDashboardProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold text-gradient mb-4">Welcome {weddingData.coupleNames}</h1>
        <p className="text-xl text-gray-600">Event Company Dashboard</p>
        <p className="text-lg text-gray-500">Managing your special day - {weddingData.weddingDate}</p>
      </div>
      <RSVPTracker guestStats={weddingData.guestStats} />
    </div>
  );
};
