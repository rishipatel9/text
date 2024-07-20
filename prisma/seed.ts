import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      provider:"google",
      providerId:"1"
    },
  });

  await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@example.com',
      provider:"github",
      providerId:"1"
    },
  });

}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
