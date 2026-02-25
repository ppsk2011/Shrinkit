interface Props {
  progress: number
  label?: string
}

export default function ProgressIndicator({ progress, label = 'Compressing…' }: Props) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-primary-600 dark:text-primary-400">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-primary-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
