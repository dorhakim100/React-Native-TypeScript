export const uploadService = {
  uploadImg,
}

async function uploadImg(fileUri: string): Promise<any> {
  const CLOUD_NAME = 'dnxi70mfs'
  const UPLOAD_PRESET = 'SportClub'
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

  const formData = new FormData()

  // Building the request body
  formData.append('file', {
    uri: fileUri,
    name: 'upload.jpg', // Placeholder name, actual name would be extracted from file picker
    type: 'image/jpeg', // Placeholder type, actual type would be extracted
  } as any)
  formData.append('upload_preset', UPLOAD_PRESET)

  // Sending a post method request to Cloudinary API
  try {
    const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData })
    const imgData = await res.json()
    return imgData
  } catch (err) {
    console.error(err)
    throw err
  }
}
