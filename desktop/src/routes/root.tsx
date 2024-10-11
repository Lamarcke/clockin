import React, {useEffect, useState} from "react";

import {Box, Center, Group, LoadingOverlay, Stack, Title} from "@mantine/core";
import FaceVideoFeed from "../components/video/FaceVideoFeed.tsx";
import {useMutation} from "@tanstack/react-query";
import {base64ToFile} from "../util/image/base64ToFile.ts";
import {API_BASE_PATH} from "../util/constants.ts";
import {blobToBase64} from "../util/image/blobToBase64.ts";
import DetectedFacePreview from "../components/detection/DetectedFacePreview.tsx";
import {DetectMatchResponse} from "../util/types.ts";
import DetectedMatchPreview from "../components/detection/DetectedMatchPreview.tsx";
import {notifications} from "@mantine/notifications";
import {useMatchFaceMutation} from "../components/detection/hooks/useMatchFaceMutation.ts";

export default function RootPage() {
    const [detectedFaceImage, setDetectedFaceImage] = useState<Blob | undefined>(undefined);
    const [matchResponse, setMatchResponse] = useState<DetectMatchResponse | undefined>(undefined);

    const matchFaceMutation = useMatchFaceMutation({
        onSuccess: (resp) => {
            console.log("Success on match: ", resp)
            setMatchResponse(resp)
            notifications.show({
                message: "Match found! Please confirm to proceed.",
                color: "green",
            })
        },
        onError: (err) => {
            console.error("Failed to match: ", err)
            setDetectedFaceImage(undefined)
            setMatchResponse(undefined)
        }
    });

    const detectFacesMutation = useMutation({
        mutationFn: async (image: File) => {
            console.log("Starting mutation!");
            const formData = new FormData();
            formData.append("picture", image);

            const req = await fetch(`${API_BASE_PATH}/detection/detect`, {
                method: "POST",
                body: formData,
            });

            const blob = await req.blob();

            return blob;
        },
        onSuccess: (image) => {
            setDetectedFaceImage(image);
            matchFaceMutation.mutate(image);
        },
        onError: (err) => {
            console.error(err);
        },
    });

    const isIdle = detectFacesMutation.isIdle;

    const isPending = detectFacesMutation.isPending || matchFaceMutation.isPending;

    const isDetectionPaused = isPending || detectedFaceImage != undefined || matchResponse != undefined;

    return (
        <Stack w={"100%"} mih={"100vh"} align={"start"}>

            <Group mt={"xs"} wrap={"nowrap"} w={"100%"} align={"start"}>
                <Group miw={"50%"} w={"50%"} pos={"relative"}>
                    <LoadingOverlay visible={matchFaceMutation.isPending} />
                    <FaceVideoFeed
                        isDetectionPaused={isDetectionPaused}
                        detectionInterval={1000}
                        detectFaces={async (dataURL) => {
                            const image = await base64ToFile(dataURL, new Date().toString());
                            detectFacesMutation.mutate(image);
                        }}
                    />
                </Group>
                <Stack mih={"100%"} miw={"35%"} p={"md"} w={"100%"} me={"sm"} style={{
                    borderColor: "darkgray",
                    borderWidth: "2px",
                    borderRadius: "5px",
                    borderStyle: "solid"
                }}>
                    {matchResponse && <Box h={"auto"} w={"15vw"} ><DetectedMatchPreview matchResponse={matchResponse}/></Box> }
                </Stack>

            </Group>
            {detectFacesMutation.isPending && <Title mt={"md"}>Calculating faces...</Title>}
            {matchFaceMutation.isPending && <Title mt={"md"}>Matching face... this may take a while.</Title>}
        </Stack>
    );
}
