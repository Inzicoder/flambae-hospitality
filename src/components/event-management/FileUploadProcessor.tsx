
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  rsvpStatus: 'confirmed' | 'pending' | 'declined';
  arrivalDate: string;
  arrivalTime: string;
  departureDate: string;
  departureTime: string;
  roomNumber: string;
  roomType: string;
  dietaryRestrictions: string;
  plusOne: string;
  transportNeeded: boolean;
  specialRequests: string;
  events: string[];
}

interface ProcessedData {
  totalRows: number;
  validGuests: Guest[];
  invalidRows: any[];
  mappingResults: {
    name: number;
    email: number;
    phone: number;
    rsvpStatus: number;
    dates: number;
  };
}

export const FileUploadProcessor = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check file type
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (!['csv', 'xlsx', 'xls'].includes(fileExtension || '')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file (.csv, .xlsx, .xls)",
          variant: "destructive"
        });
        return;
      }
      setFile(selectedFile);
      setProcessedData(null);
    }
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate file processing steps
      const steps = [
        "Reading file...",
        "Parsing data...",
        "Mapping columns...",
        "Validating guest information...",
        "Converting to RSVP format...",
        "Finalizing data..."
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(((i + 1) / steps.length) * 100);
      }

      // Mock processed data (in real implementation, this would parse the actual file)
      const mockProcessedData: ProcessedData = {
        totalRows: 50,
        validGuests: [
          {
            id: 1,
            name: "John Smith",
            email: "john@example.com",
            phone: "+1234567890",
            rsvpStatus: "confirmed",
            arrivalDate: "2024-06-14",
            arrivalTime: "15:30",
            departureDate: "2024-06-16",
            departureTime: "11:00",
            roomNumber: "A-101",
            roomType: "Deluxe Double",
            dietaryRestrictions: "Vegetarian",
            plusOne: "Jane Smith",
            transportNeeded: true,
            specialRequests: "Ground floor room",
            events: ["Haldi", "Mehendi", "Wedding"]
          },
          {
            id: 2,
            name: "Emily Johnson",
            email: "emily@example.com",
            phone: "+1234567891",
            rsvpStatus: "pending",
            arrivalDate: "2024-06-14",
            arrivalTime: "18:00",
            departureDate: "2024-06-15",
            departureTime: "14:00",
            roomNumber: "",
            roomType: "",
            dietaryRestrictions: "No restrictions",
            plusOne: "",
            transportNeeded: false,
            specialRequests: "",
            events: ["Wedding", "Reception"]
          }
        ],
        invalidRows: [
          { row: 5, reason: "Missing email address", data: { name: "Invalid Guest" } },
          { row: 12, reason: "Invalid phone format", data: { name: "Another Guest", phone: "invalid" } }
        ],
        mappingResults: {
          name: 48,
          email: 46,
          phone: 45,
          rsvpStatus: 40,
          dates: 38
        }
      };

      setProcessedData(mockProcessedData);
      toast({
        title: "File processed successfully!",
        description: `${mockProcessedData.validGuests.length} guests extracted from ${mockProcessedData.totalRows} rows.`
      });

    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const importToRSVP = () => {
    if (!processedData) return;

    // In a real implementation, this would integrate with your RSVP system
    toast({
      title: "Data imported successfully!",
      description: `${processedData.validGuests.length} guests have been added to your RSVP system.`
    });

    // Reset the component
    setFile(null);
    setProcessedData(null);
    setProgress(0);
  };

  const downloadTemplate = () => {
    // Create a sample CSV template
    const csvContent = `Name,Email,Phone,RSVP Status,Arrival Date,Arrival Time,Departure Date,Departure Time,Room Type,Dietary Restrictions,Plus One,Transport Needed,Special Requests,Events
John Smith,john@example.com,+1234567890,confirmed,2024-06-14,15:30,2024-06-16,11:00,Deluxe Double,Vegetarian,Jane Smith,Yes,Ground floor room,"Haldi,Mehendi,Wedding"
Emily Johnson,emily@example.com,+1234567891,pending,2024-06-14,18:00,2024-06-15,14:00,Standard Double,None,,No,,"Wedding,Reception"`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guest-data-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Template downloaded",
      description: "Use this template to format your guest data."
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl text-slate-800">Upload Guest Data</span>
              <CardDescription className="mt-1">
                Upload Excel or CSV files to automatically import guest information into your RSVP system
              </CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                <FileSpreadsheet className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" className="w-full" asChild>
                      <span>Choose File</span>
                    </Button>
                  </label>
                  <p className="text-sm text-slate-500">
                    Supports CSV, Excel (.xlsx, .xls) files
                  </p>
                </div>
              </div>

              {file && (
                <Alert>
                  <FileSpreadsheet className="h-4 w-4" />
                  <AlertDescription>
                    Selected: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-slate-700">Expected Columns</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Name', 'Email', 'Phone', 'RSVP Status', 
                  'Arrival Date', 'Departure Date', 'Room Type', 
                  'Dietary Restrictions', 'Plus One', 'Events'
                ].map((column) => (
                  <Badge key={column} variant="outline" className="text-xs">
                    {column}
                  </Badge>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadTemplate}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>

          {/* Processing Section */}
          {isProcessing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing file...</span>
                <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Results Section */}
          {processedData && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Processing Complete!</strong> Found {processedData.validGuests.length} valid guests 
                  from {processedData.totalRows} total rows.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{processedData.totalRows}</div>
                  <div className="text-sm text-blue-800">Total Rows</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{processedData.validGuests.length}</div>
                  <div className="text-sm text-green-800">Valid Guests</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{processedData.invalidRows.length}</div>
                  <div className="text-sm text-red-800">Invalid Rows</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">{processedData.mappingResults.email}</div>
                  <div className="text-sm text-yellow-800">Emails Found</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{processedData.mappingResults.dates}</div>
                  <div className="text-sm text-purple-800">Date Info Found</div>
                </div>
              </div>

              {processedData.invalidRows.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Warning:</strong> {processedData.invalidRows.length} rows could not be processed due to missing or invalid data.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button 
              onClick={processFile} 
              disabled={!file || isProcessing}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? "Processing..." : "Process File"}
            </Button>
            
            {processedData && (
              <Button 
                onClick={importToRSVP}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Import to RSVP System
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
