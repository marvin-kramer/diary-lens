import {NextRequest} from "next/server";
import ffmpeg from 'fluent-ffmpeg'

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file !== 'object') {
        return new Response("File is missing from the request", { status: 400 });
    }

    // Convert MP4 to MP3 using fluent-ffmpeg
    const mp3Buffer = await convertMp4ToMp3(file);

    // Assuming you have a setup to use Whisper API for transcription
    const transcript = await transcribeWithWhisper(mp3Buffer);

    return new Response(transcript, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
    });
}

function convertMp4ToMp3(file: File) {
    return new Promise((resolve, reject) => {
        const chunks = [];

        ffmpeg(file.stream())
            .format('mp3')
            .on('error', (err) => reject(err))
            .on('data', (chunk) => chunks.push(chunk))
            .on('end', () => resolve(Buffer.concat(chunks)))
            .pipe();
    });
}

async function transcribeWithWhisper(mp3Buffer) {
    // Placeholder function for transcribing MP3 with Whisper
    // Replace this with your actual implementation to send the MP3 buffer to Whisper and receive the transcription
    return "Transcribed text";
}
