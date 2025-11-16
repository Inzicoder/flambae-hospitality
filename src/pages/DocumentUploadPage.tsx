import React from 'react';
import { useParams } from 'react-router-dom';
import { DocumentUpload } from '@/components/DocumentUpload';
import { useToast } from '@/hooks/use-toast';

export const DocumentUploadPage = () => {
  const params = useParams<{ eventId: string; participantId: string }>();
  const { eventId, participantId } = params;

  const { toast } = useToast();

  if (!eventId || !participantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Missing Parameters</h2>
          <p className="text-gray-600">Event ID and Participant ID are required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <DocumentUpload 
        eventId={eventId}
        participantId={participantId}
        onUploadSuccess={() => {
          console.log('Documents uploaded successfully');
          toast({
            title: "Success",
            description: `Documents uploaded successfully`,
          });
        }}
      />
    </div>
  );
};

