import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// New schema for object detection
export const detectionObjects = pgTable("detection_objects", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  className: text("class_name").notNull(),
  confidence: real("confidence").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertObjectSchema = createInsertSchema(detectionObjects).omit({
  id: true,
});

export type InsertObject = z.infer<typeof insertObjectSchema>;
export type DetectionObject = typeof detectionObjects.$inferSelect;

export const detectionSessions = pgTable("detection_sessions", {
  id: text("id").primaryKey(),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  processedFrames: integer("processed_frames").default(0),
  avgConfidence: real("avg_confidence"),
  avgProcessingTime: real("avg_processing_time"),
});

export const insertSessionSchema = createInsertSchema(detectionSessions).omit({
  endTime: true,
  processedFrames: true,
  avgConfidence: true,
  avgProcessingTime: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type DetectionSession = typeof detectionSessions.$inferSelect;

// Detection request/response schemas
export const objectDetectionRequestSchema = z.object({
  image: z.string().optional(), // base64 encoded image
  sessionId: z.string().optional(),
  classes: z.array(z.string()).optional(),
});

export type ObjectDetectionRequest = z.infer<typeof objectDetectionRequestSchema>;

// Define the detection result schema
export const detectionResultSchema = z.object({
  className: z.string(),
  confidence: z.number(),
  box: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  }),
});

export type DetectionResult = z.infer<typeof detectionResultSchema>;

export const detectionResponseSchema = z.object({
  detections: z.array(detectionResultSchema),
  processedImage: z.string().optional(), // base64 encoded image
  processingTime: z.number().optional(),
  sessionId: z.string(),
});

export type DetectionResponse = z.infer<typeof detectionResponseSchema>;

// Stats response schema
export const statsResponseSchema = z.object({
  objectCounts: z.record(z.string(), z.number()),
  totalObjects: z.number(),
  avgConfidence: z.number(),
  processedFrames: z.number(),
  processingTime: z.number(),
  detectionHistory: z.array(z.object({
    className: z.string(),
    timestamp: z.string(),
    action: z.string(),
  })),
  safetyAlerts: z.array(z.object({
    type: z.string(),
    message: z.string(),
    level: z.string(),
  })),
});

export type StatsResponse = z.infer<typeof statsResponseSchema>;
