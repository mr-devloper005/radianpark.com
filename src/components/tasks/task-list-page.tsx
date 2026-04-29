import Link from "next/link";
import { ArrowRight, LayoutGrid, Image as ImageIcon, User } from "lucide-react";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { TaskListClient } from "@/components/tasks/task-list-client";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG, getTaskConfig, type TaskKey } from "@/lib/site-config";
import { CATEGORY_OPTIONS, normalizeCategory } from "@/lib/categories";
import { taskIntroCopy } from "@/config/site.content";
import { getSiteExperience } from "@/lib/site-experience";

function renderHero(
  experience: ReturnType<typeof getSiteExperience>,
  task: TaskKey,
  taskLabel: string,
  description: string,
  normalizedCategory: string,
  route: string,
  postsCount: number = 0
) {
  const filterForm = (
    <form action={route} className={`grid gap-3 rounded-[1.75rem] p-5 ${experience.softPanelClass}`}>
      <label className={`text-xs font-semibold uppercase tracking-[0.24em] ${experience.mutedClass}`}>
        Category
      </label>
      <select
        name="category"
        defaultValue={normalizedCategory}
        className="h-11 rounded-xl border border-border bg-white/80 px-3 text-sm text-foreground"
      >
        <option value="all">All categories</option>
        {CATEGORY_OPTIONS.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
      <button type="submit" className={`h-11 rounded-xl text-sm font-semibold ${experience.buttonClass}`}>
        Apply filter
      </button>
    </form>
  );

  if (experience.key === "tynewebdesign") {
    return (
      <section className="mb-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className={`rounded-[2.25rem] p-8 ${experience.panelClass}`}>
          <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${experience.mutedClass}`}>{experience.heroEyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">{description}</h1>
          <p className={`mt-5 max-w-2xl text-sm leading-8 ${experience.mutedClass}`}>{experience.heroDescription}</p>
        </div>
        {filterForm}
      </section>
    );
  }

  if (experience.key === "codepixelmedia") {
    return (
      <section className="mb-12 grid gap-0 overflow-hidden rounded-[2rem] lg:grid-cols-[1fr_1fr]">
        <div className={`p-8 ${experience.panelClass}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">{taskLabel}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">{description}</h1>
          <p className="mt-5 max-w-xl text-sm leading-8 text-slate-300">{experience.heroDescription}</p>
        </div>
        <div className="bg-[#eef3ff] p-8">{filterForm}</div>
      </section>
    );
  }

  // Profile page layout - all sections in one container
  if (task === "profile") {
    return (
      <section className="mb-12 overflow-hidden rounded-[2rem] bg-[#0c0c0c] text-white">
        <div 
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            backgroundImage: 'radial-gradient(ellipse 120% 80% at 20% -20%, rgba(230,0,35,0.2), transparent 50%), linear-gradient(180deg, #141414 0%, #0a0a0a 100%)'
          }}
        />
        <div className="relative px-6 py-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Left - All content combined */}
            <div className="flex-1 space-y-6">
              {/* Top section */}
              <div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-rose-400" />
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                    Glassmorphic Creator Surfaces
                  </span>
                </div>
                <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white lg:text-3xl">
                  Public creator profiles, bios, and social presence.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
                  Floating identity blocks, softer depth, and a masonry-first gallery flow built for visual browsing.
                </p>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-3">
                {[
                  { value: postsCount.toString(), label: 'Profiles', icon: User },
                  { value: CATEGORY_OPTIONS.length.toString(), label: 'Categories', icon: LayoutGrid },
                  { value: 'Active', label: 'Status', icon: ArrowRight },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm">
                      <Icon className="h-4 w-4 text-rose-400" />
                      <span className="text-sm font-bold text-white">{stat.value}</span>
                      <span className="text-[10px] uppercase tracking-[0.05em] text-white/40">{stat.label}</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Divider */}
              <div className="h-px bg-white/10" />
              
              {/* Bottom section - Creators info */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  Creators, Profiles, and Public Pages
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
                  Profiles put a face and story behind the images you discover—bios, links, and a consistent identity so image sharing feels personal and easy to trust.
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
                  They anchor the rest of the experience: open a profile from the feed to see more of their visual style, then jump straight into their shared photos and pins in the same layout.
                </p>
              </div>
            </div>

            {/* Right - Filter form + Surface notes */}
            <div className="space-y-4 lg:w-64">
              <form action={route} className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={normalizedCategory}
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white focus:border-rose-500 focus:outline-none"
                >
                  <option value="all" className="bg-[#1a1a1a]">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug} className="bg-[#1a1a1a]">
                      {item.name}
                    </option>
                  ))}
                </select>
                <button 
                  type="submit" 
                  className="h-12 w-full rounded-xl bg-[#0a2a4a] text-sm font-semibold text-white transition hover:bg-[#0d3a5c]"
                >
                  Apply filter
                </button>
              </form>
              
              {/* Surface notes */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-white/60" />
                  <span className="text-sm font-semibold text-white">Surface notes</span>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <Link href={route || '/profile'} className="flex items-center justify-between text-white/60 hover:text-white transition">
                    <span>Open current collection</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <Link href="/search" className="flex items-center justify-between text-white/60 hover:text-white transition">
                    <span>Search across tasks</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (experience.key === "radianpark") {
    // Layout with eyebrow/title, stats in one row, and filter on right - full width
    return (
      <section className="relative mb-6 overflow-hidden text-white">
        <div 
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            backgroundImage: 'radial-gradient(ellipse 120% 80% at 20% -20%, rgba(230,0,35,0.2), transparent 50%), linear-gradient(180deg, #141414 0%, #0a0a0a 100%)'
          }}
        />
        <div className="relative">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left - Eyebrow and Title */}
            <div>
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-rose-400" />
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  Glassmorphic Creator Surfaces
                </span>
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white lg:text-3xl">
                A masonry feed of shared photos and visual posts.
              </h1>
              
              {/* Stats in one row */}
              <div className="mt-6 flex items-center gap-3">
                {[
                  { value: postsCount.toString(), label: 'Photos', icon: ImageIcon },
                  { value: CATEGORY_OPTIONS.length.toString(), label: 'Categories', icon: LayoutGrid },
                  { value: 'Daily', label: 'Updates', icon: ArrowRight },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm">
                      <Icon className="h-4 w-4 text-rose-400" />
                      <span className="text-sm font-bold text-white">{stat.value}</span>
                      <span className="text-[10px] uppercase tracking-[0.05em] text-white/40">{stat.label}</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Description */}
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
                This feed is built for photos, mood boards, and visual posts—a Pinterest-style grid so you can scan ideas quickly and save what stands out.
              </p>
            </div>

            {/* Right - Filter form */}
            <form action={route} className="flex items-center gap-3">
              <select
                name="category"
                defaultValue={normalizedCategory}
                className="h-12 w-48 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="all" className="bg-[#1a1a1a]">All categories</option>
                {CATEGORY_OPTIONS.map((item) => (
                  <option key={item.slug} value={item.slug} className="bg-[#1a1a1a]">
                    {item.name}
                  </option>
                ))}
              </select>
              <button 
                type="submit" 
                className="h-12 rounded-xl bg-white px-6 text-sm font-semibold text-[#0c0c0c] transition hover:bg-white/90"
              >
                Apply
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  if (experience.key === "lashisking") {
    return (
      <section className={`mb-12 rounded-[2.5rem] p-8 ${experience.panelClass}`}>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${experience.mutedClass}`}>{experience.heroEyebrow}</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-rose-950">{description}</h1>
            <p className={`mt-5 max-w-2xl text-sm leading-8 ${experience.mutedClass}`}>{experience.heroDescription}</p>
          </div>
          {filterForm}
        </div>
      </section>
    );
  }

  if (experience.key === "scoreminers") {
    return (
      <section className="mb-12 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className={`p-6 ${experience.panelClass}`}>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-950">{experience.heroEyebrow}</p>
          <h1 className="mt-4 text-4xl font-black uppercase text-slate-950">{description}</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {["142", "96%", "19"].map((item, index) => (
            <div key={item} className={`p-6 ${experience.softPanelClass}`}>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-950">{["Total tasks", "Success rate", "Level"][index]}</p>
              <p className="mt-3 text-4xl font-black text-slate-950">{item}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (experience.key === "linedesing") {
    return (
      <section className={`mb-12 rounded-[2rem] p-6 ${experience.panelClass}`}>
        <div className="grid gap-6 lg:grid-cols-[220px_1fr_300px]">
          <div className="border-b border-sky-200 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Mode</p>
            <p className="mt-3 text-lg font-semibold text-slate-950">Blueprint</p>
          </div>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${experience.mutedClass}`}>{experience.heroEyebrow}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950">{description}</h1>
          </div>
          {filterForm}
        </div>
      </section>
    );
  }

  if (experience.key === "helloartcity") {
    return (
      <section className="mb-12 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className={`relative overflow-hidden rounded-[2rem] p-8 ${experience.panelClass}`}>
          <div className="absolute right-6 top-6 rotate-[8deg] rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold text-emerald-900">Live wall</div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">{experience.heroEyebrow}</p>
          <h1 className="mt-4 text-5xl font-bold tracking-[-0.05em] text-stone-950">{description}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-stone-700">{experience.heroDescription}</p>
        </div>
        {filterForm}
      </section>
    );
  }

  if (experience.key === "housesdecors") {
    return (
      <section className={`mb-12 rounded-[2rem] p-8 ${experience.panelClass}`}>
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${experience.mutedClass}`}>{experience.heroEyebrow}</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-amber-950">{description}</h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className={`rounded-[1.5rem] p-5 ${experience.softPanelClass}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-900/60">Task style</p>
              <p className="mt-2 text-xl font-semibold text-amber-950">Material panels</p>
            </div>
            {filterForm}
          </div>
        </div>
      </section>
    );
  }

  if (experience.key === "aporiakennels") {
    return (
      <section className={`mb-12 rounded-[2rem] p-8 ${experience.panelClass}`}>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${experience.mutedClass}`}>{experience.heroEyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-emerald-950">{description}</h1>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Champion lines", "Daily field notes", "Image-backed trust"].map((item) => (
                <span key={item} className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-950">
                  {item}
                </span>
              ))}
            </div>
          </div>
          {filterForm}
        </div>
      </section>
    );
  }

  return (
    <section className={`mb-12 rounded-[2.25rem] p-8 ${experience.panelClass}`}>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${experience.mutedClass}`}>{experience.heroEyebrow}</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-slate-950">{description}</h1>
          <p className={`mt-5 max-w-2xl text-sm leading-8 ${experience.mutedClass}`}>{experience.heroDescription}</p>
        </div>
        {filterForm}
      </div>
    </section>
  );
}

export async function TaskListPage({ task, category }: { task: TaskKey; category?: string }) {
  const taskConfig = getTaskConfig(task);
  const posts = await fetchTaskPosts(task, 30);
  const normalizedCategory = category ? normalizeCategory(category) : "all";
  const intro = taskIntroCopy[task];
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const experience = getSiteExperience(SITE_CONFIG.baseUrl);
  const schemaItems = posts.slice(0, 10).map((post, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${baseUrl}${taskConfig?.route || "/posts"}/${post.slug}`,
    name: post.title,
  }));

  const introSection = intro ? (
    <section className={`rounded-[2rem] p-6 ${experience.panelClass}`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${experience.mutedClass}`}>{intro.title}</p>
          {intro.paragraphs.slice(0, 2).map((paragraph) => (
            <p key={paragraph.slice(0, 30)} className={`mt-4 max-w-3xl text-sm leading-8 ${experience.mutedClass}`}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className={`rounded-[1.5rem] p-5 ${experience.softPanelClass}`}>
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <LayoutGrid className="h-4 w-4" />
            Surface notes
          </div>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link href={taskConfig?.route || "#"} className={`inline-flex items-center gap-2 ${experience.mutedClass}`}>
              Open current collection <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/search" className={`inline-flex items-center gap-2 ${experience.mutedClass}`}>
              Search across tasks <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  ) : null;

  const combinedImageSharingSection =
    experience.key === "tynewebdesign" && task === "image" && intro ? (
      <section className="mb-10 rounded-[2.5rem] border border-white/50 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_28%),linear-gradient(180deg,rgba(244,251,255,0.92)_0%,rgba(255,255,255,0.88)_100%)] p-6 shadow-[0_30px_90px_rgba(14,116,144,0.12)] backdrop-blur-xl lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.75rem] p-8">
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${experience.mutedClass}`}>{experience.heroEyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
              {taskConfig?.description || "Latest posts"}
            </h1>
            <p className={`mt-5 max-w-2xl text-sm leading-8 ${experience.mutedClass}`}>{experience.heroDescription}</p>
          </div>

          <form action={taskConfig?.route || "#"} className="grid gap-3 rounded-[1.75rem] p-6">
            <label className={`text-xs font-semibold uppercase tracking-[0.24em] ${experience.mutedClass}`}>
              Category
            </label>
            <select
              name="category"
              defaultValue={normalizedCategory}
              className="h-11 rounded-xl border border-border bg-white/80 px-3 text-sm text-foreground"
            >
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            <button type="submit" className={`h-11 rounded-xl text-sm font-semibold ${experience.buttonClass}`}>
              Apply filter
            </button>
          </form>
        </div>

        <div className="my-6 h-px bg-sky-100/80" />

        <div className="flex flex-col gap-6 rounded-[1.75rem] p-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${experience.mutedClass}`}>{intro.title}</p>
            {intro.paragraphs.slice(0, 2).map((paragraph) => (
              <p key={paragraph.slice(0, 30)} className={`mt-4 max-w-3xl text-sm leading-8 ${experience.mutedClass}`}>
                {paragraph}
              </p>
            ))}
          </div>
          <div className="min-w-[220px] lg:pl-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <LayoutGrid className="h-4 w-4" />
              Surface notes
            </div>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link href={taskConfig?.route || "#"} className={`inline-flex items-center gap-2 ${experience.mutedClass}`}>
                Open current collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/search" className={`inline-flex items-center gap-2 ${experience.mutedClass}`}>
                Search across tasks <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    ) : null;

  const combinedProfileSection =
    experience.key === "tynewebdesign" && task === "profile" && intro ? (
      <section className="mb-10 rounded-[2.5rem] border border-white/50 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_28%),linear-gradient(180deg,rgba(244,251,255,0.92)_0%,rgba(255,255,255,0.88)_100%)] p-6 shadow-[0_30px_90px_rgba(14,116,144,0.12)] backdrop-blur-xl lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.75rem] p-8">
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${experience.mutedClass}`}>
              Glassmorphic Creator Surfaces
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
              Public creator profiles, bios, and social presence.
            </h1>
            <p className={`mt-5 max-w-2xl text-sm leading-8 ${experience.mutedClass}`}>
              Floating identity blocks, softer depth, and a masonry-first gallery flow built for visual browsing.
            </p>
          </div>

          <form action={taskConfig?.route || "#"} className="grid gap-3 rounded-[1.75rem] p-6">
            <label className={`text-xs font-semibold uppercase tracking-[0.24em] ${experience.mutedClass}`}>
              Category
            </label>
            <select
              name="category"
              defaultValue={normalizedCategory}
              className="h-11 rounded-xl border border-border bg-white/80 px-3 text-sm text-foreground"
            >
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            <button type="submit" className={`h-11 rounded-xl text-sm font-semibold ${experience.buttonClass}`}>
              Apply filter
            </button>
          </form>
        </div>

        <div className="my-6 h-px bg-sky-100/80" />

        <div className="flex flex-col gap-6 rounded-[1.75rem] p-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${experience.mutedClass}`}>
              Creators, Profiles, and Public Pages
            </p>
            <p className={`mt-4 max-w-3xl text-sm leading-8 ${experience.mutedClass}`}>
              Profiles put a face and story behind the images you discover bios, links, and a consistent identity so image sharing feels personal and easy to trust.
            </p>
            <p className={`mt-4 max-w-3xl text-sm leading-8 ${experience.mutedClass}`}>
              They anchor the rest of the experience: open a profile from the feed to see more of their visual style, then jump straight into their shared photos and pins in the same layout.
            </p>
          </div>
          <div className="min-w-[220px] lg:pl-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <LayoutGrid className="h-4 w-4" />
              Surface notes
            </div>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link href={taskConfig?.route || "#"} className={`inline-flex items-center gap-2 ${experience.mutedClass}`}>
                Open current collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/search" className={`inline-flex items-center gap-2 ${experience.mutedClass}`}>
                Search across tasks <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    ) : null;

  const isFullWidthTaskSurface =
    experience.key === "tynewebdesign" && (task === "image" || task === "profile");

  return (
    <div className={`min-h-screen ${experience.pageClass} ${experience.fontClass}`}>
      <NavbarShell />
      <main
        className={
          isFullWidthTaskSurface
            ? "w-full px-4 py-12 sm:px-6 lg:px-8"
            : "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        }
      >
        <SchemaJsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${taskConfig?.label || task} | ${SITE_CONFIG.name}`,
            url: `${baseUrl}${taskConfig?.route || ""}`,
            hasPart: schemaItems,
          }}
        />

        {experience.key === "radianpark" ? (
          <section className="mb-10 overflow-hidden rounded-[2rem] bg-[#0c0c0c] p-6 text-white lg:p-8">
            {renderHero(
              experience,
              task,
              taskConfig?.label || task,
              taskConfig?.description || "Latest posts",
              normalizedCategory,
              taskConfig?.route || "#",
              posts.length
            )}
            {introSection}
          </section>
        ) : combinedProfileSection ? (
          combinedProfileSection
        ) : combinedImageSharingSection ? (
          combinedImageSharingSection
        ) : (
          <>
            {renderHero(
              experience,
              task,
              taskConfig?.label || task,
              taskConfig?.description || "Latest posts",
              normalizedCategory,
              taskConfig?.route || "#",
              posts.length
            )}
            {introSection ? <div className="mb-10">{introSection}</div> : null}
          </>
        )}

        <TaskListClient task={task} initialPosts={posts} category={normalizedCategory} />
      </main>
      <Footer />
    </div>
  );
}
