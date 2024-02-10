'use client'

import React, {useState} from 'react';
import {CardDescription, CardTitle} from "@/components/ui/card";
import DeleteConfirmationDialog from "@/app/(main)/gallery/[id]/delete-confirmation-dialog";
import dayjs from "dayjs";
import {Diary} from "@/types/diary";
import {REALTIME_POSTGRES_CHANGES_LISTEN_EVENT} from "@supabase/realtime-js";
import {createClient} from "@/utils/supabase/client";
import {Badge} from "@/components/ui/badge";

const DiaryInformation = ({initialDiaryEntry}: {initialDiaryEntry: Diary}) => {
    const [diaryEntry, setDiaryEntry] = useState(initialDiaryEntry)
    const supabase = createClient()

    supabase.channel("update-listener")
        .on(
            'postgres_changes',
            {event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE, schema: 'public', table: 'diary', filter: `id=eq.${diaryEntry.id}` },
            (payload)=>{
                setDiaryEntry(prevState => {
                    return {
                        ...payload.new,
                        tags: prevState.tags
                    } as Diary
                })
            })
        .subscribe()
    
    return (
        <div className={"px-5 py-4 space-y-3"}>
            <div className={"flex justify-between"}>
                <div className={"space-y-1"}>
                    <CardTitle>{diaryEntry.title ?? 'loading...'}</CardTitle>
                    <CardDescription>{dayjs(diaryEntry.created_at).format("DD.MM.YYYY")}</CardDescription>
                </div>
                <DeleteConfirmationDialog diaryId={diaryEntry.id} className={"row-span-2 w-fit"}/>
            </div>
            <div className={"flex gap-2"}>
                {diaryEntry.tags.map(tag => (
                    <Badge id={tag.id} key={tag.id}>{tag.name}</Badge>
                ))}
            </div>
            <p className={""}>{diaryEntry.transcription ?? 'loading...'}</p>
        </div>
    );
};

export default DiaryInformation;