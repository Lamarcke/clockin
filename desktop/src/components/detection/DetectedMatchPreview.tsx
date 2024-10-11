import React from 'react';
import {DetectMatchResponse} from "../../util/types.ts";
import {Image, Stack} from "@mantine/core";
import {getUploadedImageURL} from "../../util/image/getUploadedImageURL.ts";

interface Props {
    matchResponse: DetectMatchResponse
}

const DetectedMatchPreview = ({matchResponse}: Props) => {
    return (
        <Stack w={"100%"}>
            <Image src={getUploadedImageURL(`face_${matchResponse.user_id}.png`)}  />

        </Stack>
    );
};

export default DetectedMatchPreview;
