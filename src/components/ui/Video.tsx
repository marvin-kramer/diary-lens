"use client"
import React, {ReactNode, useState} from 'react';
import {Skeleton} from "@/components/ui/skeleton";
import type {ClassValue} from "clsx";
import {cn} from "@/lib/utils";

const Video = (props: {
    autoPlay?: true;
    children?: ReactNode,
    classNameVideo?: ClassValue[],
    classNameSkeleton?: ClassValue[],
    controls?: true
}) => {
    const [isLoaded, setIsLoaded] = useState(true)

    return (
        <>
            {isLoaded ?
                <video className={cn("object-cover", props.classNameVideo)} onLoad={() => setIsLoaded(true)} controls={props.controls} autoPlay={props.autoPlay}>
                    {props.children}
                </video> :
                <Skeleton className={cn("h-full w-full", props.classNameSkeleton)}/>
            }
        </>
    );
};

export default Video;