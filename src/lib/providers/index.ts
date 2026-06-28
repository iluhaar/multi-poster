import { platforms, type PlatformId } from '../platforms'
import type { PublishInput, PublishResult, SocialProvider } from './types'

function createMockProvider(platform: PlatformId): SocialProvider {
  const platformConfig = platforms.find((candidate) => candidate.id === platform)

  if (!platformConfig) {
    throw new Error(`Unknown platform: ${platform}`)
  }

  return {
    platform,
    maxLength: platformConfig.limit,
    async publish() {
      return {
        platform,
        ok: true,
      }
    },
  }
}

export const socialProviders: Record<PlatformId, SocialProvider> = {
  x: createMockProvider('x'),
  bluesky: createMockProvider('bluesky'),
  linkedin: createMockProvider('linkedin'),
}

export async function publishPost(
  platformIds: Array<PlatformId>,
  input: PublishInput,
) {
  const results = await Promise.all(
    platformIds.map(async (platformId) => {
      try {
        return await socialProviders[platformId].publish(input)
      } catch (error) {
        return {
          platform: platformId,
          ok: false,
          error: error instanceof Error ? error.message : 'Unknown publish error',
        } satisfies PublishResult
      }
    }),
  )

  return results
}
