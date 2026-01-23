import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { buildUploadPayload } from '@/lib/utils/blobUpload';

interface UseImageUploadOptions {
    folder?: string;
    onSuccess?: (url: string) => void;
    onError?: (error: Error) => void;
}

interface UseImageUploadReturn {
    uploading: boolean;
    upload: (file: File) => Promise<string | null>;
}

export function useImageUpload(
    options: UseImageUploadOptions = {}
): UseImageUploadReturn {
    const { folder, onSuccess, onError } = options;
    const [uploading, setUploading] = useState(false);

    const upload = useCallback(
        async (file: File): Promise<string | null> => {
            setUploading(true);
            try {
                const { contentHash, body } = await buildUploadPayload(file);

                const params = new URLSearchParams({
                    filename: file.name,
                    contentHash,
                });
                if (folder) {
                    params.set('folder', folder);
                }

                const response = await fetch(`/api/upload?${params.toString()}`, {
                    method: 'POST',
                    body,
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Upload failed');
                }

                const data = await response.json();
                const url = data.url as string;

                onSuccess?.(url);
                return url;
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Upload failed');
                toast.error(error.message);
                onError?.(error);
                return null;
            } finally {
                setUploading(false);
            }
        },
        [folder, onSuccess, onError]
    );

    return { uploading, upload };
}
