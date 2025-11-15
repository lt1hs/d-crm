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
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          username: string | null
          avatar_url: string | null
          role: 'admin' | 'manager' | 'employee'
          department: string | null
          position: string | null
          location: string | null
          phone: string | null
          bio: string | null
          status: 'online' | 'offline' | 'away' | 'busy'
          timezone: string
          language: string
          theme: 'light' | 'dark' | 'system'
          notifications_enabled: boolean
          email_notifications: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          role?: 'admin' | 'manager' | 'employee'
          department?: string | null
          position?: string | null
          location?: string | null
          phone?: string | null
          bio?: string | null
          status?: 'online' | 'offline' | 'away' | 'busy'
          timezone?: string
          language?: string
          theme?: 'light' | 'dark' | 'system'
          notifications_enabled?: boolean
          email_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: 'admin' | 'manager' | 'employee'
          department?: string | null
          position?: string | null
          location?: string | null
          phone?: string | null
          bio?: string | null
          status?: 'online' | 'offline' | 'away' | 'busy'
          timezone?: string
          language?: string
          theme?: 'light' | 'dark' | 'system'
          notifications_enabled?: boolean
          email_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          icon: string
          owner_id: string
          status: 'active' | 'on-hold' | 'completed' | 'archived'
          start_date: string
          end_date: string | null
          budget: number | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string
          icon?: string
          owner_id: string
          status?: 'active' | 'on-hold' | 'completed' | 'archived'
          start_date: string
          end_date?: string | null
          budget?: number | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string
          icon?: string
          owner_id?: string
          status?: 'active' | 'on-hold' | 'completed' | 'archived'
          start_date?: string
          end_date?: string | null
          budget?: number | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
          joined_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          joined_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          project_id: string
          assignee_id: string | null
          creator_id: string
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'todo' | 'in-progress' | 'review' | 'blocked' | 'completed' | 'cancelled'
          tags: string[]
          due_date: string | null
          estimated_hours: number | null
          actual_hours: number | null
          start_date: string | null
          completed_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          project_id: string
          assignee_id?: string | null
          creator_id: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'todo' | 'in-progress' | 'review' | 'blocked' | 'completed' | 'cancelled'
          tags?: string[]
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          start_date?: string | null
          completed_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          project_id?: string
          assignee_id?: string | null
          creator_id?: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'todo' | 'in-progress' | 'review' | 'blocked' | 'completed' | 'cancelled'
          tags?: string[]
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          start_date?: string | null
          completed_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      task_dependencies: {
        Row: {
          id: string
          task_id: string
          depends_on_task_id: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          depends_on_task_id: string
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          depends_on_task_id?: string
          created_at?: string
        }
      }
      subtasks: {
        Row: {
          id: string
          task_id: string
          title: string
          completed: boolean
          assignee_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          title: string
          completed?: boolean
          assignee_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          title?: string
          completed?: boolean
          assignee_id?: string | null
          created_at?: string
        }
      }
      task_attachments: {
        Row: {
          id: string
          task_id: string
          name: string
          url: string
          type: string
          size: number
          uploaded_by: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          task_id: string
          name: string
          url: string
          type: string
          size: number
          uploaded_by: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          name?: string
          url?: string
          type?: string
          size?: number
          uploaded_by?: string
          uploaded_at?: string
        }
      }
      task_comments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          content: string
          mentions: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          content: string
          mentions?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          content?: string
          mentions?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      time_entries: {
        Row: {
          id: string
          task_id: string
          user_id: string
          description: string | null
          hours: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          description?: string | null
          hours: number
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          description?: string | null
          hours?: number
          date?: string
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          name: string | null
          type: 'direct' | 'group' | 'channel' | 'personal'
          avatar_url: string | null
          pinned: boolean
          archived: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          type: 'direct' | 'group' | 'channel' | 'personal'
          avatar_url?: string | null
          pinned?: boolean
          archived?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          type?: 'direct' | 'group' | 'channel' | 'personal'
          avatar_url?: string | null
          pinned?: boolean
          archived?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversation_participants: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          role: 'admin' | 'member'
          joined_at: string
          last_read_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          role?: 'admin' | 'member'
          joined_at?: string
          last_read_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          role?: 'admin' | 'member'
          joined_at?: string
          last_read_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          type: 'text' | 'file' | 'system'
          file_url: string | null
          file_name: string | null
          file_size: number | null
          edited: boolean
          read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          type?: 'text' | 'file' | 'system'
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          edited?: boolean
          read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          type?: 'text' | 'file' | 'system'
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          edited?: boolean
          read?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      message_reactions: {
        Row: {
          id: string
          message_id: string
          user_id: string
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          emoji: string
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          emoji?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error' | 'task' | 'mention' | 'system'
          read: boolean
          action_url: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error' | 'task' | 'mention' | 'system'
          read?: boolean
          action_url?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error' | 'task' | 'mention' | 'system'
          read?: boolean
          action_url?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          type: 'meeting' | 'deadline' | 'holiday' | 'birthday' | 'time-off' | 'other'
          start_time: string
          end_time: string
          all_day: boolean
          location: string | null
          color: string
          creator_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: 'meeting' | 'deadline' | 'holiday' | 'birthday' | 'time-off' | 'other'
          start_time: string
          end_time: string
          all_day?: boolean
          location?: string | null
          color?: string
          creator_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: 'meeting' | 'deadline' | 'holiday' | 'birthday' | 'time-off' | 'other'
          start_time?: string
          end_time?: string
          all_day?: boolean
          location?: string | null
          color?: string
          creator_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      event_participants: {
        Row: {
          id: string
          event_id: string
          user_id: string
          status: 'pending' | 'accepted' | 'declined' | 'tentative'
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          status?: 'pending' | 'accepted' | 'declined' | 'tentative'
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          status?: 'pending' | 'accepted' | 'declined' | 'tentative'
          created_at?: string
        }
      }
      publications: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string | null
          type: 'news' | 'article' | 'magazine' | 'infographic' | 'video' | 'course'
          status: 'draft' | 'pending' | 'published' | 'archived'
          author_id: string
          category: string | null
          tags: string[]
          featured_image: string | null
          published_at: string | null
          views: number
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt?: string | null
          type: 'news' | 'article' | 'magazine' | 'infographic' | 'video' | 'course'
          status?: 'draft' | 'pending' | 'published' | 'archived'
          author_id: string
          category?: string | null
          tags?: string[]
          featured_image?: string | null
          published_at?: string | null
          views?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string | null
          type?: 'news' | 'article' | 'magazine' | 'infographic' | 'video' | 'course'
          status?: 'draft' | 'pending' | 'published' | 'archived'
          author_id?: string
          category?: string | null
          tags?: string[]
          featured_image?: string | null
          published_at?: string | null
          views?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          metadata: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          metadata?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          metadata?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_unread_message_count: {
        Args: {
          user_uuid: string
        }
        Returns: number
      }
      mark_conversation_read: {
        Args: {
          conv_id: string
          user_uuid: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
