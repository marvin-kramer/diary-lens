import React from 'react';
import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";
import {Diary} from "@/types/diary";

function DiaryEntryCard(props: { diaryEntry: Diary }) {
    return (
        <div>
            {new Date(props.diaryEntry.created_at).toDateString()}
        </div>
    );
}

const Page = async () => {

    const supabase = createClient(cookies())

    const {data, error} = await supabase.from('diary').select().order('created_at', {ascending: false})


    return (
        <div>
            {(data as Diary[]).map(entry=> <DiaryEntryCard diaryEntry={entry}/>)}
        </div>
    );
};

export default Page;