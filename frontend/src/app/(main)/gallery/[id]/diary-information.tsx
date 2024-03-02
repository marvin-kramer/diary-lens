'use client'

import React, {useState} from 'react';
import {CardDescription, CardTitle} from "@/components/ui/card";
import DeleteConfirmationDialog from "@/app/(main)/gallery/[id]/delete-confirmation-dialog";
import dayjs from "dayjs";
import {Diary} from "@/types/diary";
import {REALTIME_POSTGRES_CHANGES_LISTEN_EVENT} from "@supabase/realtime-js";
import {createClient} from "@/utils/supabase/client";

const DiaryInformation = ({initialDiaryEntry}: {initialDiaryEntry: Diary}) => {
    const [diaryEntry, setDiaryEntry] = useState(initialDiaryEntry)
    const supabase = createClient()

    supabase.channel("update-listener")
        .on(
            'postgres_changes',
            {event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE, schema: 'public', table: 'diary', filter: `id=eq.${diaryEntry.id}` },
            (payload)=>{
                setDiaryEntry(payload.new as Diary)
            })
        .subscribe()
    
    return (
        <div className={"px-5 py-4"}>
            <div className={"flex justify-between"}>
                <CardTitle>{diaryEntry.title ?? 'loading...'}</CardTitle>
                <DeleteConfirmationDialog diaryId={diaryEntry.id}/>
            </div>
            <CardDescription>{dayjs(diaryEntry.created_at).format("DD.MM.YYYY")}</CardDescription>
            <p className={"mt-6"}>{diaryEntry.transcription ?? 'loading...'}</p>
        </div>
    );
};

export default DiaryInformation;