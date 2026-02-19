import type { $Fetch, NitroFetchRequest } from 'nitropack'
import type { Project } from './response/projects'
import type { TCreateProjectValidationSchema } from '~/zod/projects/CreateProjectValidation'

export function projectsRepository<T>(fetch: $Fetch<T, NitroFetchRequest>) {
  return {
    async getMyProjects(): Promise<unknown> {
      return fetch<unknown>('/projects', {
        method: 'GET',
      })
    },

    async createProject(createProjectDto: TCreateProjectValidationSchema): Promise<Project> {
      return fetch<Project>('/projects', {
        method: 'POST',
        body: createProjectDto,
      })
    },
  }
}
