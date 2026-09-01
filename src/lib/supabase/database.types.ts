export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      initiatives: {
        Row: {
          id: string
          title: string
          slug: string
          summary: string
          description: string
          category: string
          cover_image: string
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          summary: string
          description: string
          category: string
          cover_image: string
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          summary?: string
          description?: string
          category?: string
          cover_image?: string
          is_featured?: boolean
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          initiative_id: string | null
          title: string
          slug: string
          rotaract_year: string
          event_date: string
          location: string
          summary: string
          description: string
          impact_metrics: Json
          cover_image: string
          gallery_images: string[]
          status: 'draft' | 'published'
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          initiative_id?: string | null
          title: string
          slug: string
          rotaract_year: string
          event_date: string
          location: string
          summary: string
          description: string
          impact_metrics?: Json
          cover_image: string
          gallery_images?: string[]
          status?: 'draft' | 'published'
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          initiative_id?: string | null
          title?: string
          slug?: string
          rotaract_year?: string
          event_date?: string
          location?: string
          summary?: string
          description?: string
          impact_metrics?: Json
          cover_image?: string
          gallery_images?: string[]
          status?: 'draft' | 'published'
          is_featured?: boolean
          created_at?: string
        }
      }
      gallery_photos: {
        Row: {
          id: string
          event_id: string | null
          album_name: string
          image_url: string
          caption: string
          rotaract_year: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          event_id?: string | null
          album_name: string
          image_url: string
          caption: string
          rotaract_year: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string | null
          album_name?: string
          image_url?: string
          caption?: string
          rotaract_year?: string
          sort_order?: number
          created_at?: string
        }
      }
      editorials: {
        Row: {
          id: string
          title: string
          slug: string
          author: string
          category: string
          pdf_url: string | null
          cover_image: string
          content: string
          summary: string
          status: 'draft' | 'published'
          published_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          author: string
          category: string
          pdf_url?: string | null
          cover_image: string
          content: string
          summary: string
          status?: 'draft' | 'published'
          published_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          author?: string
          category?: string
          pdf_url?: string | null
          cover_image?: string
          content?: string
          summary?: string
          status?: 'draft' | 'published'
          published_at?: string
        }
      }
      board_members: {
        Row: {
          id: string
          name: string
          role: string
          rotaract_year: string
          bio: string
          image_url: string
          sort_order: number
          social_links: Json
        }
        Insert: {
          id?: string
          name: string
          role: string
          rotaract_year: string
          bio: string
          image_url: string
          sort_order?: number
          social_links?: Json
        }
        Update: {
          id?: string
          name?: string
          role?: string
          rotaract_year?: string
          bio?: string
          image_url?: string
          sort_order?: number
          social_links?: Json
        }
      }
      join_applications: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          occupation: string
          reason: string
          status: 'pending' | 'contacted' | 'accepted' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          occupation: string
          reason: string
          status?: 'pending' | 'contacted' | 'accepted' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          occupation?: string
          reason?: string
          status?: 'pending' | 'contacted' | 'accepted' | 'rejected'
          created_at?: string
        }
      }
    }
  }
}
