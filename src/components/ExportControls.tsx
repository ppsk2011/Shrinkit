import JSZip from 'jszip'
import { formatBytes } from '../utils/FileUtils'

interface CompressedItem {
  originalFile: File
  compressedBlob: Blob
}

interface Props {
  items: CompressedItem[]
  outputFormat: string
  onFormatChange: (fmt: string) => void
}

export default function ExportControls({ items, outputFormat, onFormatChange }: Props) {
  const handleSingleDownload = async (item: CompressedItem) => {
    const blob = item.compressedBlob
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const ext = outputFormat !== 'original' ? outputFormat : item.originalFile.name.split('.').pop() || 'jpg'
    a.download = `shrinkit-${item.originalFile.name.replace(/\.[^.]+$/, '')}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleBatchDownload = async () => {
    const zip = new JSZip()
    for (const item of items) {
      const blob = item.compressedBlob
      const ext = outputFormat !== 'original' ? outputFormat : item.originalFile.name.split('.').pop() || 'jpg'
      zip.file(`shrinkit-${item.originalFile.name.replace(/\.[^.]+$/, '')}.${ext}`, blob)
    }
    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shrinkit-images.zip'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (items.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Output format:</label>
        <select
          value={outputFormat}
          onChange={(e) => onFormatChange(e.target.value)}
          className="text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary-400"
        >
          <option value="original">Keep original</option>
          <option value="jpg">JPEG</option>
          <option value="png">PNG</option>
          <option value="webp">WebP</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => handleSingleDownload(item)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {item.originalFile.name.length > 20 ? item.originalFile.name.slice(0, 17) + '…' : item.originalFile.name}
            <span className="text-xs opacity-75">({formatBytes(item.compressedBlob.size)})</span>
          </button>
        ))}

        {items.length > 1 && (
          <button
            onClick={handleBatchDownload}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download All as ZIP
          </button>
        )}
      </div>
    </div>
  )
}
