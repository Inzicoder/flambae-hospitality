
import { RSVPTracker } from "@/components/RSVPTracker";
import { GuestList } from "@/components/GuestList";
import { FileUploadProcessor } from "@/components/event-management/FileUploadProcessor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guests">Guest List</TabsTrigger>
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-8">
          <RSVPTracker guestStats={guestStats} />
        </TabsContent>
        
        <TabsContent value="guests" className="space-y-8">
          <GuestList />
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-8">
          <FileUploadProcessor />
        </TabsContent>
      </Tabs>
    </div>
  );
};
