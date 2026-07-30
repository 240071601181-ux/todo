import prisma from './src/utils/prisma.js';

async function main() {
  try {
    const users = await prisma.user.findMany({ take: 1 });
    console.log('DB connected. Users found:', users.length);
    if (users.length > 0) {
      console.log('First user email:', users[0].email);
    } else {
      console.log('No users found in database');
    }
  } catch(e) {
    console.error('DB Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();