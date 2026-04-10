import { cn } from '@/lib/utils'
import { TaskIntroLinks, type VisualIntroLink } from '@/components/tasks/task-intro-links'

export type { VisualIntroLink }

export function VisualTaskIntroCard({
  taskKey,
  title,
  paragraphs,
  links,
  buttonClass,
  mutedClass,
}: {
  taskKey: 'image' | 'profile' | 'social'
  title: string
  paragraphs: string[]
  links: VisualIntroLink[]
  buttonClass: string
  mutedClass: string
}) {
  const highlights =
    taskKey === 'image'
      ? ['Masonry grid', 'Save locally', 'Creator profiles']
      : taskKey === 'profile'
        ? ['Bio & links', 'Cover imagery', 'Your pins']
        : ['Quick posts', 'Creators', 'Discovery']

  return (
    <section className="mb-12 overflow-hidden rounded-3xl border border-[#e3e3e3] bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-10">
        <div>
          <div className="flex flex-wrap gap-2">
            {highlights.map((h) => (
              <span
                key={h}
                className="rounded-full border border-[#e3e3e3] bg-[#f1f1f1] px-3 py-1 text-xs font-semibold tracking-tight text-[#767676]"
              >
                {h}
              </span>
            ))}
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#111]">{title}</h2>
          {paragraphs.map((p) => (
            <p key={p.slice(0, 48)} className={cn('mt-4 text-sm leading-7', mutedClass)}>
              {p}
            </p>
          ))}
          <TaskIntroLinks links={links} buttonClass={buttonClass} />

          <div className="mt-8 flex gap-2 lg:hidden" aria-hidden>
            <div className="h-[4.5rem] w-[38%] shrink-0 rounded-xl border border-[#e3e3e3] bg-gradient-to-br from-[#fafafa] to-[#ececec]" />
            <div className="h-[4.5rem] w-[26%] shrink-0 rounded-xl border border-[#e3e3e3] bg-gradient-to-br from-[#e60023]/18 to-[#f1f1f1]" />
            <div className="h-[4.5rem] min-w-0 flex-1 rounded-xl border border-[#e3e3e3] bg-[#fafafa]" />
          </div>
        </div>

        <div
          className="relative mx-auto hidden min-h-[200px] w-full max-w-[300px] lg:block"
          aria-hidden
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full rotate-[-2deg] drop-shadow-[0_12px_32px_rgba(17,17,17,0.08)]">
              <div className="grid h-[220px] grid-cols-3 grid-rows-3 gap-2">
                <div className="col-span-2 row-span-2 rounded-2xl border border-[#e3e3e3] bg-gradient-to-br from-[#fafafa] to-[#ececec]" />
                <div className="rounded-xl border border-[#e3e3e3] bg-gradient-to-br from-[#e60023]/18 to-[#f1f1f1]" />
                <div className="rounded-xl border border-[#e3e3e3] bg-[#e8e8e8]" />
                <div className="col-span-3 flex items-center justify-center rounded-xl border border-dashed border-[#d0d0d0] bg-[#fafafa] text-[10px] font-semibold uppercase tracking-widest text-[#b0b0b0]">
                  Pin board
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
