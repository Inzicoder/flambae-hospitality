import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Ticket, 
  User, 
  Phone, 
  Home, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Plus,
  Loader2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { createHelpDeskTicket, CreateTicketRequest, HelpDeskTicket, PRIORITY_COLORS } from "@/lib/helpDeskApi";

interface HelpDeskFormProps {
  eventId: string;
  onSubmit?: (ticket: HelpDeskTicket) => void;
}

export const HelpDeskForm = ({ eventId, onSubmit }: HelpDeskFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateTicketRequest>({
    name: '',
    roomNumber: '',
    phoneNumber: '',
    request: '',
    priority: 'medium',
    eventId: eventId
  });

  const handleInputChange = (field: keyof CreateTicketRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim() || !formData.roomNumber.trim() || !formData.phoneNumber.trim() || !formData.request.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number format (exactly 10 digits)
    const cleanPhoneNumber = formData.phoneNumber.replace(/[\s\-\(\)]/g, '');
    if (!/^\d{10}$/.test(cleanPhoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Phone number must have exactly 10 digits.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create ticket via API
      const createdTicket = await createHelpDeskTicket(formData);

      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit(createdTicket);
      }

      // Show success message
      toast({
        title: "Ticket Created Successfully",
        description: `Ticket ${createdTicket.id} has been submitted with ${formData.priority} priority`,
      });

      // Reset form
      setFormData({
        name: '',
        roomNumber: '',
        phoneNumber: '',
        request: '',
        priority: 'medium',
        eventId: eventId
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Clock className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-blue-600" />
          Help Desk Ticket
        </CardTitle>
        <CardDescription>
          Submit a support request for assistance during the event
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="grid gap-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name *
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          {/* Room Number Field */}
          <div className="grid gap-2">
            <Label htmlFor="roomNumber" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Room Number *
            </Label>
            <Input
              id="roomNumber"
              placeholder="Enter your room number"
              value={formData.roomNumber}
              onChange={(e) => handleInputChange('roomNumber', e.target.value)}
              required
            />
          </div>

          {/* Phone Number Field */}
          <div className="grid gap-2">
            <Label htmlFor="phoneNumber" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              required
            />
          </div>

          {/* Priority Selection */}
          <div className="grid gap-2">
            <Label htmlFor="priority" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Priority Level *
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => handleInputChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Low Priority</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span>Medium Priority</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span>High Priority</span>
                  </div>
                </SelectItem>
                <SelectItem value="urgent">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span>Urgent Priority</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            {/* Priority Preview */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">Selected Priority:</span>
              <Badge variant="outline" className={getPriorityColor(formData.priority)}>
                {getPriorityIcon(formData.priority)}
                <span className="ml-1">{formData.priority}</span>
              </Badge>
            </div>
          </div>

          {/* Request Description */}
          <div className="grid gap-2">
            <Label htmlFor="request" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Request Description *
            </Label>
            <Textarea
              id="request"
              placeholder="Describe your request or issue in detail..."
              value={formData.request}
              onChange={(e) => handleInputChange('request', e.target.value)}
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              Please provide as much detail as possible to help us assist you better
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    name: '',
                    roomNumber: '',
                    phoneNumber: '',
                    request: '',
                    priority: 'medium',
                    eventId: eventId
                  });
                }}
                disabled={isSubmitting}
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Ticket
                  </>
                )}
              </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

