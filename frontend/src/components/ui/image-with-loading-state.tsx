import React, {useEffect, useState} from 'react';
import {Skeleton} from "@/components/ui/skeleton";

const ImageWithLoadingState = ({src}: {src: string}) => {
    const [imageLoaded, setImageLoaded] = useState(false)

    useEffect(() => {
        const img = new Image()
        img.onload = () => {
            setImageLoaded(true)
        }
        img.src = src
    }, [src]);

    return (
        <>
            {imageLoaded ? (
                <img src={src} className={"object-cover"} alt={'diary video thumbnail'}/>
            ): (
                <Skeleton className={"h-full w-full"} />
            )}
        </>
    );
};

export default ImageWithLoadingState;