import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { PlatformSelector } from '../components/platform-selector'
import { PostComposer } from '../components/post-composer'
import { publishPost } from '../lib/providers'
import { platforms, type PlatformId } from '../lib/platforms'

const platformSelectionCookieName = 'multi-poster-platform-selection'

const defaultSelectedPlatforms = platforms.reduce(
  (selected, platform) => ({ ...selected, [platform.id]: false }),
  {} as Record<PlatformId, boolean>,
)

function normalizePlatformSelection(
  platformSelection?: Partial<Record<PlatformId, boolean>>,
) {
  return platforms.reduce(
    (selected, platform) => ({
      ...selected,
      [platform.id]: platformSelection?.[platform.id] === true,
    }),
    {} as Record<PlatformId, boolean>,
  )
}

function parsePlatformSelectionCookie(cookieValue?: string) {
  if (!cookieValue) {
    return defaultSelectedPlatforms
  }

  try {
    const parsedSelection = JSON.parse(decodeURIComponent(cookieValue)) as Partial<
      Record<PlatformId, boolean>
    >

    return normalizePlatformSelection(parsedSelection)
  } catch {
    return defaultSelectedPlatforms
  }
}

const getPlatformSelection = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getCookie } = await import('@tanstack/react-start/server')

    return parsePlatformSelectionCookie(getCookie(platformSelectionCookieName))
  },
)

export const Route = createFileRoute('/')({
  loader: async () => ({
    initialSelectedPlatforms: await getPlatformSelection(),
  }),
  component: Home,
})

function Home() {
  const { initialSelectedPlatforms } = Route.useLoaderData()
  const [postText, setPostText] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    initialSelectedPlatforms,
  )
  const [publishMessage, setPublishMessage] = useState('')

  const selectedCount = platforms.filter(
    (platform) => selectedPlatforms[platform.id],
  ).length
  const selectedPlatformNames = platforms
    .filter((platform) => selectedPlatforms[platform.id])
    .map((platform) => platform.name)
  const selectedPlatformIds = platforms
    .filter((platform) => selectedPlatforms[platform.id])
    .map((platform) => platform.id)

  const hasPostText = postText.trim().length > 0
  const hasLimitError = platforms.some(
    (platform) =>
      selectedPlatforms[platform.id] && postText.length > platform.limit,
  )
  const canPublish = hasPostText && selectedCount > 0 && !hasLimitError

  function togglePlatform(platformId: PlatformId) {
    setSelectedPlatforms((currentPlatforms) => {
      const nextPlatforms = normalizePlatformSelection({
        ...currentPlatforms,
        [platformId]: !currentPlatforms[platformId],
      })

      document.cookie = `${platformSelectionCookieName}=${encodeURIComponent(
        JSON.stringify(nextPlatforms),
      )}; Path=/; Max-Age=31536000; SameSite=Lax`

      setPublishMessage('')

      return nextPlatforms
    })
  }

  async function handlePublish() {
    if (!canPublish) return

    const results = await publishPost(selectedPlatformIds, { text: postText })
    const successfulResults = results.filter((result) => result.ok)
    const failedResults = results.filter((result) => !result.ok)

    if (failedResults.length === 0) {
      setPublishMessage(
        `Publish flow completed for ${selectedPlatformNames.join(', ')}.`,
      )
      return
    }

    if (successfulResults.length === 0) {
      setPublishMessage('Publish flow failed for every selected platform.')
      return
    }

    setPublishMessage(
      `Partial publish: ${successfulResults.length} succeeded, ${failedResults.length} failed.`,
    )
  }

  return (
    <main className="min-h-screen bg-stone-950 px-4 py-8 text-stone-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-8 lg:grid lg:grid-cols-[1.4fr_0.8fr]">
        <PostComposer
          postText={postText}
          selectedCount={selectedCount}
          publishMessage={publishMessage}
          canPublish={canPublish}
          onPostTextChange={(value) => {
            setPostText(value)
            setPublishMessage('')
          }}
          onPublish={handlePublish}
        />

        <PlatformSelector
          postTextLength={postText.length}
          selectedPlatforms={selectedPlatforms}
          onTogglePlatform={togglePlatform}
        />
      </section>
    </main>
  )
}
