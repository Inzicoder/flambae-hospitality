
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Search, Phone, Mail, MapPin, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const VendorManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [vendors] = useState([
    {
      id: 1,
      name: "Royal Photography",
      service: "Photography",
      contact: "John Photographer",
      phone: "+1234567890",
      email: "john@royalphoto.com",
      status: "confirmed",
      amount: 8500,
      paymentStatus: "partial",
      documents: ["contract.pdf", "quote.pdf"]
    },
    {
      id: 2,
      name: "Elegant Catering",
      service: "Catering",
      contact: "Sarah Chef",
      phone: "+1234567891",
      email: "sarah@elegantcatering.com",
      status: "confirmed",
      amount: 12000,
      paymentStatus: "paid",
      documents: ["menu.pdf", "contract.pdf"]
    },
    {
      id: 3,
      name: "Floral Dreams",
      service: "Flowers",
      contact: "Mike Florist",
      phone: "+1234567892",
      email: "mike@floraldreams.com",
      status: "pending",
      amount: 2500,
      paymentStatus: "pending",
      documents: ["proposal.pdf"]
    },
    {
      id: 4,
      name: "Grand Ballroom",
      service: "Venue",
      contact: "Lisa Manager",
      phone: "+1234567893",
      email: "lisa@grandballroom.com",
      status: "confirmed",
      amount: 15000,
      paymentStatus: "paid",
      documents: ["contract.pdf", "floor_plan.pdf"]
    }
  ]);

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addVendor = () => {
    toast({
      title: "Add vendor",
      description: "Vendor form will open here.",
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-orange-500" />
          <span>Vendor Manager</span>
        </CardTitle>
        <CardDescription>
          Manage all your wedding vendors in one place
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search vendors or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={addVendor}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-lg font-bold text-blue-600">{vendors.length}</p>
            <p className="text-sm text-blue-700">Total Vendors</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-lg font-bold text-green-600">{vendors.filter(v => v.status === 'confirmed').length}</p>
            <p className="text-sm text-green-700">Confirmed</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-lg font-bold text-yellow-600">{vendors.filter(v => v.paymentStatus === 'pending').length}</p>
            <p className="text-sm text-yellow-700">Payment Pending</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-lg font-bold text-purple-600">{vendors.reduce((sum, v) => sum + v.documents.length, 0)}</p>
            <p className="text-sm text-purple-700">Documents</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{vendor.name}</h3>
                  <p className="text-sm text-gray-600">{vendor.service}</p>
                </div>
                <div className="flex space-x-2">
                  <Badge 
                    variant={vendor.status === 'confirmed' ? 'default' : 'secondary'}
                  >
                    {vendor.status}
                  </Badge>
                  <Badge 
                    variant={vendor.paymentStatus === 'paid' ? 'default' : vendor.paymentStatus === 'partial' ? 'secondary' : 'destructive'}
                  >
                    {vendor.paymentStatus}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-3 w-3 mr-2" />
                  {vendor.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-3 w-3 mr-2" />
                  {vendor.email}
                </div>
                <div className="text-sm font-semibold">
                  ${vendor.amount.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Documents:</span>
                  {vendor.documents.map((doc, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {doc}
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-3 w-3 mr-1" />
                    Upload
                  </Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Add New Vendor
          </Button>
          <Button variant="outline">Import Vendors</Button>
          <Button variant="outline">Export List</Button>
        </div>
      </CardContent>
    </Card>
  );
};
