export interface IPost {
  id: number;
  title: string;
  tags: string[];
  views: number | null;
  body: string;
  author: string;
  createdAt: string;
  userId?: number;
}