export async function buildUploadPayload(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const contentHash = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, 32);

    return {
        contentHash,
        body: new Blob([arrayBuffer], { type: file.type }),
    };
}
