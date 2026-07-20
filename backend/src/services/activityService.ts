import * as activityRepository from '../repositories/activityRepository.js'

export async function getRecentActivities(userId: string, limit?: number) {
  return activityRepository.getRecentActivities(userId, limit)
}
