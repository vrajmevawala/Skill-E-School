import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const webinars = await prisma.webinar.findMany();
  console.log(JSON.stringify(webinars, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
