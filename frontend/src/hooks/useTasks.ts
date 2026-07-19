import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as taskService from '../services/taskService'
import type { Task } from '../types/todo'

export function useTasks() {
  const queryClient = useQueryClient()

  const { data: lists } = useQuery({
    queryKey: ['lists'],
    queryFn: taskService.fetchLists,
    staleTime: 60_000,
    retry: 2,
  })

  const defaultListId = lists?.[0]?.id

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.fetchTasks,
    staleTime: 30_000,
    retry: 2,
  })

  const toggleMutation = useMutation({
    mutationFn: (id: string) => taskService.toggleTaskCompletion(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previous = queryClient.getQueryData<Task[]>(['tasks'])
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      )
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['tasks'], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const addMutation = useMutation({
    mutationFn: (title: string) => {
      if (!defaultListId) {
        throw new Error('No list available. Create a list first.')
      }
      return taskService.createTask(title, defaultListId)
    },
    onMutate: async (title) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previous = queryClient.getQueryData<Task[]>(['tasks'])
      const optimistic: Task = {
        id: `temp-${crypto.randomUUID()}`,
        title,
        tag: '#NEW',
        tagVariant: 'tertiary',
        time: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }),
        completed: false,
      }
      queryClient.setQueryData<Task[]>(['tasks'], (old) => [optimistic, ...(old ?? [])])
      return { previous }
    },
    onError: (_err, _title, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['tasks'], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  return {
    tasks: tasksQuery.data ?? [],
    toggleTask: toggleMutation.mutate,
    addTask: addMutation.mutate,
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    isFetching: tasksQuery.isFetching,
  }
}
