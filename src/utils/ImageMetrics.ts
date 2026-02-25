export interface ImageDimensions {
  width: number
  height: number
}

export async function getImageDimensions(file: File | Blob): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      reject(new Error('Failed to load image'))
      URL.revokeObjectURL(url)
    }
    img.src = url
  })
}

export function compressionRatio(originalSize: number, compressedSize: number): string {
  if (originalSize === 0) return '0%'
  const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1)
  return `${ratio}%`
}
