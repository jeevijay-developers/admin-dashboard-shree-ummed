/**
 * Image compression utility to reduce file size before upload
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

/**
 * Compress an image file
 * @param file - The original image file
 * @param options - Compression options
 * @returns Promise<File> - Compressed image file
 */
export const compressImage = (
  file: File, 
  options: CompressOptions = {}
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'jpeg'
    } = options;

    // Create canvas and context
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Create image object
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      // Maintain aspect ratio while respecting max dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          
          // Create new file from blob
          const compressedFile = new File(
            [blob], 
            file.name.replace(/\.[^/.]+$/, `.${format === 'jpeg' ? 'jpg' : format}`),
            {
              type: `image/${format}`,
              lastModified: Date.now()
            }
          );
          
          resolve(compressedFile);
        },
        `image/${format}`,
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    // Load image
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Compress multiple images
 * @param files - Array of image files
 * @param options - Compression options
 * @returns Promise<File[]> - Array of compressed files
 */
export const compressImages = async (
  files: File[], 
  options: CompressOptions = {}
): Promise<File[]> => {
  const compressPromises = files.map(file => compressImage(file, options));
  return Promise.all(compressPromises);
};

/**
 * Get compression ratio and size info
 * @param originalFile - Original file
 * @param compressedFile - Compressed file
 */
export const getCompressionInfo = (originalFile: File, compressedFile: File) => {
  const originalSize = originalFile.size;
  const compressedSize = compressedFile.size;
  const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
  
  return {
    originalSize: formatFileSize(originalSize),
    compressedSize: formatFileSize(compressedSize),
    compressionRatio: `${compressionRatio}%`,
    savedBytes: originalSize - compressedSize
  };
};

/**
 * Format file size in human readable format
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};