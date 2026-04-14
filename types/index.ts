export type UserRole = "user"|"moderator"|"admin";
export interface NewsArticle{ id:string; title:string; source_name:string; summary:string; source_url:string; category:string; image_url?: string | null; published_date:string; is_featured:boolean; }
export interface Notice{ id:string; title:string; content:string; is_pinned:boolean; image_url?: string | null; created_at:string; }
