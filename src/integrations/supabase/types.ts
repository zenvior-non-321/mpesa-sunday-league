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
      app_data_store: {
        Row: {
          access_class: string
          data: Json
          key: string
          updated_at: string
        }
        Insert: {
          access_class?: string
          data?: Json
          key: string
          updated_at?: string
        }
        Update: {
          access_class?: string
          data?: Json
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      board_registry: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      calendar_activities: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      club_applications: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_dispatches: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      fantasy_challenges: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      fantasy_ratings: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      fantasy_squads: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      fixtures: {
        Row: {
          active: boolean
          away_team_id: number
          home_team_id: number
          id: number
          kickoff_time: string
          match_date: string
          matchweek: number
          status: string
          updated_at: string
          venue: string
        }
        Insert: {
          active?: boolean
          away_team_id: number
          home_team_id: number
          id: number
          kickoff_time?: string
          match_date?: string
          matchweek?: number
          status?: string
          updated_at?: string
          venue?: string
        }
        Update: {
          active?: boolean
          away_team_id?: number
          home_team_id?: number
          id?: number
          kickoff_time?: string
          match_date?: string
          matchweek?: number
          status?: string
          updated_at?: string
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "fixtures_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixtures_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      league_broadcasts: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      league_decrees: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      league_finances: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      league_highlights: {
        Row: {
          active: boolean
          id: string
          record: Json
          title: string
        }
        Insert: {
          active?: boolean
          id: string
          record?: Json
          title?: string
        }
        Update: {
          active?: boolean
          id?: string
          record?: Json
          title?: string
        }
        Relationships: []
      }
      league_injuries: {
        Row: {
          active: boolean
          id: string
          record: Json
          team_id: number | null
        }
        Insert: {
          active?: boolean
          id: string
          record?: Json
          team_id?: number | null
        }
        Update: {
          active?: boolean
          id?: string
          record?: Json
          team_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "league_injuries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      league_inquiries: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      league_media: {
        Row: {
          active: boolean
          id: string
          record: Json
          title: string
        }
        Insert: {
          active?: boolean
          id: string
          record?: Json
          title?: string
        }
        Update: {
          active?: boolean
          id?: string
          record?: Json
          title?: string
        }
        Relationships: []
      }
      league_news: {
        Row: {
          active: boolean
          id: string
          record: Json
          title: string
        }
        Insert: {
          active?: boolean
          id: string
          record?: Json
          title?: string
        }
        Update: {
          active?: boolean
          id?: string
          record?: Json
          title?: string
        }
        Relationships: []
      }
      league_referees: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      league_rules: {
        Row: {
          active: boolean
          description: string
          id: string
          record: Json
          title: string
        }
        Insert: {
          active?: boolean
          description?: string
          id: string
          record?: Json
          title?: string
        }
        Update: {
          active?: boolean
          description?: string
          id?: string
          record?: Json
          title?: string
        }
        Relationships: []
      }
      league_seasons: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      league_shared_state: {
        Row: {
          data: Json
          deleted_team_ids: Json
          id: number
          revision: number
        }
        Insert: {
          data?: Json
          deleted_team_ids?: Json
          id?: number
          revision?: number
        }
        Update: {
          data?: Json
          deleted_team_ids?: Json
          id?: number
          revision?: number
        }
        Relationships: []
      }
      league_standings_records: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      match_reports: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      match_results: {
        Row: {
          away_score: number
          fixture_id: number
          home_score: number
          scorers: Json
          updated_at: string
        }
        Insert: {
          away_score?: number
          fixture_id: number
          home_score?: number
          scorers?: Json
          updated_at?: string
        }
        Update: {
          away_score?: number
          fixture_id?: number
          home_score?: number
          scorers?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_results_fixture_id_fkey"
            columns: ["fixture_id"]
            isOneToOne: true
            referencedRelation: "fixtures"
            referencedColumns: ["id"]
          },
        ]
      }
      match_sheets: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      mvp_votes: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      mvp_winners: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      other_league_records: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      player_private_details: {
        Row: {
          details: Json
          player_id: string
        }
        Insert: {
          details?: Json
          player_id: string
        }
        Update: {
          details?: Json
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_private_details_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_statistics: {
        Row: {
          active: boolean
          assists: number
          goals: number
          id: string
          player_name: string
          record: Json
          team_id: number
        }
        Insert: {
          active?: boolean
          assists?: number
          goals?: number
          id: string
          player_name: string
          record?: Json
          team_id: number
        }
        Update: {
          active?: boolean
          assists?: number
          goals?: number
          id?: string
          player_name?: string
          record?: Json
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "player_statistics_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          active: boolean
          id: string
          name: string
          photo_url: string
          position: string
          preferred_foot: string
          shirt_number: number | null
          team_id: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          id: string
          name: string
          photo_url?: string
          position?: string
          preferred_foot?: string
          shirt_number?: number | null
          team_id: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          id?: string
          name?: string
          photo_url?: string
          position?: string
          preferred_foot?: string
          shirt_number?: number | null
          team_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      portal_access: {
        Row: {
          credential_id: number
          profile: Json
          role_key: string
        }
        Insert: {
          credential_id: number
          profile?: Json
          role_key: string
        }
        Update: {
          credential_id?: number
          profile?: Json
          role_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_access_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: true
            referencedRelation: "portal_credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_credentials: {
        Row: {
          active: boolean
          code_ciphertext: string
          code_hash: string
          id: number
        }
        Insert: {
          active?: boolean
          code_ciphertext: string
          code_hash: string
          id: number
        }
        Update: {
          active?: boolean
          code_ciphertext?: string
          code_hash?: string
          id?: number
        }
        Relationships: []
      }
      portal_login_limits: {
        Row: {
          attempts: number
          key_hash: string
          window_start: string
        }
        Insert: {
          attempts?: number
          key_hash: string
          window_start?: string
        }
        Update: {
          attempts?: number
          key_hash?: string
          window_start?: string
        }
        Relationships: []
      }
      site_song: {
        Row: {
          id: number
          title: string | null
          updated_at: string
          youtube_id: string | null
          youtube_url: string | null
        }
        Insert: {
          id?: number
          title?: string | null
          updated_at?: string
          youtube_id?: string | null
          youtube_url?: string | null
        }
        Update: {
          id?: number
          title?: string | null
          updated_at?: string
          youtube_id?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          active: boolean
          captain: string
          home_pitch: string
          id: number
          name: string
          short_code: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          captain?: string
          home_pitch?: string
          id: number
          name: string
          short_code?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          captain?: string
          home_pitch?: string
          id?: number
          name?: string
          short_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      tryout_requests: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      voter_verifications: {
        Row: {
          record: Json
          row_key: string
          store_key: string
          updated_at: string
        }
        Insert: {
          record?: Json
          row_key: string
          store_key: string
          updated_at?: string
        }
        Update: {
          record?: Json
          row_key?: string
          store_key?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
