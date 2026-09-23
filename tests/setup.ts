import path from 'path';

// Disable live LLM calls during automated test runs for hermetic offline execution
process.env.LLM_API_KEY = '';

// If DATABASE_URL is not set, provide the default
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://neondb_owner:npg_U9ixa5rtOYGQ@ep-old-scene-b4x1emrr-pooler.c-6.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require";
}
