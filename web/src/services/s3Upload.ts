import { api } from "./api";


const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET;

export interface S3UploadResponse {
  url: string;
  key: string;
}

type PresignType = { presignedUrl: string; key: string };
type PresignResponse = { presignedUrl: PresignType };

export const uploadFileToS3 = async (file: File, folder: string = 'tool-avatars'): Promise<S3UploadResponse> => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${folder}/${timestamp}-${randomString}.${fileExtension}`;

    // Get presigned URL from backend
    const response = await api.post<PresignResponse>('/aws/presigned-url', {
      imageName: fileName,
    });

    const { presignedUrl, key } = response.presignedUrl;
    
    
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
        'x-amz-acl': 'public-read' 
      },
    });


    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Upload error response:', errorText);
      throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }


    const url = `${process.env.NEXT_PUBLIC_S3_ENDPOINT}/${BUCKET_NAME}/${key}`;

    return {
      url,
      key,
    };
  } catch (error) {
    console.log( error);
    throw new Error('Failed to upload file to S3');
  }
};
