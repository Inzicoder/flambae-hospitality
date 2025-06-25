
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface AIChatbotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AIChatbot = ({ open, onOpenChange }: AIChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you with your event management today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: generateAIResponse(inputMessage),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputMessage("");
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("guest") || lowerInput.includes("invite")) {
      return "I can help you with guest management! You can add guests, track RSVPs, manage room allocations, and handle logistics from the Guest Management tab.";
    } else if (lowerInput.includes("task") || lowerInput.includes("assign")) {
      return "For task management, go to the Task Management tab where you can assign tasks to coordinators, set priorities, and track progress.";
    } else if (lowerInput.includes("room") || lowerInput.includes("hotel")) {
      return "Room allocation can be managed in the Rooms & Gifts tab. You can assign rooms, track occupancy, and manage gift deliveries.";
    } else if (lowerInput.includes("pickup") || lowerInput.includes("transport")) {
      return "Use the Logistics tab to manage airport pickups, assign vehicles, and track guest transportation needs.";
    } else if (lowerInput.includes("help") || lowerInput.includes("support")) {
      return "The Help Desk tab shows all guest queries. You can respond to WhatsApp messages and track query resolution status.";
    } else {
      return "I'm here to help with your event management needs. You can ask me about guest management, task allocation, room assignments, logistics, or help desk operations.";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            AI Help & Support
          </DialogTitle>
          <DialogDescription>
            Get instant help with your event management tasks
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4 border rounded-lg">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isBot ? "" : "flex-row-reverse"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isBot ? "bg-blue-100" : "bg-green-100"
                }`}>
                  {message.isBot ? (
                    <Bot className="h-4 w-4 text-blue-600" />
                  ) : (
                    <User className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.isBot 
                    ? "bg-gray-100 text-gray-800" 
                    : "bg-blue-500 text-white"
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your question..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
