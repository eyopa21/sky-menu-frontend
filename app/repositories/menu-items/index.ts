import type { $Fetch, NitroFetchRequest } from 'nitropack'
import type { MenuItem } from './response/menu-items'

export function menuItemsRepository<T>(fetch: $Fetch<T, NitroFetchRequest>) {
  return {
    async createMenuItem(payload: Partial<MenuItem>): Promise<MenuItem> {
      return fetch<MenuItem>('/menu-items', {
        method: 'POST',
        body: payload,
      })
    },

    async updateMenuItem(id: number, payload: Partial<MenuItem>): Promise<MenuItem> {
      return fetch<MenuItem>(`/menu-items/${id}`, {
        method: 'PATCH',
        body: payload,
      })
    },

    async deleteMenuItem(id: number): Promise<void> {
      return fetch<void>(`/menu-items/${id}`, {
        method: 'DELETE',
      })
    },
  }
}
