import React from "react";
import { AspectRatio, Box, Group, Image, Stack, Text, TextInput, Title } from "@mantine/core";
import { getUploadedImageURL } from "../../util/image/getUploadedImageURL.ts";
import { useUserInfo } from "../user/hooks/useUserInfo.ts";
import { DetectMatchResponse } from "../../util/types/detection.ts";

interface Props {
    matchResponse: DetectMatchResponse;
}

const DetectedMatchPreview = ({ matchResponse }: Props) => {
    const userInfo = useUserInfo(matchResponse.user_id);

    console.log(userInfo.data);

    return (
        <Group w={"100%"} align={"start"}>
            <Box w={"50%"}>
                <AspectRatio ratio={264 / 354} pos="relative" h={"100%"} w={"auto"}>
                    <Image src={getUploadedImageURL(`face_${matchResponse.user_id}.png`)} w={"100%"} h={"auto"} />
                </AspectRatio>
            </Box>

            <Stack>
                <TextInput label={"Name"} value={userInfo.data?.name} disabled></TextInput>
                <TextInput label={"Identifier"} value={userInfo.data?.identifier} disabled></TextInput>
            </Stack>
        </Group>
    );
};

export default DetectedMatchPreview;
