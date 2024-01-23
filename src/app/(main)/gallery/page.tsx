import React from 'react';
import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";
import {Diary} from "@/types/diary";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import Link from "next/link";
import Video from "@/components/ui/Video";
import dayjs from "dayjs";
import {Input} from "@/components/ui/input";
import {DateFilter} from "@/components/for-page/gallery/date-filter";
import {Button} from "@/components/ui/button";
import AddNewDiaryEntry from "@/app/(main)/gallery/new-diary-entry";

const Page = async ({searchParams}: {
    searchParams: { message: string };
}) => {

    const supabase = createClient(cookies())

    const {data} = await supabase.from('diary').select().order('created_at', {ascending: false})

    return (
        <div className={"mx-auto max-w-[1200x] p-8 space-y-8"}>
            <div className={"mx-auto max-w-[800px] w-full space-y-3"}>
                <div className={"flex space-x-3"}>
                    <Input placeholder={"Search"}/>
                    <AddNewDiaryEntry message={searchParams.message}/>
                </div>
                <DateFilter/>
            </div>
            <div className={"flex flex-wrap gap-3 justify-center"}>
                {(data as Diary[]).map(entry => <DiaryEntryCard key={entry.id} diaryEntry={entry}/>)}
            </div>
        </div>
    );
};

async function DiaryEntryCard(props: { diaryEntry: Diary }) {
    const supabase = createClient(cookies())
    const {data} = await supabase.storage.from("video").createSignedUrl(props.diaryEntry.video_path, 10)
    const createdAt = dayjs(props.diaryEntry.created_at)
    return (
        <Link href={`/gallery/${props.diaryEntry.id}`}>
            <Card className={"w-96"}>
                <CardHeader>
                    <AspectRatio ratio={16 / 9} className={"bg-muted rounded-lg overflow-hidden"}>
                        {data ? <Video>
                            <source src={data.signedUrl}/>
                        </Video> : <div className={"h-full flex justify-center items-center"}>
                            <p>not-found</p>
                        </div>}
                    </AspectRatio>
                </CardHeader>
                <CardContent>
                    <CardTitle>{props.diaryEntry.title ?? 'loading...'}</CardTitle>
                    <CardDescription>
                        {createdAt.format('DD.MM.YYYY')}
                    </CardDescription>
                </CardContent>
            </Card>
        </Link>
    );
}

export default Page;