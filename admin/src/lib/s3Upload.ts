import { apiClient } from "./apiClient";


const BUCKET_NAME = import.meta.env.VITE_S3_BUCKET;

export interface S3UploadResponse {
  url: string;
  key: string;
}

export const uploadFileToS3 = async (file: File, folder: string = 'tool-avatars'): Promise<S3UploadResponse> => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${folder}/${timestamp}-${randomString}.${fileExtension}`;

    // Get presigned URL from backend
    const response = await apiClient.post('/aws/presigned-url', {
      imageName: fileName,
    });


    const { presignedUrl, key } = response.data;


    // Upload directly to S3 using presigned URL
    console.log('Uploading to presigned URL:', presignedUrl);
    console.log('File type:', file.type);
    console.log('File size:', file.size);


    
    
    const uploadResponse = await fetch(presignedUrl.presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
        'x-amz-acl': 'public-read' 
      },
    });

    console.log('Upload response status:', uploadResponse.status);

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Upload error response:', errorText);
      throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }


    const url = `${import.meta.env.VITE_S3_ENDPOINT}/${BUCKET_NAME}/${presignedUrl.key}`;
    
    console.log('Final URL:', url);
    console.log('Key:', key);

    return {
      url,
      key,
    };
  } catch (error) {
    console.log( error);
    throw new Error('Failed to upload file to S3');
  }
};
