
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Plus, Share2 } from "lucide-react";

interface PhotoGalleryProps {
  gallery: {
    categories: string[];
    photos: any[];
  };
}

export const PhotoGallery = ({ gallery }: PhotoGalleryProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Camera className="h-6 w-6 text-purple-500" />
          <span>Memories & Gallery</span>
        </CardTitle>
        <CardDescription>Store and share your wedding photos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {gallery.categories.map((category, index) => (
            <div key={index} className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-rose-300 transition-colors cursor-pointer">
              <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">{category}</p>
              <p className="text-xs text-gray-500">0 photos</p>
            </div>
          ))}
        </div>
        <div className="flex space-x-4">
          <Button className="bg-purple-500 hover:bg-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            Upload Photos
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Gallery Link
          </Button>
          <Button variant="outline">Create Slideshow</Button>
        </div>
      </CardContent>
    </Card>
  );
};
