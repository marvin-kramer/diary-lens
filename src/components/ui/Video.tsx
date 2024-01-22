"use client"
import React, {ReactNode, useState} from 'react';
import {Skeleton} from "@/components/ui/skeleton";
import {cn} from "@/lib/utils";

const Video = (props: {
    autoPlay?: true;
    children?: ReactNode,
    className?: string,
    controls?: true
}) => {
    const [isLoaded, setIsLoaded] = useState(true)

    return (
        <>
            {isLoaded ?
                <video className={cn("object-cover", props.className)} onLoad={() => setIsLoaded(true)} controls={props.controls} autoPlay={props.autoPlay}>
                    {props.children}
                </video> :
                <Skeleton className={cn("h-full w-full", props.className)}/>
            }
        </>
    );
};

export default Video;