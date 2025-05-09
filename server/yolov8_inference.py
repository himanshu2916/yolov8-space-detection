#!/usr/bin/env python3
import argparse
import base64
import json
import os
import sys
import time
from io import BytesIO
from typing import Dict, List, Optional, Tuple, Union

import cv2
import numpy as np

# Simulated YOLOv8 inference (would normally use ultralytics package)
# In a real implementation, you would:
# from ultralytics import YOLO
# model = YOLO("yolov8n.pt")

class MockYOLOv8:
    """Mock YOLOv8 model for development without actual model."""
    
    def __init__(self):
        # Define the classes our mock detector will "recognize"
        self.classes = ["Toolbox", "Oxygen Tank", "Fire Extinguisher", "Other"]
    
    def detect(self, img: np.ndarray, conf: float = 0.45, classes: Optional[List[str]] = None) -> List[Dict]:
        """Simulate YOLO detection with mock objects."""
        height, width = img.shape[:2]
        results = []
        
        # Filter classes if provided
        available_classes = self.classes
        if classes:
            available_classes = [cls for cls in self.classes if cls in classes]
        
        # Create a deterministic but somewhat random detection based on image content
        # This gives us stable results for the same image
        img_hash = sum(np.mean(img, axis=(0, 1)))
        np.random.seed(int(img_hash * 1000) % 100000)
        
        num_objects = np.random.randint(2, 6)
        
        for _ in range(num_objects):
            class_idx = np.random.randint(0, len(available_classes))
            class_name = available_classes[class_idx]
            
            # Generate a detection box
            box_width = np.random.randint(width // 8, width // 3)
            box_height = np.random.randint(height // 8, height // 3)
            x = np.random.randint(0, width - box_width)
            y = np.random.randint(0, height - box_height)
            
            # Set higher confidence for specific classes
            if class_name == "Fire Extinguisher":
                confidence = np.random.uniform(0.85, 0.97)
            elif class_name == "Oxygen Tank":
                confidence = np.random.uniform(0.80, 0.95)
            else:
                confidence = np.random.uniform(0.65, 0.92)
            
            # Only include detections above threshold
            if confidence >= conf:
                results.append({
                    "class_name": class_name,
                    "confidence": float(confidence),
                    "box": {
                        "x": int(x),
                        "y": int(y),
                        "width": int(box_width),
                        "height": int(box_height)
                    }
                })
        
        return results

def draw_detections(image: np.ndarray, detections: List[Dict]) -> np.ndarray:
    """Draw bounding boxes and labels on the image."""
    result_img = image.copy()
    
    # Color mapping for classes
    color_map = {
        "Toolbox": (255, 144, 30),  # Blue (BGR)
        "Oxygen Tank": (30, 255, 144),  # Green (BGR)
        "Fire Extinguisher": (30, 30, 255),  # Red (BGR)
        "Other": (30, 255, 255)  # Yellow (BGR)
    }
    
    for det in detections:
        # Extract information
        class_name = det["class_name"]
        confidence = det["confidence"]
        box = det["box"]
        x, y, w, h = box["x"], box["y"], box["width"], box["height"]
        
        # Get color for this class (default to white if not in map)
        color = color_map.get(class_name, (255, 255, 255))
        
        # Draw box
        cv2.rectangle(result_img, (x, y), (x + w, y + h), color, 2)
        
        # Prepare label with class name and confidence
        label = f"{class_name}: {confidence:.2f}"
        
        # Get size of label text for background rectangle
        (text_width, text_height), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
        
        # Draw label background
        cv2.rectangle(
            result_img, 
            (x, y - text_height - 10), 
            (x + text_width + 5, y), 
            color, 
            -1
        )
        
        # Draw label text
        cv2.putText(
            result_img, 
            label, 
            (x, y - 5), 
            cv2.FONT_HERSHEY_SIMPLEX, 
            0.5, 
            (0, 0, 0), 
            1, 
            cv2.LINE_AA
        )
    
    return result_img

def encode_image_to_base64(image: np.ndarray) -> str:
    """Convert an OpenCV image to base64 string."""
    _, buffer = cv2.imencode('.jpg', image)
    return base64.b64encode(buffer).decode('utf-8')

def decode_base64_to_image(base64_string: str) -> np.ndarray:
    """Convert a base64 string to an OpenCV image."""
    image_data = base64.b64decode(base64_string)
    image_array = np.frombuffer(image_data, np.uint8)
    return cv2.imdecode(image_array, cv2.IMREAD_COLOR)

def read_image(image_path: Optional[str] = None, base64_data: Optional[str] = None) -> np.ndarray:
    """Read image from file path or base64 data."""
    if image_path:
        # Read from file
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")
        return cv2.imread(image_path)
    elif base64_data:
        # Read from base64
        return decode_base64_to_image(base64_data)
    else:
        raise ValueError("Either image_path or base64_data must be provided")

def main():
    parser = argparse.ArgumentParser(description="YOLOv8 Object Detection")
    parser.add_argument("--image-path", help="Path to input image file")
    parser.add_argument("--base64-stdin", action="store_true", help="Read base64 image from stdin")
    parser.add_argument("--session-id", required=True, help="Session ID for tracking")
    parser.add_argument("--conf-threshold", type=float, default=0.45, help="Confidence threshold")
    parser.add_argument("--classes", help="Comma-separated list of classes to detect")
    
    args = parser.parse_args()
    
    try:
        # Read base64 image from stdin if specified
        base64_data = None
        if args.base64_stdin:
            base64_data = sys.stdin.read().strip()
        
        # Process class filter
        class_filter = None
        if args.classes:
            class_filter = args.classes.split(",")
        
        # Initialize the model
        model = MockYOLOv8()
        
        # Read the image
        start_time = time.time()
        image = read_image(args.image_path, base64_data)
        
        # Perform object detection
        detections = model.detect(
            image, 
            conf=args.conf_threshold,
            classes=class_filter
        )
        
        # Draw bounding boxes on the image
        result_image = draw_detections(image, detections)
        
        # Calculate processing time
        processing_time = (time.time() - start_time) * 1000  # in milliseconds
        
        # Prepare the response
        response = {
            "detections": detections,
            "processedImage": encode_image_to_base64(result_image),
            "processingTime": processing_time,
            "sessionId": args.session_id
        }
        
        # Output the JSON response
        print(json.dumps(response))
        
    except Exception as e:
        # Print error to stderr and return error JSON to stdout
        print(f"Error: {str(e)}", file=sys.stderr)
        error_response = {
            "error": str(e),
            "sessionId": args.session_id if hasattr(args, 'session_id') else "unknown"
        }
        print(json.dumps(error_response))
        sys.exit(1)

if __name__ == "__main__":
    main()
