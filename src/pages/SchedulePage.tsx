
import { EventSchedule } from "@/components/EventSchedule";

export const SchedulePage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">Event Schedule</h1>
        <p className="text-gray-600">Plan your wedding timeline and coordinate all events</p>
      </div>
      <EventSchedule />
    </div>
  );
};
