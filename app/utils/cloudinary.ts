import { v2 as cloudinary } from 'cloudinary'
export async function uploadImageToCloudinary(imageBase64: string, options?: any): Promise<any> {
    const buffer = Buffer.from(imageBase64, 'base64');
    const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(options || {
            resource_type: 'auto',
        }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
        uploadStream.end(buffer);
    });
    return result;
}
