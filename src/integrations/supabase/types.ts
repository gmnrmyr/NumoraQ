export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cms_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      financial_data: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data: Json
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      premium_codes: {
        Row: {
          code: string
          code_type: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          used_at: string | null
          used_by: string | null
          user_email: string | null
        }
        Insert: {
          code: string
          code_type: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          used_at?: string | null
          used_by?: string | null
          user_email?: string | null
        }
        Update: {
          code?: string
          code_type?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          used_at?: string | null
          used_by?: string | null
          user_email?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          default_currency: string | null
          id: string
          language: string | null
          live_data_enabled: boolean | null
          name: string | null
          updated_at: string | null
          user_uid: string | null
        }
        Insert: {
          created_at?: string | null
          default_currency?: string | null
          id: string
          language?: string | null
          live_data_enabled?: boolean | null
          name?: string | null
          updated_at?: string | null
          user_uid?: string | null
        }
        Update: {
          created_at?: string | null
          default_currency?: string | null
          id?: string
          language?: string | null
          live_data_enabled?: boolean | null
          name?: string | null
          updated_at?: string | null
          user_uid?: string | null
        }
        Relationships: []
      }
      user_points: {
        Row: {
          activity_date: string
          activity_type: string
          created_at: string
          id: string
          points: number
          user_id: string
        }
        Insert: {
          activity_date?: string
          activity_type: string
          created_at?: string
          id?: string
          points?: number
          user_id: string
        }
        Update: {
          activity_date?: string
          activity_type?: string
          created_at?: string
          id?: string
          points?: number
          user_id?: string
        }
        Relationships: []
      }
      user_premium_status: {
        Row: {
          activated_at: string | null
          activated_code: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_premium: boolean
          premium_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          activated_code?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_premium?: boolean
          premium_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activated_at?: string | null
          activated_code?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_premium?: boolean
          premium_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_premium_status_activated_code_fkey"
            columns: ["activated_code"]
            isOneToOne: false
            referencedRelation: "premium_codes"
            referencedColumns: ["code"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_uid: {
        Args: { base_name: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
