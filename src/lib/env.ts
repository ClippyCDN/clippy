import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_WEBSITE_NAME: z.string(),
    NEXT_PUBLIC_WEBSITE_DESCRIPTION: z.string(),
    NEXT_PUBLIC_WEBSITE_LOGO: z.string(),
    NEXT_PUBLIC_WEBSITE_URL: z.string(),
  },

  shared: {
    NEXT_PUBLIC_APP_ENV: z.string(),
    NEXT_PUBLIC_ALLOW_REGISTRATIONS: z.boolean().optional().default(true),
  },

  server: {
    // Database
    DATABASE_URL: z.string(),

    // Better Auth
    BETTER_AUTH_SECRET: z.string(),

    // Storage Provider
    STORAGE_PROVIDER: z.enum(["S3", "LOCAL"]),

    // Local Storage
    STORAGE_LOCAL_PATH: z.string(),

    // S3 Storage
    STORAGE_S3_ENDPOINT: z.string(),
    STORAGE_S3_PORT: z.number(),
    STORAGE_S3_USE_SSL: z.boolean(),
    STORAGE_S3_ACCESS_KEY: z.string(),
    STORAGE_S3_SECRET_KEY: z.string(),
    STORAGE_S3_BUCKET: z.string(),

    // File Upload
    ALLOWED_MIME_TYPES: z.string().optional(),
    FILE_ID_LENGTH: z.number().optional().default(8),
    COMPRESS_IMAGES: z.boolean().optional().default(true),

    // Short URL
    SHORT_URL_LENGTH: z.number().optional().default(6),

    // Misc
    LOG_LEVEL: z
      .enum(["debug", "info", "warn", "error"])
      .optional()
      .default("info"),
  },

  /**
   * This is the environment variables that are available on the server.
   */
  runtimeEnv: {
    /**
     * Client
     */

    NEXT_PUBLIC_WEBSITE_NAME: process.env.NEXT_PUBLIC_WEBSITE_NAME ?? "Clippy",
    NEXT_PUBLIC_WEBSITE_DESCRIPTION:
      process.env.NEXT_PUBLIC_WEBSITE_DESCRIPTION ??
      "Open Source ShareX Uploader.",
    NEXT_PUBLIC_WEBSITE_LOGO:
      process.env.NEXT_PUBLIC_WEBSITE_LOGO ?? "/logo.png",
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,

    /**
     * Shared
     */

    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
    NEXT_PUBLIC_ALLOW_REGISTRATIONS:
      process.env.NEXT_PUBLIC_ALLOW_REGISTRATIONS === "true",

    /**
     * Server
     */

    // Database
    DATABASE_URL: process.env.DATABASE_URL,

    // Better Auth
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

    // Storage Provider
    STORAGE_PROVIDER: process.env.STORAGE_PROVIDER,

    // Local Storage
    STORAGE_LOCAL_PATH: process.env.STORAGE_LOCAL_PATH,

    // S3 Storage
    STORAGE_S3_ENDPOINT: process.env.STORAGE_S3_ENDPOINT,
    STORAGE_S3_PORT: Number(process.env.STORAGE_S3_PORT),
    STORAGE_S3_USE_SSL: process.env.STORAGE_S3_USE_SSL === "true",
    STORAGE_S3_ACCESS_KEY: process.env.STORAGE_S3_ACCESS_KEY,
    STORAGE_S3_SECRET_KEY: process.env.STORAGE_S3_SECRET_KEY,
    STORAGE_S3_BUCKET: process.env.STORAGE_S3_BUCKET,

    // File Upload
    ALLOWED_MIME_TYPES: process.env.ALLOWED_MIME_TYPES,
    FILE_ID_LENGTH: Number(process.env.FILE_ID_LENGTH ?? 8),
    COMPRESS_IMAGES: process.env.COMPRESS_IMAGES === "true",

    // Short URL
    SHORT_URL_LENGTH: Number(process.env.SHORT_URL_LENGTH ?? 6),

    // Misc
    LOG_LEVEL: process.env.LOG_LEVEL,
  },

  /**
   * This is the prefix for the environment variables that are available on the client.
   */
  clientPrefix: "NEXT_PUBLIC_",

  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,

  skipValidation: true,
});
