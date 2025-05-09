import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { detectObjects } from "./python_inference";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { objectDetectionRequestSchema, detectionResponseSchema, statsResponseSchema } from "@shared/schema";
import { z } from "zod";

// Set up file upload with multer
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadsDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
});

// Helper to validate request body
function validateRequest<T>(schema: z.ZodType<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    throw new Error(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload and process image for object detection
  app.post("/api/detect-image", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const sessionId = req.body.sessionId || uuidv4();
      const confidenceThreshold = 0.45; // Default confidence threshold
      const classes = req.body.classes ? JSON.parse(req.body.classes) : undefined;

      const imageResult = await detectObjects({
        imagePath: req.file.path,
        sessionId,
        confidenceThreshold,
        classes
      });

      // Clean up temporary file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });

      return res.status(200).json(imageResult);
    } catch (error) {
      console.error("Error processing image:", error);
      return res.status(500).json({ message: `Error processing image: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  });

  // Process base64 image for object detection
  app.post("/api/detect-base64", async (req, res) => {
    try {
      const requestData = validateRequest(objectDetectionRequestSchema, req.body);
      
      if (!requestData.image) {
        return res.status(400).json({ message: "No base64 image data provided" });
      }

      const sessionId = requestData.sessionId || uuidv4();
      
      const imageResult = await detectObjects({
        base64Image: requestData.image,
        sessionId,
        confidenceThreshold: 0.45, // Default confidence threshold
        classes: requestData.classes
      });

      return res.status(200).json(imageResult);
    } catch (error) {
      console.error("Error processing base64 image:", error);
      return res.status(500).json({ message: `Error processing image: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  });

  // Get detection statistics
  app.get("/api/stats/:sessionId?", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      
      // Simulate statistics for now, since we don't have persistent storage
      // In a real app, you would retrieve this from the database
      const stats = {
        objectCounts: {
          "Toolbox": 3,
          "Oxygen Tank": 2,
          "Fire Extinguisher": 1,
          "Other": 5
        },
        totalObjects: 11,
        avgConfidence: 0.864,
        processedFrames: 1248,
        processingTime: 42,
        detectionHistory: [
          {
            className: "Fire Extinguisher",
            timestamp: new Date(Date.now() - 300000).toISOString(),
            action: "Added to inventory"
          },
          {
            className: "Oxygen Tank",
            timestamp: new Date(Date.now() - 600000).toISOString(),
            action: "Removed from view"
          },
          {
            className: "Toolbox",
            timestamp: new Date(Date.now() - 900000).toISOString(),
            action: "Position changed"
          }
        ],
        safetyAlerts: []
      };

      return res.status(200).json(validateRequest(statsResponseSchema, stats));
    } catch (error) {
      console.error("Error getting stats:", error);
      return res.status(500).json({ message: `Error getting statistics: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
