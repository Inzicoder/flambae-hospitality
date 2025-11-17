import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, Edit } from 'lucide-react';

interface Guest {
  id?: string;
  name: string;
  category: string;
  phoneNumber: string;
  city: string;
  arrivalDate: string;
  modeOfArrival: string;
  trainFlightNumber: string;
  time: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  attending: string;
  remarks?: string;
  remarksRound2?: string;
}

interface GuestDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
  isEditMode: boolean;
  onSave: (guest: Guest) => void;
  onEdit: () => void;
}

export const GuestDetailsDialog: React.FC<GuestDetailsDialogProps> = ({
  isOpen,
  onClose,
  guest,
  isEditMode,
  onSave,
  onEdit
}) => {
  const [editedGuest, setEditedGuest] = useState<Guest | null>(null);

  // Initialize editedGuest when guest changes
  useEffect(() => {
    if (guest) {
      setEditedGuest({ ...guest });
    }
  }, [guest]);

  // Handle field changes
  const handleFieldChange = (field: keyof Guest, value: string) => {
    if (isEditMode && editedGuest) {
      setEditedGuest({
        ...editedGuest,
        [field]: value
      });
    }
  };

  // Get current guest data
  const currentGuest = isEditMode && editedGuest ? editedGuest : guest;

  // Format date for input
  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch (e) {
      console.error('Error formatting date:', e);
    }
    return dateString;
  };

  const handleSave = () => {
    if (editedGuest) {
      onSave(editedGuest);
    }
  };

  if (!currentGuest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Guest Details' : 'View Guest Details'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update guest information below. Click Save to save changes.'
              : 'View guest information. Click Edit to make changes.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              {isEditMode ? (
                <Input
                  id="name"
                  value={currentGuest.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                />
              ) : (
                <div className="px-3 py-2 border rounded-md bg-gray-50 text-sm">
                  {currentGuest.name || '-'}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              {isEditMode ? (
                <Input
                  id="category"
                  value={currentGuest.category || ''}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                />
              ) : (
                <div className="px-3 py-2 border rounded-md bg-gray-50 text-sm">
                  {currentGuest.category || '-'}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Mobile No.</Label>
              {isEditMode ? (
                <Input
                  id="phoneNumber"
                  value={currentGuest.phoneNumber || ''}
                  onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                  placeholder="10-digit number"
                />
              ) : (
                <div className="px-3 py-2 border rounded-md bg-gray-50 text-sm">
                  {currentGuest.phoneNumber || '-'}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              {isEditMode ? (
                <Input
                  id="city"
                  value={currentGuest.city || ''}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                />
              ) : (
                <div className="px-3 py-2 border rounded-md bg-gray-50 text-sm">
                  {currentGuest.city || '-'}
                </div>
              )}
            </div>
          </div>

          {/* Travel Information */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Travel Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="arrivalDate">Date of Arrival</Label>
                {isEditMode ? (
                  <Input
                    id="arrivalDate"
                    type="date"
                    value={formatDateForInput(currentGuest.arrivalDate)}
                    onChange={(e) => handleFieldChange('arrivalDate', e.target.value)}
                  />
                ) : (
                  <div className="px-3 py-2 border rounded-md bg-gray-50 text-sm">
                    {formatDateForInput(currentGuest.arrivalDate) || '-'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modeOfArrival">Mode of Arrival</Label>
                {isEditMode ? (
                  <Input
                    id="modeOfArrival"
                    value={currentGuest.modeOfArrival || ''}
                    onChange={(e) => handleFieldChange('modeOfArrival', e.target.value)}
                    placeholder="Flight, Train, Car, etc."
                  />
                ) : (
                  <div className="px-3 py-2 border rounded-md bg-gray-50 text-sm">
                    {currentGuest.modeOfArrival || '-'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trainFlightNumber">Train/Flight No.</Label>
                {isEditMode ? (
                  <Input
                    id="trainFlightNumber"
                    value={currentGuest.trainFlightNumber || ''}
                    onChange={(e) => handleFieldChange('trainFlightNumber', e.target.value)}
                  />
                ) : (
                  <div className="px-3 py-2 border rounded-md bg-gray-50 text-sm">
                    {currentGuest.trainFlightNumber || '-'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                {isEditMode ? (
                  <Input
                    id="time"
                    type="time"
                    value={currentGuest.time || ''}
                    onChange={(e) => handleFieldChange('time', e.target.value)}
                  />
                ) : (
                  <div className="px-3 py-2 border rounded-md bg-gray-50 text-sm">
                    {currentGuest.time || '-'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Accommodation Information */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Accommodation Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hotelName">Hotel Name</Label>
                {isEditMode ? (
                  <Input
                    id="hotelName"
                    value={currentGuest.hotelName || ''}
                    onChange={(e) => handleFieldChange('hotelName', e.target.value)}
                  />
                ) : (
                  <div className="px-3 py-2 border rounded-md bg-gray-50 text-sm">
                    {currentGuest.hotelName || '-'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type</Label>
                {isEditMode ? (
                  <Input
                    id="roomType"
                    value={currentGuest.roomType || ''}
                    onChange={(e) => handleFieldChange('roomType', e.target.value)}
                  />
                ) : (
                  <div className="px-3 py-2 border rounded-md bg-gray-50 text-sm">
                    {currentGuest.roomType || '-'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="checkIn">Check-in</Label>
                {isEditMode ? (
                  <select
                    id="checkIn"
                    value={currentGuest.checkIn || 'No'}
                    onChange={(e) => handleFieldChange('checkIn', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                ) : (
                  <div className="px-3 py-2 border rounded-md bg-gray-50 text-sm">
                    {currentGuest.checkIn || 'No'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="checkOut">Check-out</Label>
                {isEditMode ? (
                  <select
                    id="checkOut"
                    value={currentGuest.checkOut || 'No'}
                    onChange={(e) => handleFieldChange('checkOut', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                ) : (
                  <div className="px-3 py-2 border rounded-md bg-gray-50 text-sm">
                    {currentGuest.checkOut || 'No'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="attending">Attending</Label>
                {isEditMode ? (
                  <select
                    id="attending"
                    value={currentGuest.attending || 'No'}
                    onChange={(e) => handleFieldChange('attending', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                ) : (
                  <div className="px-3 py-2 border rounded-md bg-gray-50 text-sm">
                    {currentGuest.attending || 'No'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          {isEditMode ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

