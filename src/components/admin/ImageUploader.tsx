
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadResultImage, removeResultImage } from "@/lib/database";

interface ImageUploaderProps {
  studentId: string;
  currentImage: string | null | undefined;
  onImageUpdate: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  studentId, 
  currentImage, 
  onImageUpdate 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image is too large. Maximum file size is 2MB.");
      return;
    }
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Convert the file to Base64
      const base64 = await convertFileToBase64(file);
      
      // Upload the image
      const success = uploadResultImage(studentId, base64);
      
      if (success) {
        toast.success("Result image uploaded successfully");
        onImageUpdate();
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("An error occurred while processing the image");
      console.error(error);
    } finally {
      setIsUploading(false);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const handleRemoveImage = () => {
    const success = removeResultImage(studentId);
    
    if (success) {
      toast.success("Result image removed successfully");
      onImageUpdate();
    } else {
      toast.error("Failed to remove image");
    }
  };
  
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        {currentImage && (
          <div className="relative">
            <img 
              src={currentImage} 
              alt="Result" 
              className="max-w-full h-auto max-h-56 rounded-md"
            />
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-sm"
          >
            {isUploading ? "Uploading..." : currentImage ? "Change Image" : "Upload Image"}
          </Button>
          
          {currentImage && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemoveImage}
              className="text-sm"
            >
              Remove Image
            </Button>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Upload an image of the student's result (max 2MB). This will be visible to the student.
      </p>
    </div>
  );
};

export default ImageUploader;
