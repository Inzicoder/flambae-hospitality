
import { TravelAccommodation } from "@/components/TravelAccommodation";

export const TravelPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">Travel & Accommodation</h1>
        <p className="text-gray-600">Help guests with travel and stay arrangements</p>
      </div>
      <TravelAccommodation />
    </div>
  );
};
