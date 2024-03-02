from flask import Flask, request
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os
from supabase import create_client, Client
from supabase_helper import update_transcription, upload_jpg, update_title
from openai_helper import transcribe_audio, generate_diary_title
from mp4_to_jpg import mp4_to_jpg
from dotenv import load_dotenv

UPLOAD_FOLDER = 'uploads/'

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create the upload directory if it does not exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])


@app.route('/convert-mp4-to-mp3', methods=['POST'])
def convert_to_mp3():
    diary_id = request.args.get("diary-id")
    access_token = request.headers.get("access-token")

    if diary_id is None or diary_id == '':
        return 'diary-id is not set'

    if access_token is None or access_token == '':
        return 'access-token is not set'

    if 'file' not in request.files:
        return 'No file part'

    file = request.files['file']
    if file.filename == '':
        return 'No selected file'

    supabase: Client = create_client(url, access_token)

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        jpg_path, jpq_name = mp4_to_jpg(filename, UPLOAD_FOLDER)
        upload_jpg(supabase, access_token, jpg_path, jpq_name, diary_id)
        os.remove(jpg_path)

        transcript = transcribe_audio(filename, UPLOAD_FOLDER)
        # transcript = "Some transcription from your Video"
        update_transcription(supabase, transcript, diary_id)

        title = generate_diary_title(transcript)
        update_title(supabase, title, diary_id)

        os.remove(file_path)

        return 'File converted successfully'


if __name__ == '__main__':
    app.run(debug=True)
