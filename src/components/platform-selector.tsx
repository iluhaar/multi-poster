import { platforms, type PlatformId } from '../lib/platforms'

type PlatformSelectorProps = {
  postTextLength: number
  selectedPlatforms: Record<PlatformId, boolean>
  onTogglePlatform: (platformId: PlatformId) => void
}

export function PlatformSelector({
  postTextLength,
  selectedPlatforms,
  onTogglePlatform,
}: PlatformSelectorProps) {
  return (
    <aside className="rounded-[2rem] border border-white/10 bg-stone-900 p-5 shadow-2xl shadow-black/20 sm:p-6">
      <h2 className="text-xl font-semibold text-white">Platforms</h2>
      <p className="mt-2 text-sm leading-6 text-stone-400">
        Toggle targets and check the strictest limits before publishing.
      </p>

      <div className="mt-6 space-y-4">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms[platform.id]
          const remainingCharacters = platform.limit - postTextLength
          const isOverLimit = remainingCharacters < 0

          return (
            <div
              key={platform.id}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${platform.accent}`}
                  >
                    {platform.name}
                  </span>
                  <p className="mt-3 text-sm text-stone-300">
                    Limit: {platform.limit.toLocaleString()} characters
                  </p>
                </div>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onTogglePlatform(platform.id)}
                  className={`relative h-7 w-12 rounded-full transition ${
                    isSelected ? 'bg-amber-300' : 'bg-stone-700'
                  }`}
                >
                  <span className="sr-only">Toggle {platform.name}</span>
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      isSelected ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <p
                className={`mt-4 text-sm font-medium ${
                  isOverLimit ? 'text-red-300' : 'text-stone-400'
                }`}
              >
                {isOverLimit
                  ? `${Math.abs(remainingCharacters)} characters over limit`
                  : `${remainingCharacters.toLocaleString()} characters remaining`}
              </p>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
