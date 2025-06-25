
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FileUploadButtonProps {
  onDataProcessed?: (data: any) => void;
}

export const FileUploadButton = ({ onDataProcessed }: FileUploadButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setError('');
    setProcessedData(null);
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Simulate file processing with progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock processed data
      const mockData = {
        guests: [
          {
            id: '1',
            fullName: 'John Smith',
            phoneNumber: '+1234567890',
            email: 'john.smith@email.com',
            arrivalDateTime: '2024-06-15T14:30',
            departureDateTime: '2024-06-17T10:00',
            attendanceStatus: 'Confirmed',
            travelRequirement: 'Yes',
            isVIP: true
          },
          {
            id: '2',
            fullName: 'Sarah Johnson',
            phoneNumber: '+1234567891',
            email: 'sarah.johnson@email.com',
            arrivalDateTime: '2024-06-15T16:00',
            departureDateTime: '2024-06-17T12:00',
            attendanceStatus: 'Pending',
            travelRequirement: 'No',
            isVIP: false
          }
        ],
        logistics: [
          {
            id: '1',
            guestName: 'John Smith',
            pickupType: 'Airport Pickup',
            scheduledTime: '2024-06-15T14:00',
            location: 'Terminal 1 - Gate 3',
            assignedDriver: 'Mike Johnson',
            vehicle: 'Mercedes S-Class (ABC-123)',
            status: 'Scheduled',
            priority: 'VIP',
            notes: 'Flight delayed by 30 minutes'
          }
        ]
      };

      clearInterval(progressInterval);
      setUploadProgress(100);
      setProcessedData(mockData);
      
      if (onDataProcessed) {
        onDataProcessed(mockData);
      }

      toast({
        title: "File processed successfully!",
        description: `Imported ${mockData.guests.length} guests and ${mockData.logistics.length} logistics entries.`,
      });

    } catch (err) {
      setError('Failed to process file. Please check the format and try again.');
      console.error('File processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    // Create a simple CSV template
    const csvContent = `Full Name,Phone Number,Email,Arrival Date,Departure Date,Status,Travel Required,VIP,Pickup Type,Pickup Location,Driver,Vehicle
John Smith,+1234567890,john@email.com,2024-06-15 14:30,2024-06-17 10:00,Confirmed,Yes,Yes,Airport Pickup,Terminal 1,Mike Johnson,Mercedes S-Class
Sarah Johnson,+1234567891,sarah@email.com,2024-06-15 16:00,2024-06-17 12:00,Pending,No,No,,,`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guest-data-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-500" />
            Upload Guest & Logistics Data
          </DialogTitle>
          <DialogDescription>
            Upload Excel or CSV files to automatically populate guest management and logistics systems
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Upload your data file
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports Excel (.xlsx, .xls) and CSV files
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="mb-2"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadTemplate}
                className="text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Download Template
              </Button>
            </div>
          </div>

          {/* Processing Progress */}
          {isProcessing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing file...</span>
                <span className="text-sm text-gray-500">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Display */}
          {processedData && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="space-y-2">
                  <p className="font-medium">File processed successfully!</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Guests imported:</p>
                      <p>{processedData.guests?.length || 0} entries</p>
                    </div>
                    <div>
                      <p className="font-medium">Logistics entries:</p>
                      <p>{processedData.logistics?.length || 0} entries</p>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Data Preview */}
          {processedData && (
            <div className="space-y-4">
              <h3 className="font-medium">Data Preview</h3>
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-2 border-b">Name</th>
                      <th className="text-left p-2 border-b">Email</th>
                      <th className="text-left p-2 border-b">Status</th>
                      <th className="text-left p-2 border-b">Travel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedData.guests?.slice(0, 5).map((guest: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{guest.fullName}</td>
                        <td className="p-2">{guest.email}</td>
                        <td className="p-2">{guest.attendanceStatus}</td>
                        <td className="p-2">{guest.travelRequirement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            {processedData && (
              <Button onClick={() => {
                toast({
                  title: "Data integrated successfully!",
                  description: "Guest management and logistics systems have been updated.",
                });
                setIsOpen(false);
              }}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Integrate Data
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
