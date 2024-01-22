export interface Diary {
    created_at: string
    id: number
    title: string | null
    transcription: string | null
    user_id: string
    video_name: string
    video_type: string
}