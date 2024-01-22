import React from 'react';
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

const Page = async ({ params }: { params: { id: string } }) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore)
    const {data} = await supabase.from('diary').select().eq("id", params.id)
    if (!data) return <p>an error happened</p>

    if (data.length === 0 || data.length > 1) {
        return <p>multiple or more than one entries were found</p>
    }

    const user = await supabase.auth.getUser()

    const {data: videoUrl, error} = await supabase.storage.from("video").createSignedUrl(user.data.user?.id+'/'+data[0].video_name, 60 * 20)

    return (
        <div>
            <video controls>
                <source src={videoUrl?.signedUrl} type={data[0].video_type}/>
                {/*<source src="https://www.w3schools.com/Html/mov_bbb.webm" type="video/webm"/>*/}
            </video>
        </div>
    );
};

export default Page;