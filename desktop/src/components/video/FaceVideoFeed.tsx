import React, { useEffect, useRef } from "react";
import { AspectRatio, Box } from "@mantine/core";

interface Props {
    detectionInterval: number;
    detectFaces: (imageDataURL: string) => void | Promise<void>;
}

const FaceVideoFeed = ({ detectFaces, detectionInterval }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleCanvasUpdate = () => {
        if (canvasRef.current && videoRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            ctx?.drawImage(videoRef.current, 0, 0, videoRef.current.width, videoRef.current.height);
        }

        requestAnimationFrame(handleCanvasUpdate);
    };

    useEffect(() => {
        let interval: number | undefined = undefined;
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    facingMode: "user",
                    height: 480,
                    width: 960,
                },
            })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    handleCanvasUpdate();
                    interval = setInterval(() => {
                        const image = canvasRef.current!.toDataURL("image/jpeg");
                        detectFaces(image);
                    }, detectionInterval);
                }
            });

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);

    return (
        <Box w={"100%"}>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <video
                ref={videoRef}
                style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                }}
            ></video>
        </Box>
    );
};

export default FaceVideoFeed;
