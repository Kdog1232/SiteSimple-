export type InquiryRow = {
  id: string;
  created_at: string;
  name: string;
  business_name: string;
  email: string;
  phone: string | null;
  business_type: string;
  current_website: string | null;
  package_interest: string;
  owns_domain: string;
  description: string;
  goal: string;
  notes: string | null;
  status: string;
  source: string;
  submission_id: string;
  owner_email_status: string;
  owner_email_id: string | null;
  customer_email_status: string;
  customer_email_id: string | null;
  email_last_error: string | null;
};

export type InquiryInsert = {
  id?: string;
  created_at?: string;
  name: string;
  business_name: string;
  email: string;
  phone?: string | null;
  business_type: string;
  current_website?: string | null;
  package_interest: string;
  owns_domain: string;
  description: string;
  goal: string;
  notes?: string | null;
  status?: string;
  source?: string;
  submission_id: string;
  owner_email_status?: string;
  owner_email_id?: string | null;
  customer_email_status?: string;
  customer_email_id?: string | null;
  email_last_error?: string | null;
};

export type InquiryUpdate = Partial<InquiryInsert>;

export type Database = {
  public: {
    Tables: {
      sitesimple_inquiries: {
        Row: InquiryRow;
        Insert: InquiryInsert;
        Update: InquiryUpdate;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      sitesimple_check_inquiry_rate_limit: {
        Args: {
          p_fingerprint: string;
          p_max_requests: number;
          p_window_minutes: number;
        };
        Returns: boolean;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
