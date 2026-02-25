import { useEffect, useState } from 'react'
import { formatBytes } from '../utils/FileUtils'
import { getImageDimensions, compressionRatio } from '../utils/ImageMetrics'

interface Props {
  originalFile: File
  compressedBlob: Blob | null
}

export default function CompressionPreview({ originalFile, compressedBlob }: Props) {
  const [origURL, setOrigURL] = useState<string>('')
  const [compURL, setCompURL] = useState<string>('')
  const [origDims, setOrigDims] = useState({ width: 0, height: 0 })
  const [compDims, setCompDims] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const url = URL.createObjectURL(originalFile)
    setOrigURL(url)
    getImageDimensions(originalFile).then(setOrigDims)
    return () => URL.revokeObjectURL(url)
  }, [originalFile])

  useEffect(() => {
    if (!compressedBlob) { setCompURL(''); return }
    const url = URL.createObjectURL(compressedBlob)
    setCompURL(url)
    getImageDimensions(compressedBlob).then(setCompDims)
    return () => URL.revokeObjectURL(url)
  }, [compressedBlob])

  const saved = compressedBlob ? compressionRatio(originalFile.size, compressedBlob.size) : null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Original */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex justify-between items-center">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Original</span>
          <span className="text-xs text-gray-600 dark:text-gray-300">{formatBytes(originalFile.size)}</span>
        </div>
        {origURL && <img src={origURL} alt="Original" className="w-full object-contain max-h-64 bg-gray-50 dark:bg-gray-900" />}
        <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
          {origDims.width > 0 && `${origDims.width} × ${origDims.height} px`}
        </div>
      </div>

      {/* Compressed */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex justify-between items-center">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Compressed</span>
          {compressedBlob && (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              {formatBytes(compressedBlob.size)} <span className="text-gray-400">(-{saved})</span>
            </span>
          )}
        </div>
        {compURL
          ? <img src={compURL} alt="Compressed" className="w-full object-contain max-h-64 bg-gray-50 dark:bg-gray-900" />
          : <div className="w-full h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-400 text-sm">
              Awaiting compression…
            </div>
        }
        {compressedBlob && (
          <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
            {compDims.width > 0 && `${compDims.width} × ${compDims.height} px`}
          </div>
        )}
      </div>
    </div>
  )
}
