const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:admin123@localhost:5432/smartgrade?schema=public';
const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
const useSsl = !isLocal && (connectionString.includes('sslmode=require') || connectionString.includes('render.com') || process.env.NODE_ENV === 'production');

const pool = new Pool({
    connectionString,
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {})
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Setting up clean SmartGrade College database...');

    // Hash demo password
    const hashedPassword = await bcrypt.hash('demo123', 10);

    // 1. Create or Update Core Demo Users
    const student = await prisma.user.upsert({
        where: { email: 'student@demo.com' },
        update: { password: hashedPassword, role: 'STUDENT', name: 'Arjun' },
        create: {
            email: 'student@demo.com',
            password: hashedPassword,
            name: 'Arjun',
            role: 'STUDENT',
        },
    });

    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@demo.com' },
        update: { password: hashedPassword, role: 'TEACHER', name: 'Prof. Sharma' },
        create: {
            email: 'teacher@demo.com',
            password: hashedPassword,
            name: 'Prof. Sharma',
            role: 'TEACHER',
        },
    });

    const parent = await prisma.user.upsert({
        where: { email: 'parent@demo.com' },
        update: { password: hashedPassword, role: 'PARENT', name: 'Mr. Patil' },
        create: {
            email: 'parent@demo.com',
            password: hashedPassword,
            name: 'Mr. Patil',
            role: 'PARENT',
        },
    });

    console.log('👤 Demo users ready: Student (Arjun), Teacher (Prof. Sharma), Parent (Mr. Patil).');

    // 2. Clear all dynamic activity data (Submissions, Assignments, Notifications, Messages)
    await prisma.submission.deleteMany({});
    await prisma.assignment.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.class.deleteMany({});

    console.log('🧹 Cleaned test assignments, submissions, notifications, and messages.');

    // 3. Create the 5 College Classes requested
    const subjects = [
        'Software Engineering',
        'Data Wrangling',
        'DSA',
        'PS',
        'OS'
    ];

    for (const sub of subjects) {
        const cls = await prisma.class.create({
            data: {
                name: `${sub} - Class A`,
                subject: sub,
            }
        });

        // Enroll student
        await prisma.enrollment.create({
            data: {
                userId: student.id,
                classId: cls.id,
            },
        });
    }

    console.log('🏫 Created 5 active subjects: Software Engineering, Data Wrangling, DSA, PS, OS.');
    console.log('✨ Clean slate ready for production deployment!');
}

main()
    .catch((e) => {
        console.error('Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
