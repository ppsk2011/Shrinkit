import { useState } from 'react'

interface Props {
  value: number
  unit: 'KB' | 'MB'
  onChange: (bytes: number) => void
}

const PRESETS: { label: string; bytes: number }[] = [
  { label: '50 KB', bytes: 50 * 1024 },
  { label: '100 KB', bytes: 100 * 1024 },
  { label: '200 KB', bytes: 200 * 1024 },
  { label: '500 KB', bytes: 500 * 1024 },
  { label: '1 MB', bytes: 1024 * 1024 },
]

export default function TargetSizeInput({ value, unit, onChange }: Props) {
  const [selectedUnit, setSelectedUnit] = useState<'KB' | 'MB'>(unit)

  const displayValue = selectedUnit === 'KB' ? Math.round(value / 1024) : +(value / (1024 * 1024)).toFixed(2)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value)
    if (isNaN(num) || num <= 0) return
    const bytes = selectedUnit === 'KB' ? num * 1024 : num * 1024 * 1024
    onChange(bytes)
  }

  const handleUnitChange = (u: 'KB' | 'MB') => {
    setSelectedUnit(u)
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Target File Size
        <span
          title="Email attachments are typically under 100 KB"
          className="ml-2 inline-flex items-center justify-center w-4 h-4 text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full cursor-help"
        >?</span>
      </label>

      <div className="flex rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600">
        <input
          type="number"
          min={1}
          step={selectedUnit === 'KB' ? 10 : 0.1}
          value={displayValue}
          onChange={handleChange}
          className="flex-1 px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 outline-none"
        />
        <div className="flex border-l border-gray-300 dark:border-gray-600">
          {(['KB', 'MB'] as const).map((u) => (
            <button
              key={u}
              onClick={() => handleUnitChange(u)}
              className={`px-3 py-2 text-sm font-medium transition-colors
                ${selectedUnit === u
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >{u}</button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => onChange(p.bytes)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors
              ${value === p.bytes
                ? 'bg-primary-500 text-white border-primary-500'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary-400 dark:hover:border-primary-500'
              }`}
          >{p.label}</button>
        ))}
      </div>
    </div>
  )
}
