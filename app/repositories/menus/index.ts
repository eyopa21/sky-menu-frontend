import type { $Fetch, NitroFetchRequest } from 'nitropack'
import type { Menu } from './response/menus'

export function menusRepository<T>(fetch: $Fetch<T, NitroFetchRequest>) {
  return {
    async getMenuById(id: number): Promise<Menu> {
      return fetch<Menu>(`/menus/${id}`, {
        method: 'GET',
      })
    },

    async createMenu(projectId: number, name: string): Promise<Menu> {
      return fetch<Menu>('/menus', {
        method: 'POST',
        body: { projectId, name, theme: 'default', language: 'en' },
      })
    },

    async updateTheme(id: number, theme: string): Promise<Menu> {
      return fetch<Menu>(`/menus/${id}`, {
        method: 'PATCH',
        body: { theme },
      })
    },

    async deleteMenu(id: number): Promise<void> {
      return fetch<void>(`/menus/${id}`, {
        method: 'DELETE',
      })
    },
  }
}
