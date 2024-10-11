export async function base64ToFile(base64DataURL: string, fileName: string) {
    const res: Response = await fetch(base64DataURL);

    const blob: Blob = await res.blob();

    return new File([blob], fileName, { type: "image/png" });
}
