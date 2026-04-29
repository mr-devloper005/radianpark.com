import Link from "next/link";
import { notFound } from "next/navigation";
import { BarChart3, CheckCircle2, Globe, Layers3, Sparkles, Trophy, ArrowRight } from "lucide-react";
import { Footer } from "@/components/shared/footer";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { ContentImage } from "@/components/shared/content-image";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Button } from "@/components/ui/button";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { buildPostUrl, fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { buildPostMetadata, buildTaskMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";
import { getSiteExperience } from "@/lib/site-experience";

export const revalidate = 3;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeRichHtml = (html: string) =>
  html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\shref\s*=\s*(['"])javascript:.*?\1/gi, ' href="#"');

const formatRichHtml = (
  raw?: string | null,
  fallback = "Profile details will appear here once available."
) => {
  const source = typeof raw === "string" ? raw.trim() : "";
  if (!source) return `<p>${escapeHtml(fallback)}</p>`;
  if (/<[a-z][\s\S]*>/i.test(source)) return sanitizeRichHtml(source);
  return source
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.replace(/\n/g, " ").trim())}</p>`)
    .join("");
};

export async function generateStaticParams() {
  const posts = await fetchTaskPosts("profile", 50);
  if (!posts.length) {
    return [{ username: "placeholder" }];
  }
  return posts.map((post) => ({ username: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  try {
    const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
    return post ? await buildPostMetadata("profile", post) : await buildTaskMetadata("profile");
  } catch (error) {
    console.warn("Profile metadata lookup failed", error);
    return await buildTaskMetadata("profile");
  }
}

function renderStats(experience: ReturnType<typeof getSiteExperience>) {
  const stats = [
    { label: "Total tasks", value: "148", icon: Layers3 },
    { label: "Success rate", value: "94%", icon: CheckCircle2 },
    { label: "Level", value: "Expert", icon: Trophy },
  ];

  if (experience.key === "scoreminers") {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="border-[3px] border-slate-950 bg-[#fff5b4] px-4 py-4 shadow-[6px_6px_0_rgba(15,23,42,0.9)]">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-slate-950">
                <Icon className="h-4 w-4" />
                {item.label}
              </div>
              <p className="mt-3 text-3xl font-black uppercase text-slate-950">{item.value}</p>
            </div>
          );
        })}
      </div>
    );
  }

  if (experience.key === "radianpark") {
    return (
      <div className="flex flex-wrap gap-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-3 shadow-sm">
              <Icon className="h-4 w-4 text-zinc-500" />
              <span className="text-sm font-semibold text-zinc-950">{item.value}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">{item.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className={`rounded-[1.5rem] p-4 ${experience.softPanelClass}`}>
            <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] ${experience.mutedClass}`}>
              <Icon className="h-4 w-4" />
              {item.label}
            </div>
            <p className="mt-3 text-3xl font-semibold text-foreground">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
}

export default async function ProfileDetailPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
  if (!post) notFound();

  const content = (post.content || {}) as Record<string, any>;
  const logoUrl = typeof content.logo === "string" ? content.logo : undefined;
  const brandName =
    (content.brandName as string | undefined) ||
    (content.companyName as string | undefined) ||
    (content.name as string | undefined) ||
    post.title;
  const website = content.website as string | undefined;
  const domain = website ? website.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : undefined;
  const description =
    (content.description as string | undefined) ||
    post.summary ||
    "Profile details will appear here once available.";
  const descriptionHtml = formatRichHtml(description);
  const suggestedArticles = await fetchTaskPosts("article", 6);
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const experience = getSiteExperience(SITE_CONFIG.baseUrl);

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Profiles", item: `${baseUrl}/profile` },
      { "@type": "ListItem", position: 3, name: brandName, item: `${baseUrl}/profile/${post.slug}` },
    ],
  };

  const coverUrl =
    typeof content.images?.[0] === "string"
      ? content.images[0]
      : typeof content.logo === "string"
        ? content.logo
        : logoUrl;

  return (
    <div className={`min-h-screen ${experience.pageClass} ${experience.fontClass}`}>
      <NavbarShell />
      <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <SchemaJsonLd data={breadcrumbData} />

        {experience.key === "tynewebdesign" ? (
          <section className={`mx-auto max-w-5xl overflow-hidden rounded-[2.4rem] ${experience.panelClass}`}>
            <div className="relative h-52 sm:h-64">
              {coverUrl ? (
                <ContentImage src={coverUrl} alt={`${brandName} cover`} fill className="object-cover" sizes="100vw" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-sky-100 via-white to-cyan-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
            </div>
            <div className="relative px-6 pb-10 pt-0 md:px-10">
              <div className="-mt-16 flex flex-col items-center gap-6 md:flex-row md:items-end">
                <div className="relative h-32 w-32 overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-xl">
                  {logoUrl ? <ContentImage src={logoUrl} alt={brandName} fill className="object-cover" /> : null}
                </div>
                <div className="min-w-0 flex-1 text-center md:text-left">
                  <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${experience.mutedClass}`}>Floating identity card</p>
                  <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-foreground">{brandName}</h1>
                  {domain ? <p className={`mt-2 text-sm ${experience.mutedClass}`}>{domain}</p> : null}
                </div>
              </div>
              <div className="mt-8 w-full">
                <div className="flex w-full flex-col gap-4 lg:justify-start">
                  <div className={`rounded-[2rem] p-6 ${experience.softPanelClass}`}>
                    <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] ${experience.mutedClass}`}>
                      <BarChart3 className="h-4 w-4" />
                      Profile rhythm
                    </div>
                    <p className="mt-4 text-lg font-semibold text-foreground">{experience.label}</p>
                    <p className={`mt-3 text-sm leading-7 ${experience.mutedClass}`}>
                      Each site now treats the identity card and result sections differently so the jump between domains feels obvious.
                    </p>
                  </div>
                  {website ? (
                    <Button asChild className={`w-full ${experience.buttonClass}`}>
                      <Link href={website} target="_blank" rel="noopener noreferrer">
                        Visit website
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        ) : experience.key === "codepixelmedia" ? (
          <section className="overflow-hidden rounded-[2rem] lg:grid lg:grid-cols-[0.92fr_1.08fr]">
            <div className={`p-8 ${experience.panelClass}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Split profile</p>
              <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-white">{brandName}</h1>
              {domain ? <p className="mt-3 text-sm text-slate-300">{domain}</p> : null}
              <div className="mt-8">{renderStats(experience)}</div>
            </div>
            <div className="grid bg-[#eef3ff] p-8">
              <div className="grid gap-5 rounded-[1.75rem] border border-white bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem]">
                  {coverUrl ? <ContentImage src={coverUrl} alt={`${brandName} cover`} fill className="object-cover" /> : null}
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-[1.5rem] bg-slate-100">
                    {logoUrl ? <ContentImage src={logoUrl} alt={brandName} fill className="object-cover" /> : null}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Task data side</p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">Profile assets and trust signals</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : experience.key === "radianpark" ? (
          <section className="space-y-6">
            {/* Hero Banner - Fundable-inspired with cover image */}
            <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_24px_70px_rgba(24,24,27,0.08)]">
              <div className="relative aspect-[21/9] lg:aspect-[21/7]">
                {coverUrl ? (
                  <ContentImage src={coverUrl} alt={`${brandName} cover`} fill className="object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
                
                {/* Profile info overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-10">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
                    {/* Avatar */}
                    <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl sm:h-32 sm:w-32">
                      {logoUrl ? (
                        <ContentImage src={logoUrl} alt={brandName} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-zinc-100">
                          <span className="text-3xl font-bold text-zinc-400">{brandName.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-950">
                          Verified Profile
                        </span>
                        {domain && (
                          <span className="flex items-center gap-1.5 text-sm text-white/90">
                            <Globe className="h-4 w-4" />
                            {domain}
                          </span>
                        )}
                      </div>
                      <h1 className="mt-3 text-3xl font-semibold text-white lg:text-4xl">{brandName}</h1>
                    </div>
                    
                    {website && (
                      <Button 
                        asChild 
                        className="rounded-full bg-white px-6 text-zinc-950 hover:bg-zinc-100"
                      >
                        <Link href={website} target="_blank" rel="noopener noreferrer">
                          Visit Website
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Bar - Fundable-inspired horizontal metrics */}
              <div className="border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 lg:px-10">
                <div className="flex flex-wrap items-center gap-6 lg:gap-10">
                  {[
                    { label: 'Member since', value: '2023' },
                    { label: 'Location', value: content.location || 'Global' },
                    { label: 'Activity', value: 'Active' },
                  ].map((stat, index) => (
                    <div key={stat.label} className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-950">{stat.value}</span>
                      <span className="text-xs text-zinc-500">{stat.label}</span>
                      {index < 2 && <span className="ml-4 hidden h-4 w-px bg-zinc-200 lg:block" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              {/* Left - About */}
              <div className={`rounded-[2rem] p-6 lg:p-8 ${experience.panelClass}`}>
                <h2 className="text-xl font-semibold text-zinc-950">About</h2>
                <article
                  className="prose mt-4 max-w-none text-zinc-600 prose-p:my-4"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              </div>

              {/* Right - Stats & Links */}
              <div className="space-y-5">
                {renderStats(experience)}
                
                <div className={`rounded-[1.75rem] p-5 ${experience.softPanelClass}`}>
                  <p className="text-sm font-semibold text-zinc-950">Quick links</p>
                  <div className="mt-4 space-y-2">
                    {[
                      { label: 'View all posts', href: '/profile' },
                      { label: 'Contact', href: `/contact` },
                      { label: 'Share profile', href: '#' },
                    ].map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                      >
                        {link.label}
                        <ArrowRight className="h-4 w-4 text-zinc-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className={`rounded-[2.2rem] p-8 ${experience.panelClass}`}>
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div className="space-y-6">
                <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${experience.mutedClass}`}>{experience.heroEyebrow}</p>
                <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">{brandName}</h1>
                {domain ? (
                  <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${experience.softPanelClass}`}>
                    <Globe className="h-4 w-4" />
                    {domain}
                  </div>
                ) : null}
                {renderStats(experience)}
              </div>
              <div className="grid gap-5">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-muted">
                  {coverUrl ? <ContentImage src={coverUrl} alt={`${brandName} cover`} fill className="object-cover" /> : null}
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-[1.75rem] bg-white shadow-lg">
                    {logoUrl ? <ContentImage src={logoUrl} alt={brandName} fill className="object-cover" /> : null}
                  </div>
                  <div className={`rounded-[1.5rem] p-4 ${experience.softPanelClass}`}>
                    <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] ${experience.mutedClass}`}>
                      <Sparkles className="h-4 w-4" />
                      Direct-link identity surface
                    </div>
                    <p className="mt-2 text-sm text-foreground">This profile is built to make the layout shift immediate and unmistakable.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className={`mt-10 ${experience.key === "tynewebdesign" ? "" : "grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"}`}>
          <article
            className={`article-content prose mx-auto max-w-none rounded-[2rem] p-6 prose-p:my-4 prose-a:text-primary prose-a:underline prose-strong:font-semibold ${experience.panelClass}`}
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />

          {experience.key === "tynewebdesign" ? null : (
          <aside className="flex flex-col gap-5 lg:flex-row lg:items-end">
            <div className={`flex-1 rounded-[2rem] p-6 ${experience.softPanelClass}`}>
              <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] ${experience.mutedClass}`}>
                <BarChart3 className="h-4 w-4" />
                Profile rhythm
              </div>
              <p className="mt-4 text-lg font-semibold text-foreground">{experience.label}</p>
              <p className={`mt-3 text-sm leading-7 ${experience.mutedClass}`}>
                Each site now treats the identity card and result sections differently so the jump between domains feels obvious.
              </p>
            </div>

            {website ? (
              <Button asChild className={`w-full lg:w-auto lg:min-w-[220px] ${experience.buttonClass}`}>
                <Link href={website} target="_blank" rel="noopener noreferrer">
                  Visit website
                </Link>
              </Button>
            ) : null}
          </aside>
          )}
        </section>

        {suggestedArticles.length ? (
          <section className="mt-14">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Suggested articles</h2>
              <Link href="/articles" className={`text-sm font-semibold ${experience.mutedClass}`}>
                View all
              </Link>
            </div>

            {experience.key === "codepixelmedia" || experience.key === "helloartcity" ? (
              <div className="flex gap-5 overflow-x-auto pb-2">
                {suggestedArticles.slice(0, 3).map((article) => (
                  <div key={article.id} className="min-w-[280px] max-w-[320px] flex-none">
                    <TaskPostCard post={article} href={buildPostUrl("article", article.slug)} compact />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {suggestedArticles.slice(0, 3).map((article) => (
                  <TaskPostCard
                    key={article.id}
                    post={article}
                    href={buildPostUrl("article", article.slug)}
                    compact
                  />
                ))}
              </div>
            )}
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
