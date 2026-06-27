export const platforms = [
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

export type Platform = (typeof platforms)[number]
export type PlatformId = Platform['id']
