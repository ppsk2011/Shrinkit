// Stub payment service — replace with real Stripe / LemonSqueezy integration
export interface PremiumStatus {
  isPremium: boolean
  expiresAt: Date | null
}

const STORAGE_KEY = 'shrinkit_premium'

export function getPremiumStatus(): PremiumStatus {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { isPremium: false, expiresAt: null }
    const parsed = JSON.parse(raw) as { isPremium: boolean; expiresAt: string | null }
    return {
      isPremium: parsed.isPremium,
      expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
    }
  } catch {
    return { isPremium: false, expiresAt: null }
  }
}

export function setPremiumStatus(isPremium: boolean): void {
  const status: PremiumStatus = {
    isPremium,
    expiresAt: isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(status))
}
