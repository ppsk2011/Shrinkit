import { useCallback, useState } from 'react'
import { validateFile, ACCEPTED_TYPES } from '../utils/FileUtils'

interface Props {
  onFilesSelected: (files: File[]) => void
}

export default function UploadArea({ onFilesSelected }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files)
      const valid: File[] = []
      const errs: string[] = []
      for (const f of arr) {
        const err = validateFile(f)
        if (err) {
          errs.push(`${f.name}: ${err}`)
        } else {
          valid.push(f)
        }
      }
      setErrors(errs)
      if (valid.length > 0) onFilesSelected(valid)
    },
    [onFilesSelected]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      processFiles(e.dataTransfer.files)
    },
    [processFiles]
  )

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files)
  }

  return (
    <div className="w-full">
      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-colors
          ${isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
          <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-primary-600 dark:text-primary-400">Click to upload</span> or drag &amp; drop
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">JPEG, PNG, WebP, GIF up to 50 MB</p>
        </div>
        <input
          type="file"
          className="hidden"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          onChange={onInputChange}
        />
      </label>
      {errors.length > 0 && (
        <ul className="mt-2 space-y-1">
          {errors.map((e, i) => (
            <li key={i} className="text-sm text-red-500">{e}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
