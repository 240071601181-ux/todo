import prisma from '../utils/prisma.js'

export interface ActivityItem {
  id: string
  type: 'task_created' | 'task_completed' | 'task_uncompleted' | 'task_updated'
  message: string
  taskId: string
  taskTitle: string
  createdAt: string
}

export async function getRecentActivities(userId: string, limit: number = 10): Promise<ActivityItem[]> {
  const tasks = await prisma.task.findMany({
    where: { userId, archived: false },
    orderBy: { updatedAt: 'desc' },
    take: limit * 2,
    select: {
      id: true,
      title: true,
      completed: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  const activities: ActivityItem[] = []

  for (const task of tasks) {
    const created = task.createdAt.getTime()
    const updated = task.updatedAt.getTime()

    if (Math.abs(updated - created) < 1000) {
      activities.push({
        id: `created-${task.id}`,
        type: 'task_created',
        message: `Created "${task.title}"`,
        taskId: task.id,
        taskTitle: task.title,
        createdAt: task.createdAt.toISOString(),
      })
    } else if (task.completed) {
      activities.push({
        id: `completed-${task.id}-${updated}`,
        type: 'task_completed',
        message: `Completed "${task.title}"`,
        taskId: task.id,
        taskTitle: task.title,
        createdAt: task.updatedAt.toISOString(),
      })
    } else {
      activities.push({
        id: `updated-${task.id}-${updated}`,
        type: 'task_updated',
        message: `Updated "${task.title}"`,
        taskId: task.id,
        taskTitle: task.title,
        createdAt: task.updatedAt.toISOString(),
      })
    }

    if (activities.length >= limit) break
  }

  return activities
}
