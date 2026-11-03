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
      admin_profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          class: string | null
          created_at: string
          created_by: string | null
          department: string | null
          email: string | null
          full_name: string
          id: string
          is_active: boolean | null
          last_login_at: string | null
          last_password_change: string | null
          motto: string | null
          must_change_password: boolean | null
          nip: string | null
          nis_or_nip: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status_badge: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          class?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email?: string | null
          full_name: string
          id: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_password_change?: string | null
          motto?: string | null
          must_change_password?: boolean | null
          nip?: string | null
          nis_or_nip?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status_badge?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          class?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_password_change?: string | null
          motto?: string | null
          must_change_password?: boolean | null
          nip?: string | null
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
          is_active: boolean | null
          is_featured: boolean | null
          location: string
          month: string
          order_index: number | null
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
          is_active?: boolean | null
          is_featured?: boolean | null
          location: string
          month: string
          order_index?: number | null
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
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string
          month?: string
          order_index?: number | null
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
          author: string | null
          author_id: string | null
          category: string
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_pinned: boolean | null
          is_published: boolean
          location: string[] | null
          order_index: number | null
          published_at: string
          slug: string
          summary: string | null
          thumbnail: string | null
          title: string
          updated_at: string | null
          views: number
        }
        Insert: {
          author?: string | null
          author_id?: string | null
          category?: string
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_pinned?: boolean | null
          is_published?: boolean
          location?: string[] | null
          order_index?: number | null
          published_at?: string
          slug: string
          summary?: string | null
          thumbnail?: string | null
          title: string
          updated_at?: string | null
          views?: number
        }
        Update: {
          author?: string | null
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_pinned?: boolean | null
          is_published?: boolean
          location?: string[] | null
          order_index?: number | null
          published_at?: string
          slug?: string
          summary?: string | null
          thumbnail?: string | null
          title?: string
          updated_at?: string | null
          views?: number
        }
        Relationships: []
      }
      ekskul: {
        Row: {
          category: string
          coach: string | null
          created_at: string
          description: string | null
          id: string
          images: Json | null
          instructor_name: string | null
          is_active: boolean
          is_featured: boolean | null
          location: string | null
          name: string
          order_index: number | null
          photo_url: string | null
          schedule: string | null
          syllabus: string | null
          target: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string
          coach?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          instructor_name?: string | null
          is_active?: boolean
          is_featured?: boolean | null
          location?: string | null
          name: string
          order_index?: number | null
          photo_url?: string | null
          schedule?: string | null
          syllabus?: string | null
          target?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          coach?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          instructor_name?: string | null
          is_active?: boolean
          is_featured?: boolean | null
          location?: string | null
          name?: string
          order_index?: number | null
          photo_url?: string | null
          schedule?: string | null
          syllabus?: string | null
          target?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      facilities: {
        Row: {
          capacity: string | null
          category: string
          created_at: string
          description: string | null
          features: Json
          id: string
          image_url: string
          is_active: boolean
          is_featured: boolean | null
          location: string[] | null
          name: string
          order_index: number | null
          updated_at: string | null
        }
        Insert: {
          capacity?: string | null
          category?: string
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          image_url: string
          is_active?: boolean
          is_featured?: boolean | null
          location?: string[] | null
          name: string
          order_index?: number | null
          updated_at?: string | null
        }
        Update: {
          capacity?: string | null
          category?: string
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          image_url?: string
          is_active?: boolean
          is_featured?: boolean | null
          location?: string[] | null
          name?: string
          order_index?: number | null
          updated_at?: string | null
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
          is_active: boolean | null
          is_featured: boolean | null
          location: string[] | null
          order_index: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          album_id?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string[] | null
          order_index?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          album_id?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string[] | null
          order_index?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      galeri_videos: {
        Row: {
          album_id: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          order_index: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          youtube_url: string
        }
        Insert: {
          album_id?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          order_index?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          youtube_url: string
        }
        Update: {
          album_id?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          order_index?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          youtube_url?: string
        }
        Relationships: []
      }
      hafalan_setoran: {
        Row: {
          ayat_dari: number
          ayat_sampai: number
          catatan: string | null
          id: string
          juz: number
          penyimak: string | null
          penyimak_nama: string | null
          santri_id: string
          status: string
          surah: string
          tanggal: string
        }
        Insert: {
          ayat_dari?: number
          ayat_sampai?: number
          catatan?: string | null
          id?: string
          juz?: number
          penyimak?: string | null
          penyimak_nama?: string | null
          santri_id: string
          status?: string
          surah: string
          tanggal?: string
        }
        Update: {
          ayat_dari?: number
          ayat_sampai?: number
          catatan?: string | null
          id?: string
          juz?: number
          penyimak?: string | null
          penyimak_nama?: string | null
          santri_id?: string
          status?: string
          surah?: string
          tanggal?: string
        }
        Relationships: [
          {
            foreignKeyName: "hafalan_setoran_santri_id_fkey"
            columns: ["santri_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          created_at: string
          curriculum: Json | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          order_index: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          curriculum?: Json | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          order_index?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          curriculum?: Json | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          order_index?: number | null
          type?: string
          updated_at?: string | null
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
          updated_at: string | null
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
          updated_at?: string | null
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
          updated_at?: string | null
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
          is_active: boolean | null
          is_featured: boolean | null
          order_index: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          order_index?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          order_index?: number | null
          title?: string
          updated_at?: string | null
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
          is_active: boolean | null
          is_featured: boolean | null
          order_index: number | null
          output: string | null
          target: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          department: string
          description?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          order_index?: number | null
          output?: string | null
          target?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          department?: string
          description?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          order_index?: number | null
          output?: string | null
          target?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      osis_structure: {
        Row: {
          class: string | null
          created_at: string
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          level: number
          motto: string | null
          name: string
          order_index: number | null
          period: string | null
          photo_url: string | null
          position: string
          updated_at: string | null
        }
        Insert: {
          class?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          level?: number
          motto?: string | null
          name: string
          order_index?: number | null
          period?: string | null
          photo_url?: string | null
          position: string
          updated_at?: string | null
        }
        Update: {
          class?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          level?: number
          motto?: string | null
          name?: string
          order_index?: number | null
          period?: string | null
          photo_url?: string | null
          position?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      performance: {
        Row: {
          catatan_musyrif: string | null
          created_at: string
          created_by: string | null
          id: string
          jenis: string
          mapel: string
          nilai: number
          predikat: string
          santri_id: string
          semester: string
        }
        Insert: {
          catatan_musyrif?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          jenis: string
          mapel: string
          nilai: number
          predikat?: string
          santri_id: string
          semester?: string
        }
        Update: {
          catatan_musyrif?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          jenis?: string
          mapel?: string
          nilai?: number
          predikat?: string
          santri_id?: string
          semester?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_santri_id_fkey"
            columns: ["santri_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prestasi: {
        Row: {
          category: string
          certificate_url: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          is_published: boolean | null
          level: string
          location: string[] | null
          order_index: number | null
          organizer: string | null
          pembina_name: string | null
          photo_url: string | null
          santri_name: string
          title: string
          updated_at: string | null
          year: number
        }
        Insert: {
          category?: string
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_published?: boolean | null
          level?: string
          location?: string[] | null
          order_index?: number | null
          organizer?: string | null
          pembina_name?: string | null
          photo_url?: string | null
          santri_name: string
          title: string
          updated_at?: string | null
          year?: number
        }
        Update: {
          category?: string
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_published?: boolean | null
          level?: string
          location?: string[] | null
          order_index?: number | null
          organizer?: string | null
          pembina_name?: string | null
          photo_url?: string | null
          santri_name?: string
          title?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          angkatan: string | null
          bio: Json | null
          created_at: string
          email: string | null
          foto_url: string | null
          full_name: string
          hafalan_juz: number
          id: string
          kamar_asrama: string | null
          kelas: string | null
          nis: string | null
          no_wa_wali: string | null
          role: string
          updated_at: string
          wali_santri: string | null
        }
        Insert: {
          angkatan?: string | null
          bio?: Json | null
          created_at?: string
          email?: string | null
          foto_url?: string | null
          full_name?: string
          hafalan_juz?: number
          id: string
          kamar_asrama?: string | null
          kelas?: string | null
          nis?: string | null
          no_wa_wali?: string | null
          role?: string
          updated_at?: string
          wali_santri?: string | null
        }
        Update: {
          angkatan?: string | null
          bio?: Json | null
          created_at?: string
          email?: string | null
          foto_url?: string | null
          full_name?: string
          hafalan_juz?: number
          id?: string
          kamar_asrama?: string | null
          kelas?: string | null
          nis?: string | null
          no_wa_wali?: string | null
          role?: string
          updated_at?: string
          wali_santri?: string | null
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
      role_permissions: {
        Row: {
          can_create: boolean
          can_delete: boolean
          can_edit: boolean
          can_publish: boolean
          can_view: boolean
          role: string
          section: string
          updated_at: string
        }
        Insert: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_publish?: boolean
          can_view?: boolean
          role: string
          section: string
          updated_at?: string
        }
        Update: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_publish?: boolean
          can_view?: boolean
          role?: string
          section?: string
          updated_at?: string
        }
        Relationships: []
      }
      sambutan_persons: {
        Row: {
          achievements: string[] | null
          created_at: string | null
          created_by: string | null
          credentials: string[] | null
          end_date: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          location: string[] | null
          message_full: string | null
          message_short: string | null
          name: string
          order_index: number | null
          photo_url: string | null
          quote: string | null
          role_type: string
          social_links: Json | null
          start_date: string | null
          title: string
          type: string | null
          updated_at: string | null
          updated_by: string | null
          video_url: string | null
        }
        Insert: {
          achievements?: string[] | null
          created_at?: string | null
          created_by?: string | null
          credentials?: string[] | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string[] | null
          message_full?: string | null
          message_short?: string | null
          name: string
          order_index?: number | null
          photo_url?: string | null
          quote?: string | null
          role_type?: string
          social_links?: Json | null
          start_date?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
          video_url?: string | null
        }
        Update: {
          achievements?: string[] | null
          created_at?: string | null
          created_by?: string | null
          credentials?: string[] | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string[] | null
          message_full?: string | null
          message_short?: string | null
          name?: string
          order_index?: number | null
          photo_url?: string | null
          quote?: string | null
          role_type?: string
          social_links?: Json | null
          start_date?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
          video_url?: string | null
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
          is_featured: boolean | null
          kontak_wa: string | null
          order_index: number | null
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
          is_featured?: boolean | null
          kontak_wa?: string | null
          order_index?: number | null
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
          is_featured?: boolean | null
          kontak_wa?: string | null
          order_index?: number | null
          persyaratan?: Json | null
          tahun_ajaran?: string
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
      sub_items: {
        Row: {
          color: string | null
          created_at: string | null
          data: Json | null
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          order_index: number | null
          parent_module: string
          title: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          data?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number | null
          parent_module: string
          title: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          data?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number | null
          parent_module?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tugas: {
        Row: {
          attachment_url: string[]
          created_at: string
          deadline: string
          deskripsi: Json
          guru_id: string | null
          guru_nama: string | null
          id: string
          judul: string
          kelas_target: string
          mapel: string
          tipe: string
        }
        Insert: {
          attachment_url?: string[]
          created_at?: string
          deadline: string
          deskripsi?: Json
          guru_id?: string | null
          guru_nama?: string | null
          id?: string
          judul: string
          kelas_target?: string
          mapel: string
          tipe?: string
        }
        Update: {
          attachment_url?: string[]
          created_at?: string
          deadline?: string
          deskripsi?: Json
          guru_id?: string | null
          guru_nama?: string | null
          id?: string
          judul?: string
          kelas_target?: string
          mapel?: string
          tipe?: string
        }
        Relationships: [
          {
            foreignKeyName: "tugas_guru_id_fkey"
            columns: ["guru_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tugas_submission: {
        Row: {
          feedback: string | null
          file_url: string[]
          id: string
          jawaban_text: Json
          nilai: number | null
          santri_id: string
          status: string
          submitted_at: string | null
          tugas_id: string
          updated_at: string
        }
        Insert: {
          feedback?: string | null
          file_url?: string[]
          id?: string
          jawaban_text?: Json
          nilai?: number | null
          santri_id: string
          status?: string
          submitted_at?: string | null
          tugas_id: string
          updated_at?: string
        }
        Update: {
          feedback?: string | null
          file_url?: string[]
          id?: string
          jawaban_text?: Json
          nilai?: number | null
          santri_id?: string
          status?: string
          submitted_at?: string | null
          tugas_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tugas_submission_santri_id_fkey"
            columns: ["santri_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tugas_submission_tugas_id_fkey"
            columns: ["tugas_id"]
            isOneToOne: false
            referencedRelation: "tugas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      news: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string | null
          id: string | null
          is_pinned: boolean | null
          is_published: boolean | null
          slug: string | null
          summary: string | null
          thumbnail: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_pinned?: never
          is_published?: boolean | null
          slug?: string | null
          summary?: never
          thumbnail?: never
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_pinned?: never
          is_published?: boolean | null
          slug?: string | null
          summary?: never
          thumbnail?: never
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_create_user: {
        Args: {
          p_avatar_url?: string
          p_bio?: string
          p_class?: string
          p_email: string
          p_full_name: string
          p_motto?: string
          p_nip?: string
          p_password: string
          p_phone?: string
          p_role: string
        }
        Returns: Json
      }
      admin_delete_user: {
        Args: { p_confirm_email: string; p_user_id: string }
        Returns: Json
      }
      admin_reset_user_password: {
        Args: { p_new_password: string; p_user_id: string }
        Returns: Json
      }
      admin_toggle_user_status: {
        Args: { p_is_active: boolean; p_user_id: string }
        Returns: Json
      }
      admin_update_user: {
        Args: {
          p_avatar_url?: string
          p_bio?: string
          p_class?: string
          p_full_name: string
          p_is_active?: boolean
          p_motto?: string
          p_nip?: string
          p_phone?: string
          p_role: string
          p_user_id: string
        }
        Returns: Json
      }
      check_user_role: {
        Args: { required_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      ensure_santri_profile: {
        Args: { p_email?: string; p_full_name?: string }
        Returns: {
          angkatan: string | null
          bio: Json | null
          created_at: string
          email: string | null
          foto_url: string | null
          full_name: string
          hafalan_juz: number
          id: string
          kamar_asrama: string | null
          kelas: string | null
          nis: string | null
          no_wa_wali: string | null
          role: string
          updated_at: string
          wali_santri: string | null
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_my_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_perm: {
        Args: { p_action: string; p_section: string }
        Returns: boolean
      }
      has_role: {
        Args: { allowed_roles: Database["public"]["Enums"]["user_role"][] }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_staff_or_guru: { Args: never; Returns: boolean }
    }
    Enums: {
      user_role:
        | "super_admin"
        | "pengurus_konten"
        | "guru_akademik"
        | "user"
        | "santri"
        | "wali_santri"
        | "alumni"
        | "admin_yayasan"
        | "kepala_sekolah"
        | "guru"
        | "musyrif"
        | "staff_ppdb"
        | "keuangan"
        | "humas"
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
      user_role: [
        "super_admin",
        "pengurus_konten",
        "guru_akademik",
        "user",
        "santri",
        "wali_santri",
        "alumni",
        "admin_yayasan",
        "kepala_sekolah",
        "guru",
        "musyrif",
        "staff_ppdb",
        "keuangan",
        "humas",
      ],
    },
  },
} as const

