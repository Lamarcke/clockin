import React from 'react';
import {DetectMatchResponse} from "../../util/types.ts";
import {AspectRatio, Image, Stack} from "@mantine/core";
import {getUploadedImageURL} from "../../util/image/getUploadedImageURL.ts";

interface Props {
    matchResponse: DetectMatchResponse
}

const DetectedMatchPreview = ({matchResponse}: Props) => {
    return (
        <AspectRatio ratio={9 / 16} w={"100%"}>
            <Image src={getUploadedImageURL(`face_${matchResponse.user_id}.png`)}  />
        </AspectRatio>
    );
};

export default DetectedMatchPreview;
