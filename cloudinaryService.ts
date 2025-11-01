/**
 * Uploads a file to Cloudinary.
 * @param file The file to upload.
 * @returns A promise that resolves with the secure URL of the uploaded file and a thumbnail URL.
 */
export const uploadToCloudinary = async (file: File): Promise<{ url: string; thumbnailUrl?: string }> => {
  // IMPORTANT: Replace with your Cloudinary cloud name and unsigned upload preset.
  // You can find these in your Cloudinary dashboard settings.
  const cloudName: string = "dlqxsa8zl";
  const uploadPreset = "dlqxsa8zl";

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  // Specifying the resource type (video or image) improves upload reliability.
  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || 'Cloudinary upload failed.');
    }

    const data = await response.json();
    
    let thumbnailUrl: string | undefined;

    if (data.resource_type === 'video') {
        // Cloudinary can generate thumbnails automatically.
        // Here, we create a simple thumbnail URL by changing the file extension to .jpg.
        thumbnailUrl = data.secure_url.replace(/\.\w+$/, '.jpg');
    } else {
        // For images, the URL itself can be used as the thumbnail.
        thumbnailUrl = data.secure_url;
    }

    return {
      url: data.secure_url,
      thumbnailUrl: thumbnailUrl,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    // Re-throw the error to be handled by the UI.
    throw error;
  }
};