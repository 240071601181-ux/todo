import prisma from '../utils/prisma.js'
import type { Tag } from '@prisma/client'

export async function findAll(): Promise<Tag[]> {
  return prisma.tag.findMany({ orderBy: { name: 'asc' } })
}

export async function findById(id: string): Promise<Tag | null> {
  return prisma.tag.findUnique({ where: { id } })
}

export async function findBySlug(slug: string): Promise<Tag | null> {
  return prisma.tag.findUnique({ where: { slug } })
}

export async function create(data: { name: string; slug: string; color?: string | null }): Promise<Tag> {
  return prisma.tag.create({ data: { name: data.name, slug: data.slug, color: data.color ?? null } })
}

export async function update(id: string, data: { name?: string; slug?: string; color?: string | null }): Promise<Tag> {
  return prisma.tag.update({ where: { id }, data })
}

export async function remove(id: string): Promise<void> {
  await prisma.tag.delete({ where: { id } })
}
