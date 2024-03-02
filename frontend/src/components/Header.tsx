import React from 'react';
import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Profile} from "@/types/profile";

const Header = async () => {
    const supabase = createClient(cookies())
    const {data: userData} = await supabase.auth.getUser()
    const {data: profileData} = await supabase.from('profile').select().eq("user_id", userData.user?.id)
    const profile = profileData?.at(0) as Profile | null

    return (
        <div className={"p-3 flex border-b"}>
            <div className={"flex-1"}></div>
            <div className={"flex-1 flex justify-center items-center"}>
                <Link href={"/"} className={"text-2xl"}>DiaryLens</Link>
            </div>
            <div className={"flex-1 flex justify-end items-center"}>
                {profile ? (
                    <p>{profile.first_name}</p>
                ) : (
                    <Link href={'/login'}>
                        <Button size={'sm'}>Login</Button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Header;