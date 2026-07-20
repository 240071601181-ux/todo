import prisma from '../utils/prisma.js'

export interface CategoryBreakdownItem {
  id: string
  name: string
  count: number
  percentage: number
}

export interface AnalyticsResult {
  completedTasks: number
  pendingTasks: number
  completionPercent: number
  dueToday: number
  overdue: number
  mostActiveCategory: { id: string; name: string; count: number } | null
  weeklyCompletedCount: number[]
  monthlyCompletedCount: number[]
  categoryBreakdown: CategoryBreakdownItem[]
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

  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1)

  const [totalTasks, completedTasks, dueToday, overdue, topCategoryStats, completedThisWeek, completedToday, lastWeekCompletions, allCompletedDates, monthlyTasks, allCategoryStats] =
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
      prisma.task.findMany({
        where: { userId, completed: true, updatedAt: { gte: twelveMonthsAgo } },
        select: { updatedAt: true },
      }),
      prisma.task.groupBy({
        by: ['categoryId'],
        where: { userId, categoryId: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
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

  const monthlyCompletedCount = Array(12).fill(0) as number[]
  for (const task of monthlyTasks) {
    const monthDiff = (now.getFullYear() - task.updatedAt.getFullYear()) * 12 + now.getMonth() - task.updatedAt.getMonth()
    const idx = 11 - monthDiff
    if (idx >= 0 && idx < 12) {
      monthlyCompletedCount[idx]++
    }
  }

  let mostActiveCategory: { id: string; name: string; count: number } | null = null
  if (topCategoryStats.length > 0 && topCategoryStats[0].categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: topCategoryStats[0].categoryId },
      select: { id: true, name: true },
    })
    if (category) {
      mostActiveCategory = {
        id: category.id,
        name: category.name,
        count: topCategoryStats[0]._count.id,
      }
    }
  }

  const categoryBreakdown: CategoryBreakdownItem[] = []
  const categoryIds = allCategoryStats.map(c => c.categoryId).filter(Boolean) as string[]
  if (categoryIds.length > 0) {
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    })
    const categoryMap = new Map(categories.map(c => [c.id, c.name]))
    const categoryTotal = allCategoryStats.reduce((sum, c) => sum + c._count.id, 0)
    for (const stat of allCategoryStats) {
      if (stat.categoryId) {
        const name = categoryMap.get(stat.categoryId) ?? 'Uncategorized'
        categoryBreakdown.push({
          id: stat.categoryId,
          name,
          count: stat._count.id,
          percentage: categoryTotal > 0 ? Math.round((stat._count.id / categoryTotal) * 100) : 0,
        })
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
    monthlyCompletedCount,
    categoryBreakdown,
    productivityScore,
    completedToday,
    xp,
    level,
    nextLevelXp,
    streakDays,
    productivityTrend,
  }
}
