import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

const ONE_GB = 1073741824

export default function FileUpload({searchParams}: {
    searchParams: { message: string };
}) {

    const handleUpload = async (formData: FormData) => {
        "use server";

        const file = formData.get("file");
        if (!file || !(file instanceof File)) {
            redirect("/file?message=No file uploaded")
        } else if (!['video/mp4', 'video/webm'].includes(file.type)) {
            redirect("/upload?message=Please upload a video")
        } else if (file.size > ONE_GB) {
            redirect("/upload?message=The video you uploaded is to long.")
        }

        const cookieStore = cookies();
        const supabase = createClient(cookieStore);
        const user = await supabase.auth.getUser()

        const fileName = new Date().toISOString() + '-' + file.name

        const videoPath = `${user.data.user?.id}/${fileName}`;
        const {error: storageError, data: uploadData} = await supabase.storage
            .from('video')
            .upload(videoPath, file);

        if (storageError || !uploadData) {
            console.log(storageError)
            redirect(`/upload?message=File upload failed (${storageError?.message})`)
        }

        const {error: postgresError} = await supabase.from('diary').insert({video_path: videoPath, video_type: file.type})

        if (postgresError) {
            console.log(postgresError)
            redirect("/upload?message=DB insert failed")
        } else {
            redirect("/gallery")
        }

    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900 w-full">
            <div className="p-6 max-w-sm w-full bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
                <form action={handleUpload} className="flex flex-col space-y-4">
                    <input
                        type="file"
                        name="file"
                        required
                        className="block w-full text-sm text-gray-300
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0
                           file:text-sm file:font-medium
                           file:bg-gray-700 file:text-gray-200
                           hover:file:bg-gray-600 transition duration-200"
                    />
                    <button
                        type="submit"
                        className="text-gray-900 bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-200"
                    >
                        Upload File
                    </button>
                </form>
                {searchParams.message &&
                    <p className="mt-4 text-sm text-gray-300">{searchParams.message}</p>
                }
            </div>
        </div>
    );
}


// function generateThumbnail(videoFile: File): Promise<Buffer> {
//     return new Promise((resolve, reject) => {
//         ffmpeg(videoFile.path)
//             .screenshots({
//                 timestamps: ['1%'],
//                 filename: 'thumbnail.jpg',
//                 folder: '/tmp',
//                 size: '320x240'
//             })
//             .on('end', () => {
//                 fs.readFile('/tmp/thumbnail.jpg', (err, data) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(data);
//                     }
//                 });
//             })
//             .on('error', (err) => {
//                 reject(err);
//             });
//     });
// }
