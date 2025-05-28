import type { $Fetch, NitroFetchRequest } from 'nitropack'

export function projectsRepository<T>(fetch: $Fetch<T, NitroFetchRequest>) {
  return {
    async getMyProjects(): Promise<unknown> {
      return fetch<unknown>('/projects', {
        method: 'GET',
      })
    },
  }
}
