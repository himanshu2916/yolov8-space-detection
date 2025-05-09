import { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Detection, DetectionResponse, DetectionSettings, InputMode, Stats } from "@/types/detection";
import { apiRequest } from "@/lib/queryClient";

interface UseDetectionProps {
  inputMode: InputMode;
  settings: DetectionSettings;
}

export function useDetection({ inputMode, settings }: UseDetectionProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResults, setDetectionResults] = useState<DetectionResponse | null>(null);
  const [detectionImage, setDetectionImage] = useState<string | null>(null);
  const [isDetectionPaused, setIsDetectionPaused] = useState(false);

  // Initialize session if needed
  useEffect(() => {
    if (!sessionId) {
      // Generate a simple UUID for the session
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
    }
  }, [sessionId]);

  // Function to detect objects in an image
  const detectMutation = useMutation({
    mutationFn: async ({ image }: { image: string }) => {
      setIsDetecting(true);
      
      // Convert enabled classes to array
      const enabledClasses = Object.entries(settings.enabledClasses)
        .filter(([_, enabled]) => enabled)
        .map(([className]) => className);

      try {
        const response = await apiRequest('POST', '/api/detect-base64', {
          image,
          sessionId,
          classes: enabledClasses.length > 0 ? enabledClasses : undefined,
        });
        const data: DetectionResponse = await response.json();
        return data;
      } finally {
        setIsDetecting(false);
      }
    },
    onSuccess: (data) => {
      setDetectionResults(data);
      if (data.processedImage) {
        setDetectionImage(data.processedImage);
      }
    },
  });

  // Get detection statistics
  const statsQuery = useQuery({
    queryKey: ['/api/stats', sessionId],
    enabled: !!sessionId,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Function to detect objects in the current frame
  const detectObjects = useCallback((imageData: string) => {
    if (isDetectionPaused || isDetecting) return;
    
    detectMutation.mutate({ image: imageData });
  }, [detectMutation, isDetectionPaused, isDetecting]);

  // Function to toggle detection pause state
  const toggleDetectionPause = useCallback(() => {
    setIsDetectionPaused(prev => !prev);
  }, []);

  return {
    sessionId,
    isDetecting,
    detectionResults,
    detectionImage,
    stats: statsQuery.data as Stats | undefined,
    isStatsLoading: statsQuery.isLoading,
    detectObjects,
    isDetectionPaused,
    toggleDetectionPause,
  };
}
