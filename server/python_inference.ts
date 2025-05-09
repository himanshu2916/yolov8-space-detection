import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { DetectionResponse, DetectionResult } from "@shared/schema";

interface DetectionOptions {
  imagePath?: string;
  base64Image?: string;
  sessionId: string;
  confidenceThreshold?: number;
  classes?: string[];
}

function ensureScriptExists() {
  const scriptPath = path.join(process.cwd(), "server", "yolov8_inference.py");
  if (!fs.existsSync(scriptPath)) {
    throw new Error(`Python script not found at ${scriptPath}`);
  }
  return scriptPath;
}

export async function detectObjects(options: DetectionOptions): Promise<DetectionResponse> {
  return new Promise((resolve, reject) => {
    try {
      const scriptPath = ensureScriptExists();
      
      // Prepare arguments for the Python script
      const args = [
        scriptPath,
        "--session-id", options.sessionId,
      ];

      if (options.imagePath) {
        args.push("--image-path", options.imagePath);
      }

      if (options.base64Image) {
        // We'll pass base64 via stdin to avoid command line length limitations
        args.push("--base64-stdin");
      }

      if (options.confidenceThreshold !== undefined) {
        args.push("--conf-threshold", options.confidenceThreshold.toString());
      }

      if (options.classes && options.classes.length > 0) {
        args.push("--classes", options.classes.join(","));
      }

      // Spawn the Python process
      const pythonPath = process.env.PYTHON_PATH || 'python'; // Use 'python' as default
      console.log(`Using Python path: ${pythonPath}`);
      const pythonProcess = spawn(pythonPath, args);
      
      // If we have base64 data, send it to stdin
      if (options.base64Image) {
        pythonProcess.stdin.write(options.base64Image);
        pythonProcess.stdin.end();
      }

      let outputData = "";
      let errorData = "";

      pythonProcess.stdout.on("data", (data) => {
        outputData += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        errorData += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          return reject(new Error(`Python process exited with code ${code}: ${errorData}`));
        }

        try {
          // Parse the JSON output from the Python script
          const result: DetectionResponse = JSON.parse(outputData);
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse Python output: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
