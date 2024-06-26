export async function sendVideoToHelper(formData: FormData, diaryId: string, accessToken: string | undefined) {
    let url = process.env.NEXT_PUBLIC_FLASK_SERVER_URL + '/convert-mp4-to-mp3?diary-id=' + diaryId;
    console.log("sending request to:", url)
    await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
            "access-token": accessToken ?? '',
        }
    })
}