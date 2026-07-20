import * as tagRepository from '../repositories/tagRepository.js'

export class TagError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function listTags() {
  return tagRepository.findAll()
}

export async function getTagById(id: string) {
  const tag = await tagRepository.findById(id)
  if (!tag) {
    throw new TagError('Tag not found', 404)
  }
  return tag
}

export async function createTag(input: { name: string; slug?: string; color?: string }) {
  const slug = input.slug || input.name.toLowerCase().replace(/\s+/g, '-')
  const existing = await tagRepository.findBySlug(slug)
  if (existing) {
    throw new TagError('Tag with this slug already exists', 409)
  }
  return tagRepository.create({ name: input.name, slug, color: input.color })
}

export async function updateTag(id: string, input: { name?: string; slug?: string; color?: string | null }) {
  const tag = await tagRepository.findById(id)
  if (!tag) {
    throw new TagError('Tag not found', 404)
  }
  if (input.slug && input.slug !== tag.slug) {
    const existing = await tagRepository.findBySlug(input.slug)
    if (existing) {
      throw new TagError('Tag with this slug already exists', 409)
    }
  }
  return tagRepository.update(id, input)
}

export async function deleteTag(id: string) {
  const tag = await tagRepository.findById(id)
  if (!tag) {
    throw new TagError('Tag not found', 404)
  }
  await tagRepository.remove(id)
}
