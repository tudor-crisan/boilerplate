import dotenv from "dotenv";
import fs from "fs";
import path from "path";

/**
 * Loads environment variables for a specific application in development mode.
 * Standardizes loading from /env/env-dev/.env.dev.[appName]
 */
export function loadAppEnv() {
  if (typeof window !== "undefined") return;

  const appName = process.env.APP || process.env.NEXT_PUBLIC_APP;
  if (!appName) return;

  const envPath = path.join(process.cwd(), 'env', 'env-dev', `.env.dev.${appName}`);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, quiet: true });
  }
}
