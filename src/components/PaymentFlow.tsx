
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, CreditCard, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentFlowProps {
  onPaymentSuccess: (eventCode: string) => void;
  onBack: () => void;
}

export const PaymentFlow = ({ onPaymentSuccess, onBack }: PaymentFlowProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [eventCode, setEventCode] = useState('');
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const generatedCode = 'EC' + Math.random().toString(36).substr(2, 8).toUpperCase();
      setEventCode(generatedCode);
      setPaymentComplete(true);
      setIsProcessing(false);
      
      toast({
        title: "Payment Successful!",
        description: `Your event code is: ${generatedCode}`,
      });
    }, 3000);
  };

  const handleContinue = () => {
    onPaymentSuccess(eventCode);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-25 via-blush-50 to-lavender-50">
        <Card className="max-w-md w-full mx-4 bg-white/95 backdrop-blur-xl border-2 border-green-200/50 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
            <CardDescription>Your Event Company account has been created</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200">
              <p className="text-sm text-green-700 mb-2">Your Event Code:</p>
              <p className="text-2xl font-bold text-green-800 tracking-wider">{eventCode}</p>
              <p className="text-xs text-green-600 mt-2">Share this code with your clients</p>
            </div>
            <Button 
              onClick={handleContinue}
              className="w-full py-4 text-lg bg-green-600 hover:bg-green-700"
            >
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-25 via-blush-50 to-lavender-50">
      <Card className="max-w-md w-full mx-4 bg-white/95 backdrop-blur-xl border-2 border-purple-200/50 shadow-2xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-xl">Event Company Registration</CardTitle>
              <CardDescription>Complete your registration with payment</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-6 bg-purple-50 rounded-2xl border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Event Company Plan</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-700">Monthly Subscription</span>
                  <span className="font-semibold text-purple-800">$49.99</span>
                </div>
                <div className="text-sm text-purple-600">
                  • RSVP Management System
                  • Event Code Generation
                  • Client Dashboard Access
                  • 24/7 Support
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> After payment, you'll receive an event code to share with your clients for RSVP management.
              </p>
            </div>
          </div>

          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 text-lg bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            {isProcessing ? 'Processing Payment...' : 'Pay $49.99/month'}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Secure payment processing. Cancel anytime.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
