// import Redis from "ioredis";

// export const redisClient = new Redis(
//   "default:AZ6IAAIncDFiMjY0MGFhMDM0NmY0NWU1ODBhZDNkNWEyOGFjNWNiYXAxNDA1ODQ@accurate-sculpin-40584.upstash.io:6379"
// );


import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL environment variable is not set");
}

export const redisClient = new Redis(redisUrl, {
  tls: {}, // Ensure that TLS is correctly enabled for Upstash
  maxRetriesPerRequest: null // Set to null to disable the limit
});

