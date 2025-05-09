import { useState, useRef, useCallback, useEffect } from "react";

interface UseWebcamProps {
  onFrame?: (imageData: string) => void;
  enabled?: boolean;
  captureInterval?: number;
  resolution?: {
    width: number | undefined;
    height: number | undefined;
  };
}

export function useWebcam({
  onFrame,
  enabled = true,
  captureInterval = 1000, // 1 second default
  resolution = { width: 1280, height: 720 },
}: UseWebcamProps = {}) {
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Initialize webcam
  const initWebcam = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("WebCam API not supported in this browser");
      }

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: resolution.width },
          height: { ideal: resolution.height },
        },
        audio: false,
      });

      // Store stream and update video element
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamReady(true);
        setError(null);
      }
    } catch (err) {
      setIsWebcamReady(false);
      setError(`Failed to access webcam: ${err instanceof Error ? err.message : String(err)}`);
      console.error("Webcam error:", err);
    }
  }, [resolution]);

  // Stop webcam
  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsWebcamReady(false);
  }, []);

  // Toggle webcam state
  const toggleWebcam = useCallback(() => {
    if (isWebcamEnabled) {
      stopWebcam();
      setIsWebcamEnabled(false);
    } else {
      initWebcam();
      setIsWebcamEnabled(true);
    }
  }, [isWebcamEnabled, initWebcam, stopWebcam]);

  // Capture current frame
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !isWebcamReady || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to base64 image
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Call onFrame callback if provided
    if (onFrame) {
      onFrame(imageData);
    }
    
    return imageData;
  }, [isWebcamReady, onFrame]);

  // Setup automatic frame capture if enabled
  useEffect(() => {
    if (isWebcamEnabled && isWebcamReady && onFrame) {
      // Clear any existing interval
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      
      // Set new interval for frame capture
      intervalRef.current = window.setInterval(() => {
        captureFrame();
      }, captureInterval);
    }
    
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isWebcamEnabled, isWebcamReady, captureFrame, captureInterval, onFrame]);

  // Initialize webcam when component mounts
  useEffect(() => {
    if (enabled) {
      initWebcam();
    }
    
    return () => {
      stopWebcam();
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [enabled, initWebcam, stopWebcam]);

  return {
    videoRef,
    canvasRef,
    isWebcamReady,
    isWebcamEnabled,
    error,
    captureFrame,
    toggleWebcam,
    initWebcam,
    stopWebcam,
  };
}
