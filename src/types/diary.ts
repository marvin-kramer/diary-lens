export interface Diary {
    created_at: string
    id: string
    title: string | null
    transcription: string | null
    user_id: string
    video_path: string
    video_type: string
}