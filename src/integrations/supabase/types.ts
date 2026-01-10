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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      asset_accounts: {
        Row: {
          created_at: string
          id: string
          institution_name: string
          logo_url: string | null
          mask: string | null
          metadata: Json | null
          name: string
          portfolio_id: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          institution_name: string
          logo_url?: string | null
          mask?: string | null
          metadata?: Json | null
          name: string
          portfolio_id: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          institution_name?: string
          logo_url?: string | null
          mask?: string | null
          metadata?: Json | null
          name?: string
          portfolio_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_accounts_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_line_items: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string
          id: string
          inferred_category: string | null
          raw_category: string | null
          snapshot_id: string
          zakat_category: string
          zakat_rule_override: number | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description: string
          id?: string
          inferred_category?: string | null
          raw_category?: string | null
          snapshot_id: string
          zakat_category: string
          zakat_rule_override?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string
          id?: string
          inferred_category?: string | null
          raw_category?: string | null
          snapshot_id?: string
          zakat_category?: string
          zakat_rule_override?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_line_items_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "asset_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_snapshots: {
        Row: {
          account_id: string
          created_at: string
          id: string
          method: string
          source_document_path: string | null
          statement_date: string
          status: string
          total_value: number
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          id?: string
          method: string
          source_document_path?: string | null
          statement_date: string
          status?: string
          total_value?: number
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          id?: string
          method?: string
          source_document_path?: string | null
          statement_date?: string
          status?: string
          total_value?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_snapshots_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "asset_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      classification_feedback: {
        Row: {
          account_type: string | null
          apply_always: boolean | null
          corrected_at: string | null
          corrected_category: string | null
          created_at: string | null
          description: string | null
          id: string
          institution_name: string | null
          line_item_id: string | null
          predicted_category: string
          predicted_confidence: number | null
          signals_used: Json | null
          source_type: string | null
          user_id: string
        }
        Insert: {
          account_type?: string | null
          apply_always?: boolean | null
          corrected_at?: string | null
          corrected_category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          institution_name?: string | null
          line_item_id?: string | null
          predicted_category: string
          predicted_confidence?: number | null
          signals_used?: Json | null
          source_type?: string | null
          user_id: string
        }
        Update: {
          account_type?: string | null
          apply_always?: boolean | null
          corrected_at?: string | null
          corrected_category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          institution_name?: string | null
          line_item_id?: string | null
          predicted_category?: string
          predicted_confidence?: number | null
          signals_used?: Json | null
          source_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classification_feedback_line_item_id_fkey"
            columns: ["line_item_id"]
            isOneToOne: false
            referencedRelation: "asset_line_items"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          donation_date: string
          extracted_via_ai: boolean | null
          id: string
          notes: string | null
          receipt_url: string | null
          recipient_category: string
          recipient_name: string
          updated_at: string
          user_id: string
          zakat_year_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          donation_date: string
          extracted_via_ai?: boolean | null
          id?: string
          notes?: string | null
          receipt_url?: string | null
          recipient_category: string
          recipient_name: string
          updated_at?: string
          user_id: string
          zakat_year_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          donation_date?: string
          extracted_via_ai?: boolean | null
          id?: string
          notes?: string | null
          receipt_url?: string | null
          recipient_category?: string
          recipient_name?: string
          updated_at?: string
          user_id?: string
          zakat_year_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_zakat_year_id_fkey"
            columns: ["zakat_year_id"]
            isOneToOne: false
            referencedRelation: "zakat_years"
            referencedColumns: ["id"]
          },
        ]
      }
      hawl_settings: {
        Row: {
          calendar_type: string
          created_at: string
          hawl_start_date: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          calendar_type?: string
          created_at?: string
          hawl_start_date: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          calendar_type?: string
          created_at?: string
          hawl_start_date?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plaid_accounts: {
        Row: {
          account_id: string
          asset_account_id: string | null
          balance_available: number | null
          balance_current: number | null
          balance_iso_currency_code: string | null
          created_at: string | null
          id: string
          is_active_trader: boolean | null
          last_synced_at: string | null
          mask: string | null
          name: string | null
          official_name: string | null
          plaid_item_id: string
          subtype: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          account_id: string
          asset_account_id?: string | null
          balance_available?: number | null
          balance_current?: number | null
          balance_iso_currency_code?: string | null
          created_at?: string | null
          id?: string
          is_active_trader?: boolean | null
          last_synced_at?: string | null
          mask?: string | null
          name?: string | null
          official_name?: string | null
          plaid_item_id: string
          subtype?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          asset_account_id?: string | null
          balance_available?: number | null
          balance_current?: number | null
          balance_iso_currency_code?: string | null
          created_at?: string | null
          id?: string
          is_active_trader?: boolean | null
          last_synced_at?: string | null
          mask?: string | null
          name?: string | null
          official_name?: string | null
          plaid_item_id?: string
          subtype?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plaid_accounts_asset_account_id_fkey"
            columns: ["asset_account_id"]
            isOneToOne: false
            referencedRelation: "asset_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plaid_accounts_plaid_item_id_fkey"
            columns: ["plaid_item_id"]
            isOneToOne: false
            referencedRelation: "plaid_items"
            referencedColumns: ["id"]
          },
        ]
      }
      plaid_holdings: {
        Row: {
          cost_basis: number | null
          created_at: string | null
          id: string
          institution_price: number | null
          institution_value: number | null
          iso_currency_code: string | null
          name: string | null
          plaid_account_id: string
          price_as_of: string | null
          quantity: number | null
          security_id: string | null
          security_type: string | null
          ticker_symbol: string | null
          unofficial_currency_code: string | null
          updated_at: string | null
        }
        Insert: {
          cost_basis?: number | null
          created_at?: string | null
          id?: string
          institution_price?: number | null
          institution_value?: number | null
          iso_currency_code?: string | null
          name?: string | null
          plaid_account_id: string
          price_as_of?: string | null
          quantity?: number | null
          security_id?: string | null
          security_type?: string | null
          ticker_symbol?: string | null
          unofficial_currency_code?: string | null
          updated_at?: string | null
        }
        Update: {
          cost_basis?: number | null
          created_at?: string | null
          id?: string
          institution_price?: number | null
          institution_value?: number | null
          iso_currency_code?: string | null
          name?: string | null
          plaid_account_id?: string
          price_as_of?: string | null
          quantity?: number | null
          security_id?: string | null
          security_type?: string | null
          ticker_symbol?: string | null
          unofficial_currency_code?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plaid_holdings_plaid_account_id_fkey"
            columns: ["plaid_account_id"]
            isOneToOne: false
            referencedRelation: "plaid_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      plaid_items: {
        Row: {
          access_token: string
          consent_expiration_time: string | null
          created_at: string | null
          error_code: string | null
          error_message: string | null
          id: string
          institution_id: string | null
          institution_name: string | null
          item_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          consent_expiration_time?: string | null
          created_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          item_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          consent_expiration_time?: string | null
          created_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          item_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          created_at: string
          currency: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          public_key: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          public_key?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          public_key?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_aggregates: {
        Row: {
          created_at: string
          referral_code: string
          referrer_session_hash: string
          referrer_user_id: string | null
          total_assets_calculated: number
          total_referrals: number
          total_zakat_calculated: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          referral_code: string
          referrer_session_hash: string
          referrer_user_id?: string | null
          total_assets_calculated?: number
          total_referrals?: number
          total_zakat_calculated?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          referral_code?: string
          referrer_session_hash?: string
          referrer_user_id?: string | null
          total_assets_calculated?: number
          total_referrals?: number
          total_zakat_calculated?: number
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_session_hash: string | null
          referred_user_id: string | null
          referrer_session_hash: string
          referrer_user_id: string | null
          total_assets: number | null
          zakat_due: number | null
        }
        Insert: {
          converted_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_session_hash?: string | null
          referred_user_id?: string | null
          referrer_session_hash: string
          referrer_user_id?: string | null
          total_assets?: number | null
          zakat_due?: number | null
        }
        Update: {
          converted_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_session_hash?: string | null
          referred_user_id?: string | null
          referrer_session_hash?: string
          referrer_user_id?: string | null
          total_assets?: number | null
          zakat_due?: number | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          encrypted_master_key: string | null
          id: string
          persistence_mode: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          encrypted_master_key?: string | null
          id: string
          persistence_mode?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          encrypted_master_key?: string | null
          id?: string
          persistence_mode?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      zakat_anonymous_events: {
        Row: {
          created_at: string
          event_date: string
          id: string
          session_hash: string
          total_assets: number
          zakat_due: number
        }
        Insert: {
          created_at?: string
          event_date?: string
          id?: string
          session_hash: string
          total_assets?: number
          zakat_due?: number
        }
        Update: {
          created_at?: string
          event_date?: string
          id?: string
          session_hash?: string
          total_assets?: number
          zakat_due?: number
        }
        Relationships: []
      }
      zakat_calculation_shares: {
        Row: {
          accepted_at: string | null
          calculation_id: string
          created_at: string
          encrypted_form_data: string | null
          encrypted_symmetric_key: string | null
          id: string
          owner_id: string
          shared_with_email: string
          shared_with_user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          calculation_id: string
          created_at?: string
          encrypted_form_data?: string | null
          encrypted_symmetric_key?: string | null
          id?: string
          owner_id: string
          shared_with_email: string
          shared_with_user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          calculation_id?: string
          created_at?: string
          encrypted_form_data?: string | null
          encrypted_symmetric_key?: string | null
          id?: string
          owner_id?: string
          shared_with_email?: string
          shared_with_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "zakat_calculation_shares_calculation_id_fkey"
            columns: ["calculation_id"]
            isOneToOne: false
            referencedRelation: "zakat_calculations"
            referencedColumns: ["id"]
          },
        ]
      }
      zakat_calculations: {
        Row: {
          created_at: string
          encryption_version: number | null
          form_data: Json
          id: string
          is_above_nisab: boolean | null
          name: string
          updated_at: string
          user_id: string
          version: number
          year_type: string
          year_value: number
          zakat_due: number | null
        }
        Insert: {
          created_at?: string
          encryption_version?: number | null
          form_data: Json
          id?: string
          is_above_nisab?: boolean | null
          name: string
          updated_at?: string
          user_id: string
          version?: number
          year_type: string
          year_value: number
          zakat_due?: number | null
        }
        Update: {
          created_at?: string
          encryption_version?: number | null
          form_data?: Json
          id?: string
          is_above_nisab?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
          version?: number
          year_type?: string
          year_value?: number
          zakat_due?: number | null
        }
        Relationships: []
      }
      zakat_usage_aggregates: {
        Row: {
          calculation_count: number
          period_type: string
          period_value: string
          total_assets: number
          total_zakat: number
          unique_sessions: number
          updated_at: string
        }
        Insert: {
          calculation_count?: number
          period_type: string
          period_value: string
          total_assets?: number
          total_zakat?: number
          unique_sessions?: number
          updated_at?: string
        }
        Update: {
          calculation_count?: number
          period_type?: string
          period_value?: string
          total_assets?: number
          total_zakat?: number
          unique_sessions?: number
          updated_at?: string
        }
        Relationships: []
      }
      zakat_years: {
        Row: {
          calculated_amount: number
          calculation_id: string | null
          created_at: string
          hawl_end: string
          hawl_start: string
          id: string
          is_current: boolean
          is_superseded: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          calculated_amount?: number
          calculation_id?: string | null
          created_at?: string
          hawl_end: string
          hawl_start: string
          id?: string
          is_current?: boolean
          is_superseded?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          calculated_amount?: number
          calculation_id?: string | null
          created_at?: string
          hawl_end?: string
          hawl_start?: string
          id?: string
          is_current?: boolean
          is_superseded?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_authenticated_email: { Args: never; Returns: string }
      get_recursive_referral_stats: {
        Args: { p_referral_code: string; p_session_hash?: string }
        Returns: {
          total_assets_calculated: number
          total_referrals: number
          total_zakat_calculated: number
        }[]
      }
      increment_referral_aggregate: {
        Args: {
          p_assets: number
          p_referral_code: string
          p_referrer_session_hash: string
          p_referrer_user_id: string
          p_zakat: number
        }
        Returns: undefined
      }
      increment_usage_aggregate: {
        Args: {
          p_assets: number
          p_period_type: string
          p_period_value: string
          p_zakat: number
        }
        Returns: undefined
      }
      is_share_recipient: { Args: { share_id: string }; Returns: boolean }
      update_calculation_with_version: {
        Args: {
          p_expected_version: number
          p_form_data: Json
          p_id: string
          p_is_above_nisab: boolean
          p_name: string
          p_user_id: string
          p_zakat_due: number
        }
        Returns: {
          current_data: Json
          new_version: number
          success: boolean
        }[]
      }
    }
    Enums: {
      calendar_type: "gregorian" | "hijri"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      calendar_type: ["gregorian", "hijri"],
    },
  },
} as const
