export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          certificate_url: string | null
          created_at: string
          description: string | null
          id: string
          medal_type: string
          title: string
          winner_name: string
          year: number
        }
        Insert: {
          category: string
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          medal_type: string
          title: string
          winner_name: string
          year: number
        }
        Update: {
          category?: string
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          medal_type?: string
          title?: string
          winner_name?: string
          year?: number
        }
        Relationships: []
      }
      admin_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      agendas: {
        Row: {
          badge: string | null
          category: string
          coordinator: string
          created_at: string
          date_display: string
          description: string
          id: string
          image: string | null
          location: string
          month: string
          rundown: Json | null
          target_audience: string
          time_display: string
          timeline_status: string
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          badge?: string | null
          category: string
          coordinator: string
          created_at?: string
          date_display: string
          description: string
          id?: string
          image?: string | null
          location: string
          month: string
          rundown?: Json | null
          target_audience: string
          time_display: string
          timeline_status: string
          title: string
          updated_at?: string
          year: string
        }
        Update: {
          badge?: string | null
          category?: string
          coordinator?: string
          created_at?: string
          date_display?: string
          description?: string
          id?: string
          image?: string | null
          location?: string
          month?: string
          rundown?: Json | null
          target_audience?: string
          time_display?: string
          timeline_status?: string
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      extracurriculars: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string
          icon_name: string | null
          id: string
          mentor_name: string | null
          name: string
          schedule: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description: string
          icon_name?: string | null
          id?: string
          mentor_name?: string | null
          name: string
          schedule: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string
          icon_name?: string | null
          id?: string
          mentor_name?: string | null
          name?: string
          schedule?: string
        }
        Relationships: []
      }
      galleries: {
        Row: {
          category: string
          cover_image: string | null
          created_at: string
          description: string | null
          event_date: string
          id: string
          slug: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          slug: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          caption: string | null
          created_at: string
          gallery_id: string
          id: string
          order_index: number | null
          photo_url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          gallery_id: string
          id?: string
          order_index?: number | null
          photo_url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          gallery_id?: string
          id?: string
          order_index?: number | null
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_photos_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "galleries"
            referencedColumns: ["id"]
          },
        ]
      }
      jm_center_pages: {
        Row: {
          banner_image: string | null
          content: string
          created_at: string
          extra_data: Json | null
          id: string
          quotes: string | null
          slug: string
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          banner_image?: string | null
          content: string
          created_at?: string
          extra_data?: Json | null
          id?: string
          quotes?: string | null
          slug: string
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          banner_image?: string | null
          content?: string
          created_at?: string
          extra_data?: Json | null
          id?: string
          quotes?: string | null
          slug?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mandarin_lessons: {
        Row: {
          audio_url: string | null
          cover_image: string | null
          created_at: string
          dialog_script: Json | null
          hanzi: string | null
          id: string
          level: string
          meaning_id: string
          order_index: number
          pinyin: string
          topic: string
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          cover_image?: string | null
          created_at?: string
          dialog_script?: Json | null
          hanzi?: string | null
          id?: string
          level?: string
          meaning_id: string
          order_index?: number
          pinyin: string
          topic: string
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          cover_image?: string | null
          created_at?: string
          dialog_script?: Json | null
          hanzi?: string | null
          id?: string
          level?: string
          meaning_id?: string
          order_index?: number
          pinyin?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      mandarin_quizzes: {
        Row: {
          correct_index: number
          created_at: string
          explanation: string | null
          id: string
          lesson_id: string
          options: Json
          question: string
          question_type: string | null
        }
        Insert: {
          correct_index: number
          created_at?: string
          explanation?: string | null
          id?: string
          lesson_id: string
          options: Json
          question: string
          question_type?: string | null
        }
        Update: {
          correct_index?: number
          created_at?: string
          explanation?: string | null
          id?: string
          lesson_id?: string
          options?: Json
          question?: string
          question_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mandarin_quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "mandarin_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          category: string
          cover_image: string | null
          created_at: string
          curriculum: Json | null
          description: string
          id: string
          schedule: string | null
          slug: string
          target_audience: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          cover_image?: string | null
          created_at?: string
          curriculum?: Json | null
          description: string
          id?: string
          schedule?: string | null
          slug: string
          target_audience?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          cover_image?: string | null
          created_at?: string
          curriculum?: Json | null
          description?: string
          id?: string
          schedule?: string | null
          slug?: string
          target_audience?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      stem_projects: {
        Row: {
          assignment_doc_url: string | null
          author_santri: string | null
          category: string
          cover_image: string | null
          created_at: string
          description: string
          id: string
          is_portfolio: boolean | null
          slug: string
          specs: Json | null
          syllabus_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assignment_doc_url?: string | null
          author_santri?: string | null
          category: string
          cover_image?: string | null
          created_at?: string
          description: string
          id?: string
          is_portfolio?: boolean | null
          slug: string
          specs?: Json | null
          syllabus_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assignment_doc_url?: string | null
          author_santri?: string | null
          category?: string
          cover_image?: string | null
          created_at?: string
          description?: string
          id?: string
          is_portfolio?: boolean | null
          slug?: string
          specs?: Json | null
          syllabus_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_role: {
        Args: { required_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "super_admin" | "pengurus_konten" | "guru_akademik"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
