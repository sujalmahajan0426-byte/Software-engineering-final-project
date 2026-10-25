import dotenv from 'dotenv';
dotenv.config();

import PrismaPkg from '@prisma/client';
import pgPkg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { PrismaClient } = PrismaPkg;
const { Pool } = pgPkg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:admin123@localhost:5432/smartgrade?schema=public';
const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
const useSsl = !isLocal && (connectionString.includes('sslmode=require') || connectionString.includes('render.com') || process.env.NODE_ENV === 'production');

const pool = new Pool({
    connectionString,
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {})
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
