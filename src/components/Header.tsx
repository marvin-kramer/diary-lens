import React from 'react';
import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const Header = async () => {
    const session = createClient(cookies())
    const {data} = await session.auth.getUser()

    return (
        <div className={"p-3 flex border-b"}>
            <div className={"flex-1"}></div>
            <div className={"flex-1 flex justify-center items-center"}>
                <Link href={"/"} className={"text-2xl"}>DiaryLens</Link>
            </div>
            <div className={"flex-1 flex justify-end items-center"}>
                {data.user ? <p>{data.user.email}</p> : <Link href={'/login'}><Button size={'sm'}>Login</Button></Link>}
            </div>
        </div>
    );
};

export default Header;