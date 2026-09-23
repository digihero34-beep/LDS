import { PrismaClient } from '@prisma/client';
import path from 'path';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
if (dbUrl.startsWith('file:.')) {
  const relativePath = dbUrl.replace('file:', '');
  const absolutePath = path.resolve(process.cwd(), relativePath);
  dbUrl = `file:${absolutePath.replace(/\\/g, '/')}`;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

