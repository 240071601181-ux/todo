import * as analyticsRepository from '../repositories/analyticsRepository.js'

export async function getAnalytics(userId: string) {
  return analyticsRepository.getAnalytics(userId)
}
