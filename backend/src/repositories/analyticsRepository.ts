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
  xp: number
  level: number
  nextLevelXp: number
  streakDays: number
  productivityTrend: number
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

  const lastWeekStart = new Date(monday.getTime() - 7 * 86_400_000)
  const lastWeekEnd = new Date(monday.getTime())

  const [totalTasks, completedTasks, dueToday, overdue, categoryStats, completedThisWeek, completedToday, lastWeekCompletions, allCompletedDates] =
    await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, completed: true } }),
      prisma.task.count({
        where: { userId, completed: false, dueDate: { gte: startOfDay, lt: endOfDay } },
      }),
      prisma.task.count({
        where: { userId, completed: false, dueDate: { lt: startOfDay } },
      }),
      prisma.task.groupBy({
        by: ['categoryId'],
        where: { userId, categoryId: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 1,
      }),
      prisma.task.findMany({
        where: { userId, completed: true, updatedAt: { gte: monday, lt: weekEnd } },
        select: { updatedAt: true },
      }),
      prisma.task.count({
        where: { userId, completed: true, updatedAt: { gte: startOfDay, lt: endOfDay } },
      }),
      prisma.task.count({
        where: { userId, completed: true, updatedAt: { gte: lastWeekStart, lt: lastWeekEnd } },
      }),
      prisma.task.findMany({
        where: { userId, completed: true },
        select: { updatedAt: true },
        orderBy: { updatedAt: 'desc' },
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

  const thisWeekTotal = weeklyCompletedCount.reduce((a, b) => a + b, 0)
  const productivityTrend = lastWeekCompletions > 0
    ? Math.round(((thisWeekTotal - lastWeekCompletions) / lastWeekCompletions) * 100)
    : thisWeekTotal > 0 ? 100 : 0

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

  const xp = completedTasks * 100
  const level = Math.max(1, Math.floor(Math.sqrt(xp / 500)) + 1)
  const nextLevelXp = Math.pow(level + 1, 2) * 500

  const dateSet = new Set<string>()
  for (const t of allCompletedDates) {
    dateSet.add(t.updatedAt.toISOString().split('T')[0])
  }

  let streakDays = 0
  const cursor = new Date(startOfDay)
  while (true) {
    const ds = cursor.toISOString().split('T')[0]
    if (dateSet.has(ds)) {
      streakDays++
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
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
    xp,
    level,
    nextLevelXp,
    streakDays,
    productivityTrend,
  }
}
