export async function sendVideoToHelper(formData: FormData, diaryId: string) {
    await fetch(process.env.FLASK_SERVER_URL + '/convert-mp4-to-mp3?diary-id=' + diaryId, {
        method: 'POST',
        body: formData
    })
}