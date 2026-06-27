type PostComposerProps = {
  postText: string
  selectedCount: number
  publishMessage: string
  canPublish: boolean
  onPostTextChange: (value: string) => void
  onPublish: () => void
}

export function PostComposer({
  postText,
  selectedCount,
  publishMessage,
  canPublish,
  onPostTextChange,
  onPublish,
}: PostComposerProps) {
  return (
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
        onChange={(event) => onPostTextChange(event.target.value)}
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
          onClick={onPublish}
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
  )
}
