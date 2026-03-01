import { useState, useCallback, useEffect } from 'react'
import DonateButton from './components/DonateButton'
import UploadArea from './components/UploadArea'
import TargetSizeInput from './components/TargetSizeInput'
import CompressionPreview from './components/CompressionPreview'
import ExportControls from './components/ExportControls'
import ProgressIndicator from './components/ProgressIndicator'
import { compressToTargetSize } from './services/CompressionEngine'
import { registerServiceWorker } from './serviceWorker'

interface ImageItem {
  file: File
  compressedBlob: Blob | null
  progress: number
  error: string | null
  done: boolean
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [targetBytes, setTargetBytes] = useState(100 * 1024)
  const [items, setItems] = useState<ImageItem[]>([])
  const [outputFormat, setOutputFormat] = useState('original')

  useEffect(() => {
    registerServiceWorker()
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newItems: ImageItem[] = files.map((f) => ({ file: f, compressedBlob: null, progress: 0, error: null, done: false }))
    setItems((prev) => [...prev, ...newItems])

    for (const item of newItems) {
      try {
        const result = await compressToTargetSize(item.file, targetBytes, (progress) => {
          setItems((prev) =>
            prev.map((it) => (it.file === item.file ? { ...it, progress } : it))
          )
        })
        setItems((prev) =>
          prev.map((it) =>
            it.file === item.file ? { ...it, compressedBlob: result.blob, done: true, progress: 100 } : it
          )
        )
      } catch (err) {
        setItems((prev) =>
          prev.map((it) =>
            it.file === item.file
              ? { ...it, error: err instanceof Error ? err.message : 'Failed', done: true }
              : it
          )
        )
      }
    }
  }, [targetBytes])

  const handleRecompress = useCallback(async (newTarget: number) => {
    setTargetBytes(newTarget)
    const toRecompress = items.filter((it) => it.done)
    if (toRecompress.length === 0) return
    setItems((prev) => prev.map((it) => it.done ? { ...it, compressedBlob: null, done: false, progress: 0, error: null } : it))
    for (const item of toRecompress) {
      try {
        const result = await compressToTargetSize(item.file, newTarget, (progress) => {
          setItems((prev) => prev.map((it) => it.file === item.file ? { ...it, progress } : it))
        })
        setItems((prev) =>
          prev.map((it) =>
            it.file === item.file ? { ...it, compressedBlob: result.blob, done: true, progress: 100 } : it
          )
        )
      } catch (err) {
        setItems((prev) =>
          prev.map((it) =>
            it.file === item.file
              ? { ...it, error: err instanceof Error ? err.message : 'Failed', done: true }
              : it
          )
        )
      }
    }
  }, [items])

  const completedItems = items.filter((it) => it.done && it.compressedBlob).map((it) => ({
    originalFile: it.file,
    compressedBlob: it.compressedBlob!,
  }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl">🗜️</span>
            <span className="font-bold text-xl text-gray-900 dark:text-white">ShrinkIt</span>
            <span className="text-xs bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">Beta</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <DonateButton />
            <button
              onClick={() => setDarkMode((d) => !d)}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <section className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Compress Images to Exact Size</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Set a target file size and let ShrinkIt dial in the perfect quality — all processing stays in your browser, nothing is uploaded.
          </p>
        </section>

        {/* Controls */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <TargetSizeInput value={targetBytes} unit="KB" onChange={handleRecompress} />
          <UploadArea onFilesSelected={handleFilesSelected} />
        </section>

        {/* Items */}
        {items.length > 0 && (
          <section className="space-y-6">
            {items.map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800 dark:text-white truncate max-w-xs">{item.file.name}</h2>
                  {item.error && <span className="text-sm text-red-500">{item.error}</span>}
                </div>
                {!item.done && <ProgressIndicator progress={item.progress} />}
                <CompressionPreview originalFile={item.file} compressedBlob={item.compressedBlob} />
              </div>
            ))}
          </section>
        )}

        {/* Export */}
        {completedItems.length > 0 && (
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-800 dark:text-white mb-4">Download</h2>
            <ExportControls
              items={completedItems}
              outputFormat={outputFormat}
              onFormatChange={setOutputFormat}
            />
          </section>
        )}

        {/* Clear */}
        {items.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => setItems([])}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear all images
            </button>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 py-6 text-center text-xs text-gray-400 dark:text-gray-600 space-y-1">
        <p>ShrinkIt © {new Date().getFullYear()} — Privacy first. No uploads. No tracking.</p>
        <p>
          Powered by{' '}
          <a
            href="https://www.techscript.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            Techscript
          </a>
        </p>
      </footer>
    </div>
  )
}
