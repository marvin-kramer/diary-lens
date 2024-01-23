import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {sendVideoToHelper} from "@/utils/flask";
import {Diary} from "@/types/diary";

const ONE_GB = 1073741824

export default function AddNewDiaryEntry({className}: {className?: string}) {

    const handleUpload = async (formData: FormData) => {
        "use server";

        const file = formData.get("file");
        if (!file || !(file instanceof File)) {
            redirect("/gallery?error=No file uploaded")
        } else if (!['video/mp4', 'video/webm'].includes(file.type)) {
            redirect("/gallery?error=Please upload a video")
        } else if (file.size > ONE_GB) {
            redirect("/gallery?error=The video you uploaded is to long.")
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
            redirect(`/gallery?error=File upload failed`)
        }

        const {error: postgresError, data: diaries} = await supabase.from('diary').insert({
            video_path: videoPath,
            video_type: file.type
        }).select()

        const diaryEntry: Diary | null | undefined = (diaries)?.at(0)

        if (postgresError || !diaryEntry) {

            console.log(postgresError)
            redirect("/gallery?error=DB insert failed")
        } else {
            sendVideoToHelper(formData, diaryEntry.id)
            redirect(`/gallery/${diaryEntry.id}?success=File was successfully uploaded`)
        }

    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className={className}>Add Diary</Button>
            </DialogTrigger>

            <DialogContent className="w-[480px]">
                <DialogHeader>
                    <DialogTitle>New Diary Entry</DialogTitle>
                </DialogHeader>
                <form action={handleUpload} id={'form'}>
                    <Input
                        type="file"
                        id="file"
                        name="file"
                    />
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="submit" form={'form'}>Upload File</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}