'use client'
import React, {useEffect, useState} from 'react';
import {createClient} from "@/utils/supabase/client";
import {Diary} from "@/types/diary";
import {Input} from "@/components/ui/input";
import {DateFilter} from "@/components/for-page/gallery/date-filter";
import dayjs from "dayjs";
import Link from "next/link";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import ImageWithLoadingState from "@/components/ui/image-with-loading-state";
import {Skeleton} from "@/components/ui/skeleton";

const ListWithSearch = (props: { initialData: Diary[] | null }) => {
    const [data, setData] = useState<Diary[] | null>(props.initialData)

    return (
        <div className={"space-y-8"}>
            <div className={"mx-auto max-w-[800px] w-full space-y-3"}>
                <div className={"flex space-x-3"}>
                    <Input placeholder={"Search"}/>
                </div>
                <DateFilter/>
            </div>
            <div className={"flex flex-wrap gap-3 justify-center"}>
                {data && data.map(entry => <DiaryEntryCard key={entry.id} diaryEntry={entry}/>)}
            </div>
        </div>
    );
};

function DiaryEntryCard(props: { diaryEntry: Diary }) {
    const [signedUrl, setSignedUrl] = useState<string | undefined>(undefined)
    const supabase = createClient()

    const hasThumbnail = !!props.diaryEntry.thumbnail_path

    useEffect(() => {
        fetchAndSetData()

        async function fetchAndSetData() {
            if (hasThumbnail) {
                const {data} = await supabase.storage.from("thumbnail").createSignedUrl(props.diaryEntry.thumbnail_path!!, 10)
                setSignedUrl(data?.signedUrl)
            }
        }
    }, []);

    const createdAt = dayjs(props.diaryEntry.created_at)

    return (
        <Link href={`/gallery/${props.diaryEntry.id}`}>
            <Card className={"w-96"}>
                <CardHeader>
                    <AspectRatio ratio={16 / 9} className={"rounded-lg overflow-hidden"}>
                        {signedUrl ? (
                            <ImageWithLoadingState src={signedUrl}/>
                        ) : hasThumbnail ? (
                            <Skeleton className={"h-full w-full"}/>
                        ) : (
                            <div className={"h-full flex justify-center items-center"}>
                                <p>No thumbnail found.</p>
                            </div>
                        )}
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

export default ListWithSearch;