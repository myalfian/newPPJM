export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
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
          bio: string | null
          created_at: string
          department: string | null
          full_name: string
          id: string
          last_password_change: string | null
          must_change_password: boolean | null
          nis_or_nip: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status_badge: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          full_name: string
          id: string
          last_password_change?: string | null
          must_change_password?: boolean | null
          nis_or_nip?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status_badge?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          full_name?: string
          id?: string
          last_password_change?: string | null
          must_change_password?: boolean | null
          nis_or_nip?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status_badge?: string | null
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
      audit_logs: {
        Row: {
          action: string
          created_at: string
          email: string | null
          id: string
          ip_address: string | null
          module: string
          new_data: Json | null
          old_data: Json | null
          role: string | null
          section_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          email?: string | null
          id?: string
          ip_address?: string | null
          module: string
          new_data?: Json | null
          old_data?: Json | null
          role?: string | null
          section_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          email?: string | null
          id?: string
          ip_address?: string | null
          module?: string
          new_data?: Json | null
          old_data?: Json | null
          role?: string | null
          section_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      berita: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_published: boolean
          published_at: string
          slug: string
          title: string
          views: number
        }
        Insert: {
          author_id?: string | null
          category?: string
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string
          slug: string
          title: string
          views?: number
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string
          slug?: string
          title?: string
          views?: number
        }
        Relationships: []
      }
      cms_sections: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          id: string
          order_index: number
          type: string
          updated_at: string
          updated_by: string | null
          visible: boolean
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data?: Json
          id: string
          order_index?: number
          type: string
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          order_index?: number
          type?: string
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      cms_sections_versions: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          id: string
          section_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          section_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          section_id?: string
        }
        Relationships: []
      }
      ekskul: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          images: Json | null
          instructor_name: string | null
          is_active: boolean
          location: string | null
          name: string
          schedule: string | null
          syllabus: string | null
          target: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          instructor_name?: string | null
          is_active?: boolean
          location?: string | null
          name: string
          schedule?: string | null
          syllabus?: string | null
          target?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          instructor_name?: string | null
          is_active?: boolean
          location?: string | null
          name?: string
          schedule?: string | null
          syllabus?: string | null
          target?: string | null
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
      facilities: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string
          is_active: boolean
          name: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      galeri_foto: {
        Row: {
          album_id: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string
          title: string
        }
        Insert: {
          album_id?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          title: string
        }
        Update: {
          album_id?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          title?: string
        }
        Relationships: []
      }
      galeri_videos: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          thumbnail_url: string | null
          title: string
          youtube_url: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title: string
          youtube_url: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          youtube_url?: string
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
      hafidz_audios: {
        Row: {
          audio_url: string
          ayah_number: number
          created_at: string
          duration: number | null
          id: string
          reciter_id: string | null
          surah_id: string | null
        }
        Insert: {
          audio_url: string
          ayah_number: number
          created_at?: string
          duration?: number | null
          id?: string
          reciter_id?: string | null
          surah_id?: string | null
        }
        Update: {
          audio_url?: string
          ayah_number?: number
          created_at?: string
          duration?: number | null
          id?: string
          reciter_id?: string | null
          surah_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hafidz_audios_reciter_id_fkey"
            columns: ["reciter_id"]
            isOneToOne: false
            referencedRelation: "hafidz_reciters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hafidz_audios_surah_id_fkey"
            columns: ["surah_id"]
            isOneToOne: false
            referencedRelation: "hafidz_surahs"
            referencedColumns: ["id"]
          },
        ]
      }
      hafidz_murojaah_questions: {
        Row: {
          ayah_number: number
          created_at: string
          created_by: string | null
          difficulty: string
          hidden_words: Json
          id: string
          options: Json
          surah_id: string | null
        }
        Insert: {
          ayah_number: number
          created_at?: string
          created_by?: string | null
          difficulty?: string
          hidden_words?: Json
          id?: string
          options?: Json
          surah_id?: string | null
        }
        Update: {
          ayah_number?: number
          created_at?: string
          created_by?: string | null
          difficulty?: string
          hidden_words?: Json
          id?: string
          options?: Json
          surah_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hafidz_murojaah_questions_surah_id_fkey"
            columns: ["surah_id"]
            isOneToOne: false
            referencedRelation: "hafidz_surahs"
            referencedColumns: ["id"]
          },
        ]
      }
      hafidz_reciters: {
        Row: {
          audio_quality: string | null
          country: string | null
          created_at: string
          id: string
          name: string
          photo_url: string | null
          surah_count: number | null
        }
        Insert: {
          audio_quality?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          surah_count?: number | null
        }
        Update: {
          audio_quality?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          surah_count?: number | null
        }
        Relationships: []
      }
      hafidz_setoran: {
        Row: {
          ayah_from: number
          ayah_to: number
          created_at: string
          id: string
          kelancaran: number
          makhorijul: number
          notes: string | null
          pembimbing_id: string | null
          santri_id: string | null
          status: string
          surah_id: string | null
          tajwid: number
        }
        Insert: {
          ayah_from: number
          ayah_to: number
          created_at?: string
          id?: string
          kelancaran?: number
          makhorijul?: number
          notes?: string | null
          pembimbing_id?: string | null
          santri_id?: string | null
          status?: string
          surah_id?: string | null
          tajwid?: number
        }
        Update: {
          ayah_from?: number
          ayah_to?: number
          created_at?: string
          id?: string
          kelancaran?: number
          makhorijul?: number
          notes?: string | null
          pembimbing_id?: string | null
          santri_id?: string | null
          status?: string
          surah_id?: string | null
          tajwid?: number
        }
        Relationships: [
          {
            foreignKeyName: "hafidz_setoran_surah_id_fkey"
            columns: ["surah_id"]
            isOneToOne: false
            referencedRelation: "hafidz_surahs"
            referencedColumns: ["id"]
          },
        ]
      }
      hafidz_surahs: {
        Row: {
          ayah_count: number
          content: Json | null
          created_at: string
          id: string
          juz: number
          meaning: string
          name_arab: string
          name_latin: string
          number: number
          place: string
        }
        Insert: {
          ayah_count: number
          content?: Json | null
          created_at?: string
          id?: string
          juz?: number
          meaning: string
          name_arab: string
          name_latin: string
          number: number
          place: string
        }
        Update: {
          ayah_count?: number
          content?: Json | null
          created_at?: string
          id?: string
          juz?: number
          meaning?: string
          name_arab?: string
          name_latin?: string
          number?: number
          place?: string
        }
        Relationships: []
      }
      institutions: {
        Row: {
          created_at: string
          curriculum: Json | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          type: string
        }
        Insert: {
          created_at?: string
          curriculum?: Json | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          type: string
        }
        Update: {
          created_at?: string
          curriculum?: Json | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          type?: string
        }
        Relationships: []
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
      kontak_medsos: {
        Row: {
          bg_color: string | null
          created_at: string
          icon_url: string | null
          id: string
          is_active: boolean
          label: string
          order_index: number
          type: string
          url: string
        }
        Insert: {
          bg_color?: string | null
          created_at?: string
          icon_url?: string | null
          id?: string
          is_active?: boolean
          label: string
          order_index?: number
          type: string
          url: string
        }
        Update: {
          bg_color?: string | null
          created_at?: string
          icon_url?: string | null
          id?: string
          is_active?: boolean
          label?: string
          order_index?: number
          type?: string
          url?: string
        }
        Relationships: []
      }
      madin_flyers: {
        Row: {
          category: string
          created_at: string
          id: string
          image_url: string
          order_index: number
          pdf_url: string | null
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          image_url: string
          order_index?: number
          pdf_url?: string | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          image_url?: string
          order_index?: number
          pdf_url?: string | null
          title?: string
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
          topic_name?: string | null
          hanzi?: string | null
          pinyin?: string | null
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
      mandarin_scores: {
        Row: {
          created_at: string
          id: string
          quiz_id: string | null
          santri_id: string | null
          score: number
          status: string
          time_spent: number
        }
        Insert: {
          created_at?: string
          id?: string
          quiz_id?: string | null
          santri_id?: string | null
          score: number
          status?: string
          time_spent?: number
        }
        Update: {
          created_at?: string
          id?: string
          quiz_id?: string | null
          santri_id?: string | null
          score?: number
          status?: string
          time_spent?: number
        }
        Relationships: [
          {
            foreignKeyName: "mandarin_scores_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "mandarin_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      mandarin_vocabularies: {
        Row: {
          arti: string
          audio_url: string | null
          category: string | null
          created_at: string
          example_arti: string | null
          example_hanzi: string | null
          example_pinyin: string | null
          hanzi: string
          hsk_level: string
          id: string
          pinyin: string
        }
        Insert: {
          arti: string
          audio_url?: string | null
          category?: string | null
          created_at?: string
          example_arti?: string | null
          example_hanzi?: string | null
          example_pinyin?: string | null
          hanzi: string
          hsk_level?: string
          id?: string
          pinyin: string
        }
        Update: {
          arti?: string
          audio_url?: string | null
          category?: string | null
          created_at?: string
          example_arti?: string | null
          example_hanzi?: string | null
          example_pinyin?: string | null
          hanzi?: string
          hsk_level?: string
          id?: string
          pinyin?: string
        }
        Relationships: []
      }
      osis_events: {
        Row: {
          category: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          image_url: string | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          image_url?: string | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string
        }
        Relationships: []
      }
      osis_programs: {
        Row: {
          created_at: string
          department: string
          description: string | null
          frequency: string | null
          id: string
          output: string | null
          target: string | null
          title: string
        }
        Insert: {
          created_at?: string
          department: string
          description?: string | null
          frequency?: string | null
          id?: string
          output?: string | null
          target?: string | null
          title: string
        }
        Update: {
          created_at?: string
          department?: string
          description?: string | null
          frequency?: string | null
          id?: string
          output?: string | null
          target?: string | null
          title?: string
        }
        Relationships: []
      }
      osis_structure: {
        Row: {
          class: string | null
          created_at: string
          id: string
          level: number
          motto: string | null
          name: string
          period: string | null
          photo_url: string | null
          position: string
        }
        Insert: {
          class?: string | null
          created_at?: string
          id?: string
          level?: number
          motto?: string | null
          name: string
          period?: string | null
          photo_url?: string | null
          position: string
        }
        Update: {
          class?: string | null
          created_at?: string
          id?: string
          level?: number
          motto?: string | null
          name?: string
          period?: string | null
          photo_url?: string | null
          position?: string
        }
        Relationships: []
      }
      prestasi: {
        Row: {
          category: string
          certificate_url: string | null
          created_at: string
          id: string
          level: string
          organizer: string | null
          pembina_name: string | null
          photo_url: string | null
          santri_name: string
          title: string
          year: number
        }
        Insert: {
          category?: string
          certificate_url?: string | null
          created_at?: string
          id?: string
          level?: string
          organizer?: string | null
          pembina_name?: string | null
          photo_url?: string | null
          santri_name: string
          title: string
          year?: number
        }
        Update: {
          category?: string
          certificate_url?: string | null
          created_at?: string
          id?: string
          level?: string
          organizer?: string | null
          pembina_name?: string | null
          photo_url?: string | null
          santri_name?: string
          title?: string
          year?: number
        }
        Relationships: []
      }
      profiles_jm_center: {
        Row: {
          author_name: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          jabatan: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          jabatan?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          jabatan?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
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
      programs_pondok: {
        Row: {
          created_at: string
          description: string | null
          id: string
          images: Json | null
          is_active: boolean
          schedule: Json
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean
          schedule?: Json
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean
          schedule?: Json
          title?: string
        }
        Relationships: []
      }
      programs_sekolah: {
        Row: {
          created_at: string
          curriculum: string | null
          id: string
          title: string
          visual_story: Json | null
        }
        Insert: {
          created_at?: string
          curriculum?: string | null
          id?: string
          title: string
          visual_story?: Json | null
        }
        Update: {
          created_at?: string
          curriculum?: string | null
          id?: string
          title?: string
          visual_story?: Json | null
        }
        Relationships: []
      }
      quick_menus: {
        Row: {
          created_at: string
          icon: string
          id: string
          is_active: boolean
          label: string
          link: string
          order_index: number
        }
        Insert: {
          created_at?: string
          icon: string
          id?: string
          is_active?: boolean
          label: string
          link: string
          order_index?: number
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          is_active?: boolean
          label?: string
          link?: string
          order_index?: number
        }
        Relationships: []
      }
            news: {
        Row: {
          author: string | null
          category: string
          content: string
          created_at: string
          id: string
          is_pinned: boolean | null
          is_published: boolean | null
          slug: string
          summary: string | null
          thumbnail: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          is_published?: boolean | null
          slug: string
          summary?: string | null
          thumbnail?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          is_published?: boolean | null
          slug?: string
          summary?: string | null
          thumbnail?: string | null
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
      sliders: {
        Row: {
          badge_tag: string | null
          created_at: string
          cta_link: string | null
          cta_text: string | null
          description: string | null
          id: string
          image_url: string
          is_active: boolean
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          badge_tag?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          badge_tag?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      spmb_info: {
        Row: {
          alur: Json | null
          biaya: Json | null
          created_at: string
          gelombang: string
          id: string
          is_active: boolean
          kontak_wa: string | null
          persyaratan: Json | null
          tahun_ajaran: string
        }
        Insert: {
          alur?: Json | null
          biaya?: Json | null
          created_at?: string
          gelombang?: string
          id?: string
          is_active?: boolean
          kontak_wa?: string | null
          persyaratan?: Json | null
          tahun_ajaran?: string
        }
        Update: {
          alur?: Json | null
          biaya?: Json | null
          created_at?: string
          gelombang?: string
          id?: string
          is_active?: boolean
          kontak_wa?: string | null
          persyaratan?: Json | null
          tahun_ajaran?: string
        }
        Relationships: []
      }
      stem_portfolios: {
        Row: {
          created_at: string
          description: string | null
          id: string
          images: Json | null
          santri_id: string | null
          score: number | null
          status: string
          title: string
          video_url: string | null
          worksheet_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          santri_id?: string | null
          score?: number | null
          status?: string
          title: string
          video_url?: string | null
          worksheet_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          santri_id?: string | null
          score?: number | null
          status?: string
          title?: string
          video_url?: string | null
          worksheet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stem_portfolios_worksheet_id_fkey"
            columns: ["worksheet_id"]
            isOneToOne: false
            referencedRelation: "stem_worksheets"
            referencedColumns: ["id"]
          },
        ]
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
      stem_rubrics: {
        Row: {
          created_at: string
          criteria: Json
          id: string
          parameter: string
          weight: number
          worksheet_id: string | null
        }
        Insert: {
          created_at?: string
          criteria?: Json
          id?: string
          parameter: string
          weight?: number
          worksheet_id?: string | null
        }
        Update: {
          created_at?: string
          criteria?: Json
          id?: string
          parameter?: string
          weight?: number
          worksheet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stem_rubrics_worksheet_id_fkey"
            columns: ["worksheet_id"]
            isOneToOne: false
            referencedRelation: "stem_worksheets"
            referencedColumns: ["id"]
          },
        ]
      }
      stem_worksheets: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          goals: string | null
          id: string
          image_url: string | null
          level: string
          pdf_url: string | null
          steps: Json | null
          title: string
          tools: Json | null
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          goals?: string | null
          id?: string
          image_url?: string | null
          level?: string
          pdf_url?: string | null
          steps?: Json | null
          title: string
          tools?: Json | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          goals?: string | null
          id?: string
          image_url?: string | null
          level?: string
          pdf_url?: string | null
          steps?: Json | null
          title?: string
          tools?: Json | null
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
      get_my_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: { allowed_roles: Database["public"]["Enums"]["user_role"][] }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      user_role: "super_admin" | "pengurus_konten" | "guru_akademik" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["super_admin", "pengurus_konten", "guru_akademik", "user"],
    },
  },
} as const
