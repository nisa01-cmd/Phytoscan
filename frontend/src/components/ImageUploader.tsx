import { useState, useCallback } from "react";
import { Upload, Camera, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isAnalyzing: boolean;
}

const ImageUploader = ({ onImageSelect, isAnalyzing }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
  console.log("FILE SELECTED:", file);

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    console.log("CALLING PARENT...");
    onImageSelect(file);   
  }
};
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreview(null);
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden shadow-lg fade-in-up">
          <img
            src={preview}
            alt="Crop to analyze"
            className="w-full h-64 sm:h-80 object-cover"
          />
          {isAnalyzing && (
            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 text-primary-foreground animate-spin" />
                <p className="text-primary-foreground font-medium text-sm">
                  Analyzing crop image…
                </p>
              </div>
            </div>
          )}
          {!isAnalyzing && (
            <button
              onClick={clearImage}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-foreground/60 text-primary-foreground hover:bg-foreground/80 transition-colors active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`upload-zone min-h-[260px] ${
            isDragging ? "border-primary bg-primary/15 scale-[1.01]" : ""
          }`}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-7 w-7 text-primary" />
          </div>
          <div className="text-center space-y-1.5">
            <p className="text-foreground font-semibold">
              Drop your crop image here
            </p>
            <p className="text-muted-foreground text-sm">
              or click to browse · JPG, PNG up to 10MB
            </p>
          </div>
          <div className="flex gap-2 mt-2">
          <label>
          <input
             type="file"
             accept="image/*"
             className="hidden"
             onChange={handleInputChange}
            />
    <Button size="sm" className="gap-2">
      <Upload className="h-4 w-4" />
      Upload
    </Button>
  </label>
</div>
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
