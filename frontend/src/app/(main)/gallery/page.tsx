import React from 'react';
import ListWithSearch from "@/app/(main)/gallery/list-with-search";
import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";
import AddNewDiaryEntry from "@/app/(main)/gallery/add-new-diary-entry";

const Page = async () => {
    const supabase = createClient(cookies())

    const {data} = await supabase.from('diary').select().order('created_at', {ascending: false})

    return (
        <div className={"mx-auto max-w-[1200x] px-8 pt-3 space-y-3"}>
            <div className={"flex justify-center"}>
                <AddNewDiaryEntry/>
            </div>
            <ListWithSearch initialData={data}/>
        </div>
    );
};

export default Page;