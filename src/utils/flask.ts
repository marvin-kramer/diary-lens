export async function sendVideoToHelper(formData: FormData, diaryId: string, accessToken: string | undefined, refreshToken: string | undefined) {
    await fetch(process.env.FLASK_SERVER_URL + '/convert-mp4-to-mp3?diary-id=' + diaryId, {
        method: 'POST',
        body: formData,
        headers: {
            "access-token": accessToken ?? '',
            "refresh-token": refreshToken ?? ''
        }
    })
}