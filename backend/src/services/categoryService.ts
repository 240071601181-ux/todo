import * as categoryRepository from '../repositories/categoryRepository.js'

export class CategoryError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function listCategories() {
  return categoryRepository.findAll()
}

export async function getCategoryById(id: string) {
  const category = await categoryRepository.findById(id)
  if (!category) {
    throw new CategoryError('Category not found', 404)
  }
  return category
}

export async function createCategory(input: { name: string; slug?: string; color?: string }) {
  const slug = input.slug || input.name.toLowerCase().replace(/\s+/g, '-')
  const existing = await categoryRepository.findBySlug(slug)
  if (existing) {
    throw new CategoryError('Category with this slug already exists', 409)
  }
  return categoryRepository.create({ name: input.name, slug, color: input.color })
}

export async function updateCategory(id: string, input: { name?: string; slug?: string; color?: string | null }) {
  const category = await categoryRepository.findById(id)
  if (!category) {
    throw new CategoryError('Category not found', 404)
  }
  if (input.slug && input.slug !== category.slug) {
    const existing = await categoryRepository.findBySlug(input.slug)
    if (existing) {
      throw new CategoryError('Category with this slug already exists', 409)
    }
  }
  return categoryRepository.update(id, input)
}

export async function deleteCategory(id: string) {
  const category = await categoryRepository.findById(id)
  if (!category) {
    throw new CategoryError('Category not found', 404)
  }
  await categoryRepository.remove(id)
}
