import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({ component: Home })

const platforms = [
  {
    id: 'x',
    name: 'X / Twitter',
    limit: 280,
    accent: 'bg-zinc-950 text-white',
  },
  {
    id: 'bluesky',
    name: 'Bluesky',
    limit: 300,
    accent: 'bg-sky-500 text-white',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    limit: 3000,
    accent: 'bg-blue-700 text-white',
  },
] as const

type PlatformId = (typeof platforms)[number]['id']

const platformSelectionStorageKey = 'multi-poster-platform-selection'

const defaultSelectedPlatforms = platforms.reduce(
  (selected, platform) => ({ ...selected, [platform.id]: false }),
  {} as Record<PlatformId, boolean>,
)

function getStoredPlatformSelection() {
  if (typeof window === 'undefined') {
    return defaultSelectedPlatforms
  }

  const storedSelection = window.localStorage.getItem(platformSelectionStorageKey)

  if (!storedSelection) {
    return defaultSelectedPlatforms
  }

  try {
    const parsedSelection = JSON.parse(storedSelection) as Partial<
      Record<PlatformId, boolean>
    >

    return platforms.reduce(
      (selected, platform) => ({
        ...selected,
        [platform.id]: parsedSelection[platform.id] === true,
      }),
      {} as Record<PlatformId, boolean>,
    )
  } catch {
    return defaultSelectedPlatforms
  }
}

function Home() {
  const [postText, setPostText] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    defaultSelectedPlatforms,
  )
  const [publishMessage, setPublishMessage] = useState('')

  const selectedCount = platforms.filter(
    (platform) => selectedPlatforms[platform.id],
  ).length
  const selectedPlatformNames = platforms
    .filter((platform) => selectedPlatforms[platform.id])
    .map((platform) => platform.name)

  const hasPostText = postText.trim().length > 0
  const hasLimitError = platforms.some(
    (platform) =>
      selectedPlatforms[platform.id] && postText.length > platform.limit,
  )
  const canPublish = hasPostText && selectedCount > 0 && !hasLimitError

  useEffect(() => {
    setSelectedPlatforms(getStoredPlatformSelection())
  }, [])

  function togglePlatform(platformId: PlatformId) {
    setSelectedPlatforms((currentPlatforms) => {
      const nextPlatforms = {
        ...currentPlatforms,
        [platformId]: !currentPlatforms[platformId],
      }

      window.localStorage.setItem(
        platformSelectionStorageKey,
        JSON.stringify(nextPlatforms),
      )

      return nextPlatforms
    })
    setPublishMessage('')
  }

  function handlePublish() {
    if (!canPublish) return

    setPublishMessage(
      `Mock publish ready for ${selectedPlatformNames.join(', ')}.`,
    )
  }

  return (
    <main className="min-h-screen bg-stone-950 px-4 py-8 text-stone-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-8 lg:grid lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          <div className="mb-8">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.35em] text-amber-300">
              Multi Poster
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Write once. Prepare every platform.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-300">
              Draft one text post, choose where it should go, and confirm each
              platform is within its posting limit before publishing.
            </p>
          </div>

          <label
            htmlFor="post-composer"
            className="text-sm font-medium text-stone-200"
          >
            Post text
          </label>
          <textarea
            id="post-composer"
            value={postText}
            onChange={(event) => {
              setPostText(event.target.value)
              setPublishMessage('')
            }}
            placeholder="What do you want to share?"
            className="mt-3 min-h-56 w-full resize-y rounded-3xl border border-white/10 bg-stone-900/80 p-5 text-lg leading-8 text-white outline-none transition placeholder:text-stone-500 focus:border-amber-300 focus:ring-4 focus:ring-amber-300/10"
          />

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone-400">
              {postText.length} characters. {selectedCount} platform
              {selectedCount === 1 ? '' : 's'} selected.
            </p>
            <button
              type="button"
              onClick={handlePublish}
              disabled={!canPublish}
              className="rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-400"
            >
              Publish
            </button>
          </div>

          {publishMessage ? (
            <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              {publishMessage}
            </p>
          ) : null}
        </div>

        <aside className="rounded-[2rem] border border-white/10 bg-stone-900 p-5 shadow-2xl shadow-black/20 sm:p-6">
          <h2 className="text-xl font-semibold text-white">Platforms</h2>
          <p className="mt-2 text-sm leading-6 text-stone-400">
            Toggle targets and check the strictest limits before publishing.
          </p>

          <div className="mt-6 space-y-4">
            {platforms.map((platform) => {
              const isSelected = selectedPlatforms[platform.id]
              const remainingCharacters = platform.limit - postText.length
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
                      onClick={() => togglePlatform(platform.id)}
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
      </section>
    </main>
  )
}
