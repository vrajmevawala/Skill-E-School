import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Helper to replace Role enum since it's removed for SQLite (but works for Postgres too)
const Role = {
    ADMIN: "ADMIN",
    TRAINER: "TRAINER",
    FRANCHISE_PARTNER: "FRANCHISE_PARTNER",
    STUDENT: "STUDENT"
};

async function main() {
    // Use a clearer password for testing
    const hashedPassword = await bcrypt.hash("Admin@123", 12);

    // 1. Create Admins
    const admin = await prisma.user.upsert({
        where: { email: "admin@skille.com" },
        update: { password: hashedPassword },
        create: {
            email: "admin@skille.com",
            password: hashedPassword,
            role: Role.ADMIN,
            emailVerified: true,
            profile: {
                create: { firstName: "System", lastName: "Admin" },
            },
        },
    });

    // 2. Create Trainers & Experts
    const trainer = await prisma.user.upsert({
        where: { email: "trainer@skille.com" },
        update: {},
        create: {
            email: "trainer@skille.com",
            password: hashedPassword,
            role: Role.TRAINER,
            profile: {
                create: { firstName: "Sarah", lastName: "Johnson", bio: "Expert in Full-Stack Development" },
            },
            expertProfile: {
                create: {
                    specialization: "Full-Stack Web Development",
                    hourlyRate: 50.0,
                    slots: {
                        create: [
                            { startTime: new Date("2026-06-01T10:00:00Z"), endTime: new Date("2026-06-01T11:00:00Z") },
                            { startTime: new Date("2026-06-01T14:00:00Z"), endTime: new Date("2026-06-01T15:00:00Z") },
                        ],
                    },
                },
            },
        },
    });

    // 3. Create Franchise Partners
    const partner = await prisma.user.upsert({
        where: { email: "partner@skille.com" },
        update: {},
        create: {
            email: "partner@skille.com",
            password: hashedPassword,
            role: Role.FRANCHISE_PARTNER,
            profile: {
                create: { firstName: "Raj", lastName: "Mehta" },
            },
            franchisePartner: {
                create: {
                    territory: "Mumbai North",
                    leads: {
                        create: [
                            { name: "John Smith", email: "john@example.com", status: "NEW" },
                            { name: "Emily Green", email: "emily@example.com", status: "CONTACTED" },
                        ],
                    },
                    commissions: {
                        create: [
                            { amount: 150.0, source: "Franchise Royalty Feb" },
                            { amount: 200.0, source: "Course Referral - Web Dev" },
                        ],
                    },
                },
            },
        },
    });

    // 4. Categories & Courses
    const devCategory = await prisma.courseCategory.upsert({
        where: { name: "Development" },
        update: {},
        create: { name: "Development" },
    });

    // Check if course exists before creating to avoid duplicates in Postgres
    const existingCourse = await prisma.course.findFirst({ where: { title: "Mastering React and Node.js" } });
    if (!existingCourse) {
        await prisma.course.create({
            data: {
                title: "Mastering React and Node.js",
                description: "A comprehensive guide to building production-ready applications.",
                level: "Intermediate",
                price: 49.99,
                categoryId: devCategory.id,
                trainerId: trainer.id,
                lessons: {
                    create: [
                        { title: "Introduction to Hooks", order: 1, duration: 20 },
                        { title: "Prisma and Databases", order: 2, duration: 45 },
                    ],
                },
                resources: {
                    create: [{ name: "Source Code", type: "zip", url: "https://example.com/src.zip" }],
                },
            },
        });
    }

    // 5. Webinars
    
    // Clear existing webinars to avoid duplicates in testing
    await prisma.webinar.deleteMany({});

    await prisma.webinar.createMany({
        data: [
            {
                title: "Cloud Computing Masterclass",
                description: "Learn Cloud computing fundamentals and advanced architectures.",
                scheduledAt: new Date("2026-04-03T07:00:00Z"),
                duration: 60,
                status: "COMPLETED",
                isFree: false,
                price: 499,
                googleFormLink: "https://docs.google.com/forms/d/e/1FAIpQLSecGHiWvnBluLSfCNcMrow8yEKICYnRvslqbbZb7wGNPRpqAg/viewform?usp=dialog",
            },
            {
                title: "Hands On Building the Telescope",
                description: "Learn the basic making of telescope and astronomical concepts.",
                scheduledAt: new Date("2026-05-05T03:59:00Z"),
                duration: 90,
                status: "UPCOMING",
                isFree: true,
                googleFormLink: "https://docs.google.com/forms/d/e/1FAIpQLSecGHiWvnBluLSfCNcMrow8yEKICYnRvslqbbZb7wGNPRpqAg/viewform?usp=dialog",
            },
            {
                title: "The Future of Web Development 2026",
                description: "Live session on upcoming trends in AI and Web 3.0.",
                scheduledAt: new Date("2026-06-15T15:00:00Z"),
                duration: 60,
                status: "UPCOMING",
                isFree: true,
                googleFormLink: "https://forms.gle/example123",
            }
        ]
    });

    console.log("✅ Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
