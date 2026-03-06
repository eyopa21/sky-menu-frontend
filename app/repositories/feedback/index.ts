import type { $Fetch, NitroFetchRequest } from 'nitropack'
import type { Feedback, FeedbackStats } from './response/feedback'

export interface CreateFeedbackDto {
  projectId: number;
  name: string;
  email?: string;
  rating: number;
  comment: string;
  images?: string[];
}

export function feedbackRepository<T>(fetch: $Fetch<T, NitroFetchRequest>) {
  return {
    async submitFeedback(dto: CreateFeedbackDto): Promise<Feedback> {
      return fetch<Feedback>('/feedback', {
        method: 'POST',
        body: dto,
      })
    },

    async getProjectFeedbacks(projectId: number): Promise<Feedback[]> {
      return fetch<Feedback[]>(`/feedback/project/${projectId}`, {
        method: 'GET',
      })
    },

    async getPaginatedFeedbacks(params: {
      page?: number;
      limit?: number;
      projectId?: number;
    } = {}): Promise<{ data: Feedback[]; total: number; page: number; lastPage: number }> {
      return fetch<{ data: Feedback[]; total: number; page: number; lastPage: number }>('/feedback', {
        method: 'GET',
        query: params,
      })
    },

    async getFeedbackById(id: number): Promise<Feedback> {
      return fetch<Feedback>(`/feedback/${id}`, {
        method: 'GET',
      })
    },

    async getProjectFeedbackStats(projectId: number): Promise<FeedbackStats> {
      return fetch<FeedbackStats>(`/feedback/project/${projectId}/stats`, {
        method: 'GET',
      })
    },
  }
}
