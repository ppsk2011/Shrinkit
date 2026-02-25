import { compressToTargetSize } from '../services/CompressionEngine'

export interface WorkerRequest {
  id: string
  file: File
  targetBytes: number
}

export interface WorkerResponse {
  id: string
  blob?: Blob
  size?: number
  quality?: number
  iterations?: number
  progress?: number
  error?: string
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, file, targetBytes } = event.data
  try {
    const result = await compressToTargetSize(file, targetBytes, (progress) => {
      const response: WorkerResponse = { id, progress }
      self.postMessage(response)
    })
    const response: WorkerResponse = {
      id,
      blob: result.blob,
      size: result.size,
      quality: result.quality,
      iterations: result.iterations,
    }
    self.postMessage(response)
  } catch (err) {
    const response: WorkerResponse = {
      id,
      error: err instanceof Error ? err.message : 'Compression failed',
    }
    self.postMessage(response)
  }
}
