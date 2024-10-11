import React, { useEffect, useState } from "react";

import { Box, Center, Group, Stack, Title } from "@mantine/core";
import FaceVideoFeed from "../components/video/FaceVideoFeed.tsx";
import { useMutation } from "@tanstack/react-query";
import { base64ToFile } from "../util/image/base64ToFile.ts";
import { API_BASE_PATH } from "../util/constants.ts";
import { blobToBase64 } from "../util/image/blobToBase64.ts";
import DetectedFacePreview from "../components/detection/DetectedFacePreview.tsx";

export default function RootPage() {
    const [detectedFaceImage, setDetectedFaceImage] = useState<Blob | undefined>(undefined);
    const [matchedFaceImage, setMatchedFaceImage] = useState<Blob | undefined>(undefined);

    const matchFaceMutation = useMutation({
        mutationFn: async (image: Blob) => {
            const formData = new FormData();
            formData.append("picture", image);

            const req = await fetch(`${API_BASE_PATH}/detection/match`, {
                method: "POST",
                body: formData,
            });

            const json = await req.json();
            console.log(json);

            return image;
        },
        onSuccess: (image) => {
            setMatchedFaceImage(image);
        },
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

    const isDetectionPaused = isPending || detectedFaceImage != undefined || matchedFaceImage != undefined;

    return (
        <Stack w={"100%"} mih={"100vh"}>
            <Center>
                <Title>ClockIn</Title>
            </Center>
            <Group mt={"md"} wrap={"nowrap"}>
                <Group w={"60%"} maw={960} mah={480}>
                    {detectedFaceImage ? (
                        <DetectedFacePreview detectedFace={detectedFaceImage} />
                    ) : (
                        <FaceVideoFeed
                            isDetectionPaused={isDetectionPaused}
                            detectionInterval={3000}
                            detectFaces={async (dataURL) => {
                                const image = await base64ToFile(dataURL, new Date().toString());
                                detectFacesMutation.mutate(image);
                            }}
                        />
                    )}
                </Group>
            </Group>
            {isIdle && <Title mt={"md"}>Waiting...</Title>}
            {detectFacesMutation.isPending && <Title mt={"md"}>Detecting faces...</Title>}
            {matchFaceMutation.isPending && <Title mt={"md"}>Matching face... this may take a while.</Title>}
        </Stack>
    );
}
