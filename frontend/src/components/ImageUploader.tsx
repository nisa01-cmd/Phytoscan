import { useState, useCallback, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isAnalyzing: boolean;
}

const ImageUploader = ({ onImageSelect, isAnalyzing }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null); // ✅ use ONE input

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img src={preview} className="w-full h-80 object-cover" />

          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="animate-spin text-white w-8 h-8" />
            </div>
          )}

          {!isAnalyzing && (
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 bg-black/60 p-2 rounded-full hover:scale-110 transition"
            >
              <X className="text-white w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()} // ✅ click box works
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`upload-zone cursor-pointer ${isDragging ? "scale-105" : ""}`}
        >
          {/* ✅ SINGLE INPUT */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleInputChange}
          />

          <Upload className="w-10 h-10 text-primary" />
          <p>Upload crop image</p>

          {/* ✅ FIXED BUTTON */}
          <Button
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation(); // 🔥 prevents double trigger
              fileInputRef.current?.click();
            }}
          >
            Select Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;