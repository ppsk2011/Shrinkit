import { setPremiumStatus } from '../services/PaymentService'

interface Props {
  isPremium: boolean
  onPremiumChange: (v: boolean) => void
}

export default function PremiumAccess({ isPremium, onPremiumChange }: Props) {
  const toggle = () => {
    const next = !isPremium
    setPremiumStatus(next)
    onPremiumChange(next)
  }

  return (
    <div className={`rounded-2xl p-5 border transition-colors ${
      isPremium
        ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white">
            {isPremium ? '✨ Premium Active' : 'ShrinkIt Premium'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {isPremium ? 'Clean downloads, no watermarks.' : 'Remove watermarks from downloaded images.'}
          </p>
        </div>
        <button
          onClick={toggle}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            isPremium
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              : 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900'
          }`}
        >
          {isPremium ? 'Deactivate (demo)' : 'Unlock – $4.99/mo'}
        </button>
      </div>
    </div>
  )
}
