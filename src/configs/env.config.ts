/* Importing dependencies / library */
import dotenv from "dotenv";
import path from "path";

/* Importing files / configurations needed */
import { TEnvironment } from "../types/env.type";

/* Define the .env file */
dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

/* Function to get value of key variables */
const getEnvValues = (key: string, defaultValue?: string): string => {
  const value = process.env[key];

  if (!value && defaultValue === undefined) {
    throw new Error(`Missing required environment variables: ${key}`);
  }

  return value ?? defaultValue!;
};

/* Environment variables object */
const config: TEnvironment = {
  PORT: Number(getEnvValues("PORT", "8001")),
  NODE_ENV: getEnvValues("NODE_ENV", "development"),
  APP_ORIGIN: getEnvValues("APP_ORIGIN", "http://localhost:3000"),
  BASE_PATH: getEnvValues("BASE_PATH", "/api/v1"),
};

export { config };

export default config;
