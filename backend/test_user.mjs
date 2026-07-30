import prisma from './src/utils/prisma.js';

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'santhosh@gmail.com' } });
  if (user) {
    const safe = { ...user, password: user.password?.substring(0, 20) + '...' };
    console.log(JSON.stringify(safe, null, 2));
  } else {
    console.log('User not found');
  }
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });