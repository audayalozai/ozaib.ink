export interface Author {
  id: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  role: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  icon: string | null;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  readTime: number;
  featured: boolean;
  published: boolean;
  tags: string;
  categoryId: string | null;
  authorId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
