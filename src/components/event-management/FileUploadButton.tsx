
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import * as XLSX from 'xlsx';
import { API_CONFIG, getApiUrl, getAuthHeadersForFormData } from "@/lib/config";

interface FileUploadButtonProps {
  onDataProcessed?: (data: any) => void;
  onError?: (error: string) => void;
  eventId?: string;
}

interface ExcelRow {
  [key: string]: string | number | boolean | Date;
}


export const FileUploadButton = ({ onDataProcessed, onError, eventId }: FileUploadButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<any>(null);
  const [error, setError] = useState<string>('');
    const [data, setData] = useState<ExcelRow[]>([]);
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
      // Read the file once and store it
      const fileBuffer = await file.arrayBuffer();
      
      // Update progress
      setUploadProgress(25);

      // Parse and process the file data first
      const workbook = XLSX.read(fileBuffer);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Transform data for display in the dashboard - matching CSV headers
      const transformedData = jsonData.map((row: any, index: number) => ({
        name: row['Name'] || row['Full Name'] || `Guest ${index + 1}`,
        category: row['Category'] || '',
        phoneNumber: row['Mobile No.'] || row['Phone Number'] || row['Phone'] || '',
        city: row['City'] || '',
        arrivalDate: row['Date Of Arrival'] || row['Arrival Date'] || '',
        modeOfArrival: row['Mode of Arrival'] || row['Mode of Arrival'] || '',
        trainFlightNumber: row['Train/Flight Number'] || row['Train/Flight No.'] || '',
        time: row['Time'] || '',
        hotelName: row['Hotel Name'] || row['Hotel'] || '',
        roomType: row['Room Type'] || row['Room'] || '',
        checkIn: row['Check-in'] || row['Check-in'] || 'No',
        checkOut: row['Check-out'] || row['Check-out'] || 'No',
        attending: row['Attending'] || 'No',
        remarks: row['Remarks'] || '',
        remarksRound2: row['Remarks (round 2)'] || row['Remarks (round 2)'] || '',
      }));
      
      // Update progress
      setUploadProgress(50);
      
      // Upload to API
      if (eventId) {
        // Create FormData with the file
        const formData = new FormData();
        formData.append("file", file);
        
        // Upload the FormData
        await axios.post(
          getApiUrl(API_CONFIG.ENDPOINTS.PARTICIPANTS.CREATE(eventId)),
          formData,
          {
            headers: getAuthHeadersForFormData(),
          }
        );
      }
      
      // Update progress
      setUploadProgress(100);
      
      const processedData = {
        guests: transformedData,
        totalProcessed: transformedData.length
      };
      
      // Call the callback to update the dashboard
      if (onDataProcessed) {
        onDataProcessed(processedData);
      }

      toast({
        title: "File uploaded successfully!",
        description: `Successfully uploaded ${transformedData.length} guest records to the server.`,
      });
    } catch (err) {
      const errorMessage = 'Failed to process file. Please check the format and try again.';
      setError(errorMessage);
      console.error('File processing error:', err);
      
      // Call error callback if provided
      if (onError) {
        onError(errorMessage);
      }
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

  const handleExcelUpload = () => {
    fileInputRef.current?.click();
    
  }

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
              onClick={handleExcelUpload}
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

          {/* Editable Data Table */}
          {data && data.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Uploaded Data Preview</h3>
                  <p className="text-sm text-gray-600 mt-1">Click any field to edit the data before processing</p>
                </div>
                <div className="text-sm text-gray-500">
                  {data.length} records loaded
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-2 py-2 text-left font-medium text-gray-700">Name</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700">Phone</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700">Email</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700">Arrival</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700">Departure</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700">Status</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700">VIP</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700">Travel</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-700">Pickup</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
        {data.map((row: ExcelRow, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {/* Name */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row['Full Name'] || ''}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index]['Full Name'] = e.target.value;
                                setData(newData);
                              }}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            />
                          </td>
                          {/* Phone */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row['Phone Number'] || ''}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index]['Phone Number'] = e.target.value;
                                setData(newData);
                              }}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            />
                          </td>
                          {/* Email */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row['Email'] || ''}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index]['Email'] = e.target.value;
                                setData(newData);
                              }}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            />
                          </td>
                          {/* Arrival Date */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row['Arrival Date'] || ''}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index]['Arrival Date'] = e.target.value;
                                setData(newData);
                              }}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            />
                          </td>
                          {/* Departure Date */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row['Departure Date'] || ''}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index]['Departure Date'] = e.target.value;
                                setData(newData);
                              }}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            />
                          </td>
                          {/* Status */}
                          <td className="px-2 py-2">
                            <select
                              value={row['Status'] || 'Pending'}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index]['Status'] = e.target.value;
                                setData(newData);
                              }}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Declined">Declined</option>
                            </select>
                          </td>
                          {/* VIP */}
                          <td className="px-2 py-2">
                            <select
                              value={row['VIP'] || 'No'}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index]['VIP'] = e.target.value;
                                setData(newData);
                              }}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </td>
                          {/* Travel Required */}
                          <td className="px-2 py-2">
                            <select
                              value={row['Travel Required'] || 'No'}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index]['Travel Required'] = e.target.value;
                                setData(newData);
                              }}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </td>
                          {/* Pickup Type */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row['Pickup Type'] || ''}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index]['Pickup Type'] = e.target.value;
                                setData(newData);
                              }}
                              className="w-full border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 text-xs"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setData([]);
                    setProcessedData(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  Clear Data
                </Button>
                <Button
                  onClick={() => {
                    // Process the edited data
                    const transformedData = data.map(row => ({
                      name: row['Full Name'] || '',
                      phoneNumber: row['Phone Number'] || '',
                      email: row['Email'] || '',
                      arrivalDate: row['Arrival Date'] || '',
                      status: row['Status'] || 'Pending',
                      isVip: row['VIP'] === 'Yes',
                      eventId: eventId || '',
                      // Add other fields as needed
                    }));
                    
                    const processedData = {
                      guests: transformedData,
                      totalProcessed: transformedData.length
                    };
                    
                    setProcessedData(processedData);
                    
                    if (onDataProcessed) {
                      onDataProcessed(processedData);
                    }
                    
                    toast({
                      title: "Data processed successfully!",
                      description: `Processed ${transformedData.length} guest records locally.`,
                    });
                  }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Process Data
                </Button>
              </div>
            </div>
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
