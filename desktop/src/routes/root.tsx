import React, { useEffect, useState } from "react";

import { Box, Button, Center, Group, LoadingOverlay, Stack, Text, Title } from "@mantine/core";
import FaceVideoFeed from "../components/video/FaceVideoFeed.tsx";
import { useMutation } from "@tanstack/react-query";
import { base64ToFile } from "../util/image/base64ToFile.ts";
import { API_BASE_PATH } from "../util/constants.ts";
import { blobToBase64 } from "../util/image/blobToBase64.ts";
import DetectedFacePreview from "../components/detection/DetectedFacePreview.tsx";
import DetectedMatchPreview from "../components/detection/DetectedMatchPreview.tsx";
import { notifications } from "@mantine/notifications";
import { useMatchFaceMutation } from "../components/detection/hooks/useMatchFaceMutation.ts";
import { Link } from "react-router-dom";
import DetectedMatchModal from "../components/detection/DetectedMatchModal.tsx";
import { useDisclosure } from "@mantine/hooks";
import { DetectMatchResponse } from "../util/types/detection.ts";

export default function RootPage() {
    const [detectedFaceImage, setDetectedFaceImage] = useState<Blob | undefined>(undefined);
    const [matchResponse, setMatchResponse] = useState<DetectMatchResponse | undefined>(undefined);
    const [matchModalOpened, matchModalUtils] = useDisclosure();

    const matchFaceMutation = useMatchFaceMutation({
        onSuccess: (resp) => {
            console.log("Success on match: ", resp);
            setMatchResponse(resp);
            matchModalUtils.open();
            notifications.show({
                message: "Match found! Please confirm to proceed.",
                color: "green",
            });
        },
        onError: (err) => {
            console.error("Failed to match: ", err);
            setDetectedFaceImage(undefined);
            setMatchResponse(undefined);
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

    const isIdle = detectFacesMutation.isIdle && matchFaceMutation.isIdle;

    const isPending = detectFacesMutation.isPending || matchFaceMutation.isPending;

    const isDetectionPaused = isPending || detectedFaceImage != undefined || matchResponse != undefined;

    return (
        <Stack w={"100%"} mih={"100vh"} align={"start"}>
            <DetectedMatchModal
                matchResponse={matchResponse}
                opened={matchModalOpened}
                onClose={matchModalUtils.close}
                onConfirm={() => {}}
                onCancel={() => {
                    setDetectedFaceImage(undefined);
                    setMatchResponse(undefined);
                }}
            />
            <Group w={"100%"} mt={"xs"} justify={"center"}>
                <Group
                    id={"center-content"}
                    w={{
                        base: "100%",
                        lg: "70%",
                    }}
                    justify={"center"}
                >
                    <Group w={"100%"} justify={"space-between"} align={"center"}>
                        <Title>ClockIn</Title>
                        <Link to={"/admin"}>
                            <Button variant={"white"}>Admin Panel</Button>
                        </Link>
                    </Group>
                    <Group mt={"xs"} w={"100%"} miw={"100%"} pos={"relative"}>
                        <LoadingOverlay visible={matchFaceMutation.isPending} />
                        <FaceVideoFeed
                            isDetectionPaused={isDetectionPaused}
                            detectionInterval={2000}
                            detectFaces={async (dataURL) => {
                                const image = await base64ToFile(dataURL, new Date().toString());
                                detectFacesMutation.mutate(image);
                            }}
                        />
                    </Group>
                    <Stack w={"100%"} align={"center"}>
                        {isIdle && (
                            <Text c={"dimmed"} fz={"sm"}>
                                Waiting...
                            </Text>
                        )}
                        {detectFacesMutation.isPending && (
                            <Text c={"dimmed"} fz={"sm"}>
                                Calculating faces...
                            </Text>
                        )}
                        {matchFaceMutation.isPending && (
                            <Text c={"dimmed"} fz={"sm"}>
                                Matching face. This may take a while...
                            </Text>
                        )}
                    </Stack>
                </Group>
            </Group>
        </Stack>
    );
}
