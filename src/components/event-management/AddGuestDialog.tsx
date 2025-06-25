
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AddGuestDialogProps {
  onAddGuest: (guest: any) => void;
}

export const AddGuestDialog = ({ onAddGuest }: AddGuestDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    arrivalDateTime: '',
    departureDateTime: '',
    attendanceStatus: 'Pending',
    travelRequirement: 'No',
    isVIP: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phoneNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newGuest = {
      id: Date.now().toString(),
      ...formData
    };

    onAddGuest(newGuest);
    setFormData({
      fullName: '',
      phoneNumber: '',
      email: '',
      arrivalDateTime: '',
      departureDateTime: '',
      attendanceStatus: 'Pending',
      travelRequirement: 'No',
      isVIP: false
    });
    setOpen(false);
    
    toast({
      title: "Success",
      description: "Guest added successfully!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Guest
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Guest</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="arrivalDateTime">Arrival Date & Time</Label>
              <Input
                id="arrivalDateTime"
                type="datetime-local"
                value={formData.arrivalDateTime}
                onChange={(e) => setFormData({...formData, arrivalDateTime: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="departureDateTime">Departure Date & Time</Label>
              <Input
                id="departureDateTime"
                type="datetime-local"
                value={formData.departureDateTime}
                onChange={(e) => setFormData({...formData, departureDateTime: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attendanceStatus">Attendance Status</Label>
            <Select value={formData.attendanceStatus} onValueChange={(value) => setFormData({...formData, attendanceStatus: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="travelRequirement">Travel Requirement</Label>
            <Select value={formData.travelRequirement} onValueChange={(value) => setFormData({...formData, travelRequirement: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isVIP"
              checked={formData.isVIP}
              onCheckedChange={(checked) => setFormData({...formData, isVIP: checked as boolean})}
            />
            <Label htmlFor="isVIP">VIP Guest</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Guest</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
