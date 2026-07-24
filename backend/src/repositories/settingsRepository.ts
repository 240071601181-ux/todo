import prisma from '../utils/prisma.js'
import type { Prisma } from '@prisma/client'

export async function findByUserId(userId: string) {
  return prisma.userSettings.findUnique({ where: { userId } })
}

export async function upsert(userId: string, settings: Prisma.InputJsonValue) {
  return prisma.userSettings.upsert({
    where: { userId },
    update: { settings },
    create: { userId, settings },
  })
}
