import type { $Fetch, NitroFetchRequest } from 'nitropack'
import type { Category } from './response/categories'

export function categoriesRepository<T>(fetch: $Fetch<T, NitroFetchRequest>) {
  return {
    async getCategoriesByProjectId(projectId: number): Promise<Category[]> {
      return fetch<Category[]>(`/categories/by-project/${projectId}`, {
        method: 'GET',
      })
    },

    async createCategory(payload: { projectId: number, name: string, description?: string, imageUrl?: string }): Promise<Category> {
      return fetch<Category>('/categories', {
        method: 'POST',
        body: payload,
      })
    },

    async updateCategory(id: number, payload: Partial<Category>): Promise<Category> {
      return fetch<Category>(`/categories/${id}`, {
        method: 'PATCH',
        body: payload,
      })
    },

    async deleteCategory(id: number): Promise<void> {
      return fetch<void>(`/categories/${id}`, {
        method: 'DELETE',
      })
    },
  }
}
