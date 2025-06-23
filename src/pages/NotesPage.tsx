
import { NotesCollaboration } from "@/components/NotesCollaboration";

export const NotesPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">Notes & Collaboration</h1>
        <p className="text-gray-600">Share ideas and collaborate on wedding planning</p>
      </div>
      <NotesCollaboration />
    </div>
  );
};
