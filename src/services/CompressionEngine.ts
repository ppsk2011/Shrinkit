import imageCompression from 'browser-image-compression'

export interface CompressionResult {
  blob: Blob
  size: number
  quality: number
  iterations: number
}

export async function compressToTargetSize(
  file: File,
  targetBytes: number,
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  const tolerance = 0.05 // ±5%
  const lower = targetBytes * (1 - tolerance)
  const upper = targetBytes * (1 + tolerance)

  let lo = 0.01
  let hi = 1.0
  let bestBlob: Blob = file
  let bestSize = file.size
  let bestQuality = 1.0
  let iterations = 0
  const maxIterations = 12

  // If file is already smaller than target, return as-is
  if (file.size <= upper) {
    onProgress?.(100)
    return { blob: file, size: file.size, quality: 1.0, iterations: 0 }
  }

  while (iterations < maxIterations) {
    const quality = (lo + hi) / 2
    iterations++

    onProgress?.(Math.round((iterations / maxIterations) * 90))

    const compressed = await imageCompression(file, {
      initialQuality: quality,
      useWebWorker: false,
      fileType: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
    })

    const size = compressed.size

    if (size >= lower && size <= upper) {
      onProgress?.(100)
      return { blob: compressed, size, quality, iterations }
    }

    if (size > upper) {
      hi = quality
    } else {
      lo = quality
      bestBlob = compressed
      bestSize = size
      bestQuality = quality
    }

    if (hi - lo < 0.005) break
  }

  onProgress?.(100)
  return { blob: bestBlob, size: bestSize, quality: bestQuality, iterations }
}
