import { PrismaClient } from "@prisma/client";
import { createPool } from "generic-pool";

const MAX_CLIENTS = Number(process.env.MAX_DB_POOLING_SIZE) || 20;
const NODE_ENV = process.env.NODE_ENV ?? "production";
const isDevelopment = NODE_ENV === "development";

const factory = {
  create: async () => {
    const client = new PrismaClient({
      log: isDevelopment ? ["error", "warn"] : ["error"],
    });
    await client.$connect();
    return client;
  },
  destroy: async (client: PrismaClient) => {
    await client.$disconnect();
  },
};

const prismaPool = createPool(factory, {
  max: MAX_CLIENTS,
  min: 2,
  acquireTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  evictionRunIntervalMillis: 1000,
  fifo: true,
});

export async function withPrisma<T>(callback: (prisma: PrismaClient) => Promise<T>): Promise<T> {
  const prisma = await prismaPool.acquire();
  try {
    return await callback(prisma);
  } finally {
    await prismaPool.release(prisma);
  }
}

export const prisma = new PrismaClient({
  log: isDevelopment ? ["error", "warn"] : ["error"],
});

// Handle cleanup on application shutdown
process.on("SIGINT", async () => {
  await prismaPool.drain();
  await prismaPool.clear();
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prismaPool.drain();
  await prismaPool.clear();
  await prisma.$disconnect();
  process.exit(0);
});
