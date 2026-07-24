import * as settingsRepository from '../repositories/settingsRepository.js'
import type { Prisma } from '@prisma/client'

export async function getSettings(userId: string) {
  const record = await settingsRepository.findByUserId(userId)
  return record?.settings ?? {}
}

export async function updateSettings(userId: string, settings: Prisma.InputJsonValue) {
  const record = await settingsRepository.upsert(userId, settings)
  return record.settings
}
