from moviepy.editor import AudioFileClip
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()


def transcribe_audio(mp4_name, upload_dir: str) -> str:
    mp4_path = os.path.join(upload_dir, mp4_name)
    clip = AudioFileClip(mp4_path)
    mp3_filename = os.path.splitext(mp4_name)[0] + '.mp3'
    mp3_path = os.path.join(upload_dir, mp3_filename)
    clip.write_audiofile(mp3_path)

    audio_file = open(mp3_path, "rb")
    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file
    ).text

    os.remove(mp3_path)
    return transcript


def generate_diary_title(transcription: str) -> str:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": "Your job is to create a short title for a provided diary entry. "
                                                "Don't take any date declarations into the Title."},
                  {"role": "user", "content": transcription}]
    )
    return response.choices[0].message.content
