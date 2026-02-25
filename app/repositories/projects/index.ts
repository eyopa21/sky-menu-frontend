import type { $Fetch, NitroFetchRequest } from 'nitropack'
import type { Project } from './response/projects'
import type { TCreateProjectValidationSchema } from '~/zod/projects/CreateProjectValidation'
import type { CreateProjectDto } from './dto/createProject.dto'

export function projectsRepository<T>(fetch: $Fetch<T, NitroFetchRequest>) {
  return {
    async getMyProjects(): Promise<Project[]> {
      return fetch<Project[]>('/projects', {
        method: 'GET',
      })
    },

    async getProjectById(id: number): Promise<Project> {
      return fetch<Project>(`/projects/${id}`, {
        method: 'GET',
      })
    },

    async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
      return fetch<Project>('/projects', {
        method: 'POST',
        body: createProjectDto,
      })
    },

    async updateProject(id: number, updateProjectDto: Partial<TCreateProjectValidationSchema>): Promise<Project> {
      return fetch<Project>(`/projects/${id}`, {
        method: 'PATCH',
        body: updateProjectDto,
      })
    },

    async deleteProject(id: number): Promise<void> {
      return fetch<void>(`/projects/${id}`, {
        method: 'DELETE',
      })
    },
    
    async getProjectBySlug(slug: string): Promise<Project> {
      return fetch<Project>(`/projects/slug/${slug}`, {
        method: 'GET',
      })
    },
  }
}
