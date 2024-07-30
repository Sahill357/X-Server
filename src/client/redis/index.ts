 

import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL environment variable is not set");
}

export const redisClient = new Redis(redisUrl, {
  tls: {}, 
  maxRetriesPerRequest: null  
});

