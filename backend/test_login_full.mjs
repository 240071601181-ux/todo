import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from './src/utils/prisma.js';
import { signAccessToken, signRefreshToken } from './src/utils/jwt.js';

async function main() {
  try {
    // Find the user
    const user = await prisma.user.findUnique({ where: { email: 'santhosh@gmail.com' } });
    if (!user) {
      console.log('User not found');
      return;
    }
    console.log('User found:', user.id, user.email);
    console.log('Password hash exists:', !!user.password);
    console.log('Password hash length:', user.password?.length);

    // Test password comparison with a known bad password
    const valid = await bcrypt.compare('wrongpassword', user.password);
    console.log('Wrong password valid:', valid);

    // Test JWT signing
    const tokenId = crypto.randomUUID();
    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id, tokenId });
    console.log('JWT signing works, tokens generated');

    // Test creating refresh token in DB
    await prisma.refreshToken.create({
      data: {
        id: tokenId,
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    console.log('Refresh token saved to DB');

    // Test destructuring password from user
    const { password: _, ...safeUser } = user;
    console.log('Destructuring works, safeUser keys:', Object.keys(safeUser));
    console.log('ALL LOGIN STEPS PASSED');

  } catch(e) {
    console.error('ERROR:', e);
    console.error('Full stack:', e.stack);
  } finally {
    await prisma.$disconnect();
  }
}

main();