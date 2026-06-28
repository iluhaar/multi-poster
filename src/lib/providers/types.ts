import type { PlatformId } from '../platforms'

export type PublishInput = {
  text: string
}

export type PublishResult = {
  platform: PlatformId
  ok: boolean
  url?: string
  error?: string
}

export interface SocialProvider {
  platform: PlatformId
  maxLength: number
  publish(input: PublishInput): Promise<PublishResult>
}
