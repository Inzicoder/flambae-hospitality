
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ScheduleTransportDialogProps {
  onScheduleTransport: (transport: any) => void;
}

export const ScheduleTransportDialog = ({ onScheduleTransport }: ScheduleTransportDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    guestName: '',
    pickupType: 'Airport Pickup',
    scheduledTime: '',
    location: '',
    assignedDriver: '',
    vehicle: '',
    priority: 'Regular',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guestName || !formData.scheduledTime || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newTransport = {
      id: Date.now().toString(),
      ...formData,
      status: 'Scheduled'
    };

    onScheduleTransport(newTransport);
    setFormData({
      guestName: '',
      pickupType: 'Airport Pickup',
      scheduledTime: '',
      location: '',
      assignedDriver: '',
      vehicle: '',
      priority: 'Regular',
      notes: ''
    });
    setOpen(false);
    
    toast({
      title: "Success",
      description: "Transport scheduled successfully!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Transport
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule New Transport</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Guest Name *</Label>
            <Input
              id="guestName"
              value={formData.guestName}
              onChange={(e) => setFormData({...formData, guestName: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pickupType">Service Type</Label>
            <Select value={formData.pickupType} onValueChange={(value) => setFormData({...formData, pickupType: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Airport Pickup">Airport Pickup</SelectItem>
                <SelectItem value="Airport Drop">Airport Drop</SelectItem>
                <SelectItem value="Hotel Transfer">Hotel Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scheduledTime">Scheduled Date & Time *</Label>
            <Input
              id="scheduledTime"
              type="datetime-local"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g., Terminal 1 - Gate 3"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assignedDriver">Assigned Driver</Label>
            <Input
              id="assignedDriver"
              value={formData.assignedDriver}
              onChange={(e) => setFormData({...formData, assignedDriver: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vehicle">Vehicle</Label>
            <Input
              id="vehicle"
              value={formData.vehicle}
              onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
              placeholder="e.g., Mercedes S-Class (ABC-123)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="Regular">Regular</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any special instructions or notes..."
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Schedule Transport</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
