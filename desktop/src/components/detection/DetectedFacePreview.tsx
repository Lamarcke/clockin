import React, { useEffect, useRef, useState } from "react";
import CenteredLoading from "../general/CenteredLoading.tsx";
import { blobToBase64 } from "../../util/image/blobToBase64.ts";
import { AspectRatio, Box, Image } from "@mantine/core";

interface Props {
    detectedFace: Blob;
}

const DetectedFacePreview = ({ detectedFace }: Props) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [imageDataURL, setImageDataURL] = useState<string | undefined>(undefined);

    useEffect(() => {
        blobToBase64(detectedFace).then((dataURL) => {
            setImageDataURL(dataURL);
        });
    }, [detectedFace]);

    if (!imageDataURL) {
        return <CenteredLoading />;
    }

    return (
        <AspectRatio ratio={16 / 9} w={"100%"}>
            <img src={imageDataURL} ref={imgRef} style={{}} />
        </AspectRatio>
    );
};

export default DetectedFacePreview;
