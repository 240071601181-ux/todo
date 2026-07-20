import prisma from '../utils/prisma.js'

export interface AnalyticsResult {
  completedTasks: number
  pendingTasks: number
  completionPercent: number
  dueToday: number
  overdue: number
  mostActiveCategory: { id: string; name: string; count: number } | null
  weeklyCompletedCount: number[]
  productivityScore: number
  completedToday: number
}

export async function getAnalytics(userId: string): Promise<AnalyticsResult> {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(startOfDay.getTime() + 86_400_000)

  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(now)
  monday.setDate(now.getDate() + mondayOffset)
  monday.setHours(0, 0, 0, 0)
  const weekEnd = new Date(monday.getTime() + 7 * 86_400_000)

  const [totalTasks, completedTasks, dueToday, overdue, categoryStats, completedThisWeek, completedToday] =
    await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, completed: true } }),
      prisma.task.count({
        where: {
          userId,
          completed: false,
          dueDate: { gte: startOfDay, lt: endOfDay },
        },
      }),
      prisma.task.count({
        where: {
          userId,
          completed: false,
          dueDate: { lt: startOfDay },
        },
      }),
      prisma.task.groupBy({
        by: ['categoryId'],
        where: { userId, categoryId: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 1,
      }),
      prisma.task.findMany({
        where: {
          userId,
          completed: true,
          updatedAt: { gte: monday, lt: weekEnd },
        },
        select: { updatedAt: true },
      }),
      prisma.task.count({
        where: {
          userId,
          completed: true,
          updatedAt: { gte: startOfDay, lt: endOfDay },
        },
      }),
    ])

  const pendingTasks = totalTasks - completedTasks
  const completionPercent = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0

  const weeklyCompletedCount = Array(7).fill(0) as number[]
  for (const task of completedThisWeek) {
    const dayIdx = Math.floor(
      (task.updatedAt.getTime() - monday.getTime()) / 86_400_000,
    )
    if (dayIdx >= 0 && dayIdx < 7) {
      weeklyCompletedCount[dayIdx]++
    }
  }

  const productivityScore = completionPercent > 0
    ? Math.min(1000, completionPercent * 10)
    : 0

  let mostActiveCategory: { id: string; name: string; count: number } | null = null
  if (categoryStats.length > 0 && categoryStats[0].categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryStats[0].categoryId },
      select: { id: true, name: true },
    })
    if (category) {
      mostActiveCategory = {
        id: category.id,
        name: category.name,
        count: categoryStats[0]._count.id,
      }
    }
  }

  return {
    completedTasks,
    pendingTasks,
    completionPercent,
    dueToday,
    overdue,
    mostActiveCategory,
    weeklyCompletedCount,
    productivityScore,
    completedToday,
  }
}
