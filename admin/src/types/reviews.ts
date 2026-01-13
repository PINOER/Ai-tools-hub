import type { Tools } from '@/types/tools';
import type { User } from '@/types/user';

export enum ReviewStatus {
  Approved = 'Approved',
  PendingReport = 'PendingReport',
  Reported = 'Reported',
  Flagged = 'Flagged'
}

export type Review = {
  id: number;
  user: User;
  tool: Tools;
  status: ReviewStatus | string;
  rating: number;
  comment: string;
  approved: boolean;
  flagged: boolean;
  date: string;
  created_at: string;
  overall_rating: number;
  likes: number;
};
