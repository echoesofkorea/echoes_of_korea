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
      interviews: {
        Row: {
          id: string
          created_at: string
          interviewee_name: string
          interviewee_birth_year: number | null
          interview_date: string | null
          title: string
          audio_file_path: string | null
          is_published: boolean
          stt_status: 'not_started' | 'processing' | 'completed' | 'failed'
          full_transcript: string | null
          llm_summary: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          interviewee_name: string
          interviewee_birth_year?: number | null
          interview_date?: string | null
          title: string
          audio_file_path?: string | null
          is_published?: boolean
          stt_status?: 'not_started' | 'processing' | 'completed' | 'failed'
          full_transcript?: string | null
          llm_summary?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          interviewee_name?: string
          interviewee_birth_year?: number | null
          interview_date?: string | null
          title?: string
          audio_file_path?: string | null
          is_published?: boolean
          stt_status?: 'not_started' | 'processing' | 'completed' | 'failed'
          full_transcript?: string | null
          llm_summary?: string | null
        }
      }
    }
  }
}