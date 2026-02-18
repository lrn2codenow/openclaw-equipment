export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
  if (seconds < 2592000) return Math.floor(seconds / 86400) + 'd ago';
  return date.toLocaleDateString();
}

export function starRating(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

export interface Package {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  category: string;
  subcategory?: string;
  version: string;
  author: string;
  license: string;
  magnet_uri: string;
  info_hash?: string;
  checksum?: string;
  size_bytes?: number;
  size_display?: string;
  platform: string;
  compatibility: string;
  dependencies: string;
  source_url?: string;
  homepage?: string;
  icon_url?: string;
  tags: string;
  downloads: number;
  rating: number;
  review_count: number;
  seeders: number;
  status: string;
  featured: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  parent_id?: string;
  sort_order: number;
  package_count: number;
}

export interface Review {
  id: string;
  package_id: string;
  reviewer: string;
  reviewer_type: string;
  rating: number;
  review: string;
  works_on: string;
  issues: string;
  created_at: string;
}
