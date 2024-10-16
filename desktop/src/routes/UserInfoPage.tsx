import React from "react";
import { useParams } from "react-router-dom";
import { useUserInfo } from "../components/user/hooks/useUserInfo.ts";
import { AspectRatio, Box, Flex, Group, Image, Paper, Stack, TextInput, Timeline, Text, Title } from "@mantine/core";
import DetectedMatchPreview from "../components/detection/DetectedMatchPreview.tsx";
import { getUploadedImageURL } from "../util/image/getUploadedImageURL.ts";
import { useUserVerifications } from "../components/user/hooks/useUserVerifications.ts";

const UserInfoPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const userIdAsNumber = parseInt(userId!);
    const userInfo = useUserInfo(userIdAsNumber);
    const userVerifications = useUserVerifications(userIdAsNumber);
    console.log(userVerifications.data);
    return (
        <Stack w={"100%"} h={"100%"}>
            <Paper w={"100%"}>
                <Group align={"start"} mt={"lg"}>
                    <Box w={"20%"}>
                        <AspectRatio ratio={264 / 354} pos="relative" h={"100%"} w={"auto"}>
                            <Image src={getUploadedImageURL(`face_${userIdAsNumber}.png`)} w={"100%"} h={"auto"} />
                        </AspectRatio>
                    </Box>

                    <Stack>
                        <TextInput label={"Name"} value={userInfo.data?.name} disabled></TextInput>
                        <TextInput label={"Identifier"} value={userInfo.data?.identifier} disabled></TextInput>
                    </Stack>
                </Group>
            </Paper>
            <Stack w={"100%"} align={"start"}>
                <Title size={"h4"}>Activity</Title>
                <Timeline active={0} bulletSize={24} lineWidth={2}>
                    <Timeline.Item title={"Face verified"}>
                        <Text c={"dimmed"} fz={"sm"}>
                            Teste
                        </Text>
                    </Timeline.Item>
                    <Timeline.Item title={"Face verified"}>
                        <Text>Teste</Text>
                    </Timeline.Item>
                </Timeline>
            </Stack>
        </Stack>
    );
};

export default UserInfoPage;
