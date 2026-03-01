export default function DonateButton() {
  return (
    <a
      href="https://buymeacoffee.com/techscriptx"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold bg-yellow-400 hover:bg-yellow-500 text-yellow-900 transition-colors"
      aria-label="Buy me a coffee — support ShrinkIt"
      title="Support ShrinkIt — all features stay free"
    >
      <span>☕</span>
      <span className="hidden sm:inline">Buy me a coffee</span>
    </a>
  )
}
