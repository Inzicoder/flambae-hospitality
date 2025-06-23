
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export const PaymentManager = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-emerald-500" />
          <span>Invoice & Payment Manager</span>
        </CardTitle>
        <CardDescription>Track all invoices and payment statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">$25,000</p>
            <p className="text-sm text-green-700">Paid</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">$8,500</p>
            <p className="text-sm text-yellow-700">Pending</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">$2,000</p>
            <p className="text-sm text-red-700">Overdue</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <Button className="bg-emerald-500 hover:bg-emerald-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Invoice
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Button variant="outline">Payment Reminders</Button>
        </div>
      </CardContent>
    </Card>
  );
};
