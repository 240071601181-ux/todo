import prisma from '../utils/prisma.js'
import type { Category } from '@prisma/client'

export async function findAll(): Promise<Category[]> {
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
}

export async function findById(id: string): Promise<Category | null> {
  return prisma.category.findUnique({ where: { id } })
}

export async function findBySlug(slug: string): Promise<Category | null> {
  return prisma.category.findUnique({ where: { slug } })
}

export async function create(data: { name: string; slug: string; color?: string | null }): Promise<Category> {
  return prisma.category.create({ data: { name: data.name, slug: data.slug, color: data.color ?? null } })
}

export async function update(id: string, data: { name?: string; slug?: string; color?: string | null }): Promise<Category> {
  return prisma.category.update({ where: { id }, data })
}

export async function remove(id: string): Promise<void> {
  await prisma.category.delete({ where: { id } })
}
