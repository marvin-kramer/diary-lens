from datetime import datetime

from supabase import Client


def update_transcription(supabase: Client, transcription: str, diary_id: str):
    supabase.table("diary").update({"transcription": transcription}).eq("id", diary_id).execute()


def update_title(supabase: Client, title: str, diary_id: str):
    supabase.table("diary").update({"title": title}).eq("id", diary_id).execute()


def upload_jpg(supabase: Client, access_token, jpg_path, jpg_name, diary_id: str):
    user = supabase.auth.get_user(access_token)
    supabase_file_path = f"{user.user.id}/{datetime.now()}-{jpg_name}"
    with open(jpg_path, 'rb') as file:
        supabase.storage.from_("thumbnail").upload(
            file=file,
            path=supabase_file_path,
            file_options={"content-type": "image/jpeg"}
        )
    supabase.table("diary").update({"thumbnail_path": supabase_file_path}).eq("id", diary_id).execute()
