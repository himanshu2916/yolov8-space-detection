import { FC, useRef, useEffect, useState } from "react";
import { useWebcam } from "@/hooks/useWebcam";
import { Detection } from "@/types/detection";

interface WebcamDisplayProps {
  inputMode: "webcam" | "upload";
  detectionResults: Detection[];
  detectionImage: string | null;
  onDetect: (imageData: string) => void;
  showLabels: boolean;
  showConfidence: boolean;
  isDetecting: boolean;
  isDetectionPaused: boolean;
}

const WebcamDisplay: FC<WebcamDisplayProps> = ({
  inputMode,
  detectionResults,
  detectionImage,
  onDetect,
  showLabels,
  showConfidence,
  isDetecting,
  isDetectionPaused
}) => {
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);

  // Initialize webcam
  const webcam = useWebcam({
    onFrame: (imageData) => {
      if (inputMode === "webcam" && !isDetectionPaused) {
        onDetect(imageData);
      }
    },
    enabled: inputMode === "webcam",
    captureInterval: 1000, // Every 1 second
  });

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedFile(result);
      
      // Create image element to get dimensions
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
        onDetect(result);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  // Draw detections on canvas
  useEffect(() => {
    const canvas = displayCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If we have a processed image, display that instead of drawing boxes
    if (detectionImage) {
      const img = new Image();
      img.onload = () => {
        // Resize canvas to match image dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = detectionImage;
      return;
    }

    // Draw bounding boxes if no processed image is available
    // Set canvas dimensions correctly based on input mode
    if (inputMode === "webcam" && webcam.videoRef.current) {
      canvas.width = webcam.videoRef.current.videoWidth;
      canvas.height = webcam.videoRef.current.videoHeight;
    } else if (inputMode === "upload" && uploadedImage) {
      canvas.width = uploadedImage.width;
      canvas.height = uploadedImage.height;
    }

    // Define colors for each class
    const colorMap: Record<string, string> = {
      "Toolbox": "#3B82F6", // blue
      "Oxygen Tank": "#22C55E", // green
      "Fire Extinguisher": "#EF4444", // red
      "Other": "#EAB308", // yellow
    };

    // Draw bounding boxes
    detectionResults.forEach((detection) => {
      const { box, className, confidence } = detection;
      const color = colorMap[className] || "#FFFFFF";
      
      // Draw box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
      
      // Draw label if enabled
      if (showLabels) {
        // Prepare label text
        let labelText = className;
        if (showConfidence) {
          labelText += ` ${(confidence * 100).toFixed(0)}%`;
        }
        
        // Draw label background
        ctx.fillStyle = color;
        const textMetrics = ctx.measureText(labelText);
        const textHeight = 20;
        ctx.fillRect(box.x, box.y - textHeight, textMetrics.width + 10, textHeight);
        
        // Draw label text
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "14px Arial";
        ctx.fillText(labelText, box.x + 5, box.y - 5);
      }
    });
  }, [detectionResults, detectionImage, inputMode, showLabels, showConfidence, webcam.videoRef, uploadedImage]);

  return (
    <div className="flex-1 relative flex items-center justify-center bg-slate-900 webcam-container">
      {/* Video display for webcam */}
      {inputMode === "webcam" && (
        <video
          ref={webcam.videoRef}
          autoPlay
          playsInline
          muted
          className="max-h-full max-w-full object-contain"
          style={{ display: webcam.isWebcamReady ? "block" : "none" }}
        />
      )}
      
      {/* Image display for uploaded file */}
      {inputMode === "upload" && uploadedFile && (
        <img 
          src={uploadedFile} 
          alt="Uploaded" 
          className="max-h-full max-w-full object-contain" 
        />
      )}
      
      {/* Canvas overlay for detections */}
      <canvas 
        ref={displayCanvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ 
          width: "100%", 
          height: "100%", 
          objectFit: "contain",
          display: detectionResults.length > 0 || detectionImage ? "block" : "none" 
        }}
      />
      
      {/* Hidden canvas for frame capture */}
      <canvas ref={webcam.canvasRef} className="hidden" />
      
      {/* Webcam not connected message */}
      {inputMode === "webcam" && !webcam.isWebcamReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 bg-opacity-90">
          <i className="ri-webcam-off-line text-4xl text-slate-400 mb-2"></i>
          <p className="text-slate-300 mb-4">Webcam not connected</p>
          <button 
            onClick={webcam.initWebcam}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
          >
            Enable Webcam
          </button>
          {webcam.error && (
            <p className="text-red-400 mt-4 text-sm">{webcam.error}</p>
          )}
        </div>
      )}
      
      {/* Upload placeholder */}
      {inputMode === "upload" && !uploadedFile && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 bg-opacity-90">
          <i className="ri-upload-cloud-line text-4xl text-slate-400 mb-2"></i>
          <p className="text-slate-300 mb-4">Drag & drop image or video</p>
          <label className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md cursor-pointer transition">
            Browse Files
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      )}
      
      {/* Loading indicator */}
      {isDetecting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-2 text-white text-sm">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamDisplay;
