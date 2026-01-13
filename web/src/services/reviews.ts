import { api } from './api';
import { Review, ReviewsApiResponse, PostReviewRequest } from '@/types/api';


export const getReviews = async (page: number, limit: number) => {
  const url = `/reviews?page=${page}&limit=${limit}`
  const response = await api.get<ReviewsApiResponse>(url);
  return Object.values(response) as Review[];
}

export const postReview = async (reviewData: PostReviewRequest) => {
  const response = await api.post<Review>('/reviews', reviewData);
  return response;
}