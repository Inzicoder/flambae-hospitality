
import { EventManagementDashboard } from "./EventManagementDashboard";
import { EventCompanyHeader } from "./event-management/EventCompanyHeader";

interface EventCompanyDashboardProps {
  weddingData: any;
}

export const EventCompanyDashboard = ({ weddingData }: EventCompanyDashboardProps) => {
  return (
    <div className="space-y-8">
      <EventCompanyHeader weddingData={weddingData} />
      <EventManagementDashboard />
    </div>
  );
};
