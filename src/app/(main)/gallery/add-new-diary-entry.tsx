"use client"
import {createClient} from "@/utils/supabase/client";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {sendVideoToHelper} from "@/utils/flask";
import {Diary} from "@/types/diary";
import {FormEvent, useState} from "react";
import {useToast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";

const ONE_GB = 1073741824

export default function AddNewDiaryEntry({className}: {className?: string}) {
    const {toast} = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const submitHandler = async (target:  FormEvent<HTMLFormElement>) => {
        target.preventDefault()

        const formData = new FormData(target.currentTarget)

        const file = formData.get("file");
        console.log(file)
        if (!file || !(file instanceof File)) {
            toast({
                variant: "destructive",
                title: "No file selected",
                description: "Please select a file."
            })
            return
        } else if (!['video/mp4', 'video/webm'].includes(file.type)) {
            toast({
                variant: "destructive",
                title: "Wrong filetype",
                description: "Please select a mp4 or webm file."
            })
            return
        } else if (file.size > ONE_GB) {
            toast({
                variant: "destructive",
                title: "File to big",
                description: "The file has to be smaller than 1GB."
            })
            return
        }

        setIsOpen(false)

        const supabase = createClient();
        const user = await supabase.auth.getUser()
        const session = await supabase.auth.getSession()

        const fileName = new Date().toISOString() + '-' + file.name

        const videoPath = `${user.data.user?.id}/${fileName}`;
        const {error: storageError, data: uploadData} = await supabase.storage
            .from('video')
            .upload(videoPath, file);

        if (storageError || !uploadData) {
            console.log(storageError)
            toast({
                variant: "destructive",
                title: "Upload error",
                description: "The file could not be uploaded to the server. Please try again later."
            })
            return
        }

        const {error: postgresError, data: diaries} = await supabase.from('diary').insert({
            video_path: videoPath,
            video_type: file.type
        }).select()

        const diaryEntry: Diary | null | undefined = (diaries)?.at(0)

        if (postgresError || !diaryEntry) {
            toast({
                variant: "destructive",
                title: "Error while creating",
                description: "An error occurred while creating the diary entry."
            })
        } else {
            sendVideoToHelper(formData, diaryEntry.id, session.data.session?.access_token, session.data.session?.refresh_token)
            router.push(`/gallery/${diaryEntry.id}`)
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className={className}>Add Diary</Button>
            </DialogTrigger>

            <DialogContent className="w-[480px]">
                <DialogHeader>
                    <DialogTitle>New Diary Entry</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler} id={'form'}>
                    <Input
                        type="file"
                        id="file"
                        name="file"
                    />
                </form>
                <DialogFooter>
                    <Button type="submit" form={'form'}>Upload File</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}