
import { PhotoGallery } from "@/components/PhotoGallery";

export const GalleryPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">Photo Gallery</h1>
        <p className="text-gray-600">Capture and share your wedding memories</p>
      </div>
      <PhotoGallery />
    </div>
  );
};
