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
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'swad-anusar/dishes',
        public_id: `${dishName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
        transformation: [
          { width: 800, height: 600, crop: 'fill', quality: 'auto', fetch_format: 'auto' }
        ],
      },
      (error, result) => {
        if (error || !result) return reject(error)
        resolve({ url: result.secure_url, publicId: result.public_id })
      }
    ).end(file)
  })
}

export async function deleteDishImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId)
}

export async function uploadRestaurantLogo(file: Buffer) {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
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
    ).end(file)
  })
}
