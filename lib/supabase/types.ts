// Database types for Supabase, matches ACTUAL production schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      speakers: {
        Row: {
          id: string;
          slug: string;
          name: string;
          title: string | null;
          organization: string | null;
          bio: string | null;
          image_url: string | null;
          linkedin_url: string | null;
          role_type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          title?: string | null;
          organization?: string | null;
          bio?: string | null;
          image_url?: string | null;
          linkedin_url?: string | null;
          role_type?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          title?: string | null;
          organization?: string | null;
          bio?: string | null;
          image_url?: string | null;
          linkedin_url?: string | null;
          role_type?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      speaker_events: {
        Row: {
          id: string;
          speaker_id: string;
          event_name: string;
          event_year: number;
          role_at_event: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          speaker_id: string;
          event_name: string;
          event_year?: number;
          role_at_event?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          speaker_id?: string;
          event_name?: string;
          event_year?: number;
          role_at_event?: string;
          created_at?: string;
        };
      };
      sponsors: {
        Row: {
          id: string;
          slug: string;
          name: string;
          logo_url: string | null;
          website_url: string | null;
          short_description: string | null;
          full_description: string | null;
          tier: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          logo_url?: string | null;
          website_url?: string | null;
          short_description?: string | null;
          full_description?: string | null;
          tier: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          logo_url?: string | null;
          website_url?: string | null;
          short_description?: string | null;
          full_description?: string | null;
          tier?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      sponsor_events: {
        Row: {
          id: string;
          sponsor_id: string;
          event_name: string;
          event_year: number;
          tier_at_event: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sponsor_id: string;
          event_name: string;
          event_year?: number;
          tier_at_event: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sponsor_id?: string;
          event_name?: string;
          event_year?: number;
          tier_at_event?: string;
          created_at?: string;
        };
      };
      form_submissions: {
        Row: {
          id: string;
          created_at: string;
          type: string;
          full_name: string;
          email: string;
          company: string;
          job_title: string;
          phone: string | null;
          metadata: Json;
          source_url: string | null;
          source_category: string | null;
          event_name: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          type: string;
          full_name: string;
          email: string;
          company?: string;
          job_title?: string;
          phone?: string | null;
          metadata?: Json;
          source_url?: string | null;
          source_category?: string | null;
          event_name?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          type?: string;
          full_name?: string;
          email?: string;
          company?: string;
          job_title?: string;
          phone?: string | null;
          metadata?: Json;
          source_url?: string | null;
          source_category?: string | null;
          event_name?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Convenience types
export type Speaker = Database["public"]["Tables"]["speakers"]["Row"];
export type SpeakerInsert = Database["public"]["Tables"]["speakers"]["Insert"];
export type SpeakerUpdate = Database["public"]["Tables"]["speakers"]["Update"];

export type SpeakerEvent = Database["public"]["Tables"]["speaker_events"]["Row"];
export type SpeakerEventInsert = Database["public"]["Tables"]["speaker_events"]["Insert"];

export type Sponsor = Database["public"]["Tables"]["sponsors"]["Row"];
export type SponsorInsert = Database["public"]["Tables"]["sponsors"]["Insert"];
export type SponsorUpdate = Database["public"]["Tables"]["sponsors"]["Update"];

export type SponsorEvent = Database["public"]["Tables"]["sponsor_events"]["Row"];
export type SponsorEventInsert = Database["public"]["Tables"]["sponsor_events"]["Insert"];

// Extended types with relations
export type SpeakerWithEvents = Speaker & {
  speaker_events: SpeakerEvent[];
};

export type SponsorWithEvents = Sponsor & {
  sponsor_events: SponsorEvent[];
};

export type FormSubmission = Database["public"]["Tables"]["form_submissions"]["Row"];
export type FormSubmissionInsert = Database["public"]["Tables"]["form_submissions"]["Insert"];

// Backwards-compatible aliases used by other components
export type SpeakerWithSeries = SpeakerWithEvents;
export type SponsorWithSeries = SponsorWithEvents;
export type SeriesSlug = string;
export type SponsorTier = string;
