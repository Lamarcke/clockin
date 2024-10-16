import React from "react";
import { BaseModalProps } from "../../util/types.ts";
import { Box, Button, Divider, Flex, Group, Modal, Stack } from "@mantine/core";
import DetectedFacePreview from "./DetectedFacePreview.tsx";
import DetectedMatchPreview from "./DetectedMatchPreview.tsx";
import { DetectMatchResponse } from "../../util/types/detection.ts";

interface Props extends BaseModalProps {
    matchResponse: DetectMatchResponse | undefined;
    onConfirm: () => void;
    onCancel: () => void;
}

const DetectedMatchModal = ({ matchResponse, onClose, opened, onConfirm, onCancel }: Props) => {
    if (!matchResponse) return null;

    return (
        <Modal
            title={"Confirm match"}
            opened={opened}
            onClose={() => {
                onCancel();
                onClose();
            }}
            size={"lg"}
        >
            <Stack w={"100%"}>
                <Flex w={"100%"} justify={"center"}>
                    <Flex w={"100%"} maw={"90%"} wrap={"wrap"}>
                        <DetectedMatchPreview matchResponse={matchResponse} />
                        <Divider w={"100%"} mt={"md"} />
                    </Flex>
                </Flex>

                <Flex w={"100%"} justify={"center"}>
                    <Group gap={"lg"}>
                        <Button size={"lg"} color={"red"} onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button size={"lg"} color={"green"} onClick={onConfirm}>
                            Confirm
                        </Button>
                    </Group>
                </Flex>
            </Stack>
        </Modal>
    );
};

export default DetectedMatchModal;
