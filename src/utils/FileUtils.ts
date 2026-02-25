export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `Unsupported file type: ${file.type}. Accepted: JPEG, PNG, WebP, GIF.`
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File too large (${formatBytes(file.size)}). Maximum allowed: 50 MB.`
  }
  return null
}

export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
