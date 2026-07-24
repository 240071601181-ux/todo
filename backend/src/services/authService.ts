import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma.js'
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js'
import type { registerSchema, loginSchema } from '../utils/validation.js'
import type { z } from 'zod'

type RegisterInput = z.infer<typeof registerSchema>
type LoginInput = z.infer<typeof loginSchema>

const RESET_SECRET = process.env.JWT_SECRET ?? 'fallback-access-secret'

function generateTokenId(): string {
  return crypto.randomUUID()
}

function refreshExpiresAt(): Date {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
}

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) {
    throw new AuthError('Email already registered', 409)
  }

  const hashed = await bcrypt.hash(input.password, 12)
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashed,
    },
    select: {
      id: true,
      name: true,
      email: true,
      account: true,
      avatarUrl: true,
    },
  })

  const tokenId = generateTokenId()
  const accessToken = signAccessToken({ userId: user.id })
  const refreshToken = signRefreshToken({ userId: user.id, tokenId })

  await prisma.refreshToken.create({
    data: {
      id: tokenId,
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshExpiresAt(),
    },
  })

  return { user, accessToken, refreshToken }
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) {
    throw new AuthError('Invalid email or password', 401)
  }

  const valid = await bcrypt.compare(input.password, user.password)
  if (!valid) {
    throw new AuthError('Invalid email or password', 401)
  }

  const tokenId = generateTokenId()
  const accessToken = signAccessToken({ userId: user.id })
  const refreshToken = signRefreshToken({ userId: user.id, tokenId })

  await prisma.refreshToken.create({
    data: {
      id: tokenId,
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshExpiresAt(),
    },
  })

  const { password: _, ...safeUser } = user
  return { user: safeUser, accessToken, refreshToken }
}

export async function refreshUserToken(refreshTokenStr: string) {
  let payload: { userId: string; tokenId: string }
  try {
    payload = verifyRefreshToken(refreshTokenStr)
  } catch {
    throw new AuthError('Invalid refresh token', 401)
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { id: payload.tokenId },
  })

  if (!stored || stored.userId !== payload.userId) {
    throw new AuthError('Refresh token revoked or not found', 401)
  }

  await prisma.refreshToken.delete({ where: { id: stored.id } })

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      account: true,
      avatarUrl: true,
    },
  })

  if (!user) {
    throw new AuthError('User not found', 404)
  }

  const newTokenId = generateTokenId()
  const newAccessToken = signAccessToken({ userId: user.id })
  const newRefreshToken = signRefreshToken({ userId: user.id, tokenId: newTokenId })

  await prisma.refreshToken.create({
    data: {
      id: newTokenId,
      token: newRefreshToken,
      userId: user.id,
      expiresAt: refreshExpiresAt(),
    },
  })

  return { user, accessToken: newAccessToken, refreshToken: newRefreshToken }
}

export async function logoutUser(refreshTokenStr: string) {
  let payload: { tokenId: string }
  try {
    payload = verifyRefreshToken(refreshTokenStr)
  } catch {
    return
  }

  await prisma.refreshToken.deleteMany({
    where: { id: payload.tokenId },
  })
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      account: true,
      avatarUrl: true,
    },
  })

  if (!user) {
    throw new AuthError('User not found', 404)
  }

  return user
}

export async function forgotPassword(input: { email: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) {
    return { message: 'If that email is registered, a reset link has been sent.' }
  }

  const resetToken = jwt.sign({ userId: user.id, type: 'reset' }, RESET_SECRET, { expiresIn: '1h' })

  return {
    message: 'If that email is registered, a reset link has been sent.',
    resetToken,
  }
}

export async function resetPassword(input: { token: string; password: string }) {
  let payload: { userId: string }
  try {
    payload = jwt.verify(input.token, RESET_SECRET) as { userId: string }
  } catch {
    throw new AuthError('Invalid or expired reset token', 400)
  }

  const hashed = await bcrypt.hash(input.password, 12)
  await prisma.user.update({
    where: { id: payload.userId },
    data: { password: hashed },
  })

  return { message: 'Password reset successfully' }
}

export async function updateProfile(userId: string, input: { name?: string; email?: string; account?: string }) {
  if (input.email) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } })
    if (existing && existing.id !== userId) {
      throw new AuthError('Email already in use', 409)
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: input,
    select: { id: true, name: true, email: true, account: true, avatarUrl: true },
  })

  return user
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new AuthError('User not found', 404)
  }

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) {
    throw new AuthError('Current password is incorrect', 400)
  }

  const hashed = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  })
}

export async function uploadAvatar(userId: string, filePath: string) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: filePath },
    select: { id: true, name: true, email: true, account: true, avatarUrl: true },
  })
  return user
}

export class AuthError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}