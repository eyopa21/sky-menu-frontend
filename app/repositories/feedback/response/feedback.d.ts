import type { Project } from '~/repositories/projects/response/projects'

export interface Feedback {
  id: number;
  projectId: number;
  name: string;
  email: string | null;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  project?: Project;
}

export interface FeedbackStats {
  averageRating: number;
  total: number;
}

export interface FeedbackPagination {
  data: Feedback[];
  total: number;
  page: number;
  lastPage: number;
}
