import React from 'react';
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import {Diary} from "@/types/diary";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {CardDescription, CardTitle} from "@/components/ui/card";
import dayjs from "dayjs";
import DeleteConfirmationDialog from "@/app/(main)/gallery/[id]/delete-confirmation-dialog";

const Page = async ({ params }: { params: { id: string } }) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore)
    const {data: diaryResponse} = await supabase.from('diary').select().eq("id", params.id)

    if (!diaryResponse) return <p>an error happened</p>

    if (diaryResponse.length === 0 || diaryResponse.length > 1) {
        return <p>multiple or more than one entries were found</p>
    }
    const diaryEntryData = diaryResponse[0] as Diary

    const {data: videoUrl} = await supabase.storage.from("video").createSignedUrl(diaryEntryData.video_path, 60 * 20)

    return (
        <div className={"max-w-[1200px] mx-auto p-4"}>
            <AspectRatio ratio={16 / 9} className={"bg-muted rounded-lg overflow-hidden w-full"}>
                {videoUrl ? <video controls className={"h-full w-full"}>
                    <source src={videoUrl.signedUrl}/>
                </video> : <div className={"h-full flex justify-center items-center"}>
                    <p>not-found</p>
                </div>}
            </AspectRatio>
            <div className={"px-5 py-4"}>
                <div className={"flex justify-between"}>
                    <CardTitle>{diaryEntryData.title ?? 'loading...'}</CardTitle>
                    <DeleteConfirmationDialog diaryId={diaryEntryData.id}/>
                </div>
                <CardDescription>{dayjs(diaryEntryData.created_at).format("DD.MM.YYYY")}</CardDescription>
                <p className={"mt-6"}>{diaryEntryData.transcription ?? 'loading...'}</p>
            </div>
        </div>
    );
};

export default Page;