import { useState, useCallback } from "react";
import { uploadFileToS3 } from "@/lib/s3Upload";
import type { S3UploadResponse } from "@/lib/s3Upload";

interface UseS3UploadReturn {
  uploadFile: (file: File, folder?: string) => Promise<S3UploadResponse>;
  isUploading: boolean;

  error: string | null;
  clearError: () => void;
}

export const useS3Upload = (): UseS3UploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (
      file: File,
      folder: string = "tool-avatars"
    ): Promise<S3UploadResponse> => {
      try {
        setIsUploading(true);
        setError(null);

        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error("Please select a valid image file");
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("File size must be less than 5MB");
        }

        const result = await uploadFileToS3(file, folder);
        return result;
      } catch (err) {
        console.log(err);
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadFile,
    isUploading,
    error,
    clearError,
  };
};
