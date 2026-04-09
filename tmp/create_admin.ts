import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@skilleschool.com';
    const password = await bcrypt.hash('admin123', 12);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {
            role: 'ADMIN',
            password,
            emailVerified: true
        },
        create: {
            email,
            password,
            role: 'ADMIN',
            emailVerified: true,
            profile: {
                create: {
                    firstName: 'System',
                    lastName: 'Admin'
                }
            }
        }
    });

    console.log('Admin account created / updated: ' + admin.email + ' | pass: admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
