import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Cloudinary environment variables are missing!', {
    cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
    api_key: !!process.env.CLOUDINARY_API_KEY,
    api_secret: !!process.env.CLOUDINARY_API_SECRET,
  })
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadDishImage(file: Buffer, dishName: string) {
  // Diagnostic log for env vars (masked)
  console.log('--- Cloudinary Config Debug ---');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || 'MISSING');
  console.log('API Key:', process.env.CLOUDINARY_API_KEY ? `${process.env.CLOUDINARY_API_KEY.slice(0, 4)}***` : 'MISSING');
  console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? `***${process.env.CLOUDINARY_API_SECRET.slice(-4)}` : 'MISSING');
  
  // Ensure config is applied
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  // Check if config took
  const config = cloudinary.config();
  if (!config.api_key) {
    console.error('❌ Cloudinary Config Failed: api_key is still missing after explicit set.');
    throw new Error('Cloudinary configuration failed: api_key missing');
  }
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'swad-anusar/dishes',
        public_id: `${dishName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
        transformation: [
          { width: 800, height: 600, crop: 'fill', quality: 'auto', fetch_format: 'auto' }
        ],
      },
      (error, result) => {
        if (error || !result) {
            console.error('Cloudinary Stream Error:', error);
            return reject(error || new Error('Upload failed'));
        }
        resolve({ url: result.secure_url, publicId: result.public_id })
      }
    );
    uploadStream.end(file);
  })
}

export async function deleteDishImage(publicId: string) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  return cloudinary.uploader.destroy(publicId)
}

export async function uploadRestaurantLogo(file: Buffer) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'swad-anusar/branding',
        public_id: 'restaurant-logo',
        overwrite: true,
        transformation: [
          { width: 400, height: 400, crop: 'fill', quality: 'auto', fetch_format: 'auto' }
        ],
      },
      (error, result) => {
        if (error || !result) return reject(error)
        resolve({ url: result.secure_url, publicId: result.public_id })
      }
    );
    uploadStream.end(file);
  })
}
