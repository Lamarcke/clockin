import React, { useEffect, useRef } from "react";
import {AspectRatio, Box, Center} from "@mantine/core";

interface Props {
    isDetectionPaused: boolean;
    detectionInterval: number;
    detectFaces: (imageDataURL: string) => void | Promise<void>;
}

const FaceVideoFeed = ({ isDetectionPaused, detectFaces, detectionInterval }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleCanvasUpdate = () => {
        if (videoRef.current && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            ctx?.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        }

        requestAnimationFrame(handleCanvasUpdate);
    };

    const handleDetectFaces = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const image = canvasRef.current.toDataURL("image/jpeg");

        detectFaces(image);
    };

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    facingMode: "user",
                    height: 640,
                    width: 960,
                },
            })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    handleCanvasUpdate();
                }
            });
    }, []);

    useEffect(() => {
        const interval: number | undefined = setInterval(() => {
            if (isDetectionPaused) return;
            handleDetectFaces();
        }, detectionInterval);

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isDetectionPaused]);

    return (
        <Center w={"100%"}>
            <canvas ref={canvasRef} height={960} width={1280} style={{ display: "none" }}></canvas>
            <video
                ref={videoRef}
                autoPlay
                style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                }}
            />
        </Center>
    );
};

export default FaceVideoFeed;
