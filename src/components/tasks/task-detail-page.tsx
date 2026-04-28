import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, Mail, MapPin, Phone, Tag } from "lucide-react";
import { ContentImage } from "@/components/shared/content-image";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildPostUrl, fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG, getTaskConfig, type TaskKey } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";
import { TaskImageCarousel } from "@/components/tasks/task-image-carousel";
import { DedupedImageGallery } from "@/components/tasks/deduped-image-gallery";
import { ArticleComments } from "@/components/tasks/article-comments";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { RichContent, formatRichHtml } from "@/components/shared/rich-content";
import { getSiteExperience } from "@/lib/site-experience";

type PostContent = {
  category?: string;
  location?: string;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  description?: string;
  body?: string;
  excerpt?: string;
  author?: string;
  highlights?: string[];
  logo?: string;
  images?: string[];
  latitude?: number | string;
  longitude?: number | string;
};

const isValidImageUrl = (value?: string | null) =>
  typeof value === "string" && (value.startsWith("/") || /^https?:\/\//i.test(value));

const normalizeImageKey = (value: string) =>
  value
    .trim()
    .replace(/[?#].*$/, "")
    .replace(/\/+$/, "")
    .toLowerCase();

const getImageFingerprint = (value: string) => {
  const normalized = normalizeImageKey(value);
  const parts = normalized.split("/");
  const fileName = parts[parts.length - 1] || normalized;
  const withoutExtension = fileName.replace(/\.[a-z0-9]+$/i, "");
  const cleanedStem = withoutExtension
    .replace(/-\d{2,4}x\d{2,4}$/i, "")
    .replace(/[-_](copy|edited|final|new|compressed|large|small|thumb|thumbnail)$/i, "")
    .replace(/[-_]\d+$/i, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleanedStem || withoutExtension || fileName || normalized;
};

const getContent = (post: SitePost): PostContent => {
  const content = post.content && typeof post.content === "object" ? post.content : {};
  return content as PostContent;
};

const formatArticleHtml = (content: PostContent, post: SitePost) => {
  const raw =
    (typeof content.body === "string" && content.body.trim()) ||
    (typeof content.description === "string" && content.description.trim()) ||
    (typeof post.summary === "string" && post.summary.trim()) ||
    "";

  return formatRichHtml(raw, "Details coming soon.");
};

const stripHtml = (value?: string | null) =>
  (value || "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getImageUrls = (post: SitePost, content: PostContent) => {
  const media = Array.isArray(post.media) ? post.media : [];
  const mediaImages = media.map((item) => item?.url).filter((url): url is string => isValidImageUrl(url));
  const contentImages = Array.isArray(content.images)
    ? content.images.filter((url): url is string => isValidImageUrl(url))
    : [];
  const preferredSource = contentImages.length ? contentImages : mediaImages;
  const seen = new Set<string>();
  const merged = preferredSource.filter((url) => {
    const keys = [normalizeImageKey(url), getImageFingerprint(url)];
    const isDuplicate = keys.some((key) => seen.has(key));
    if (isDuplicate) return false;
    keys.forEach((key) => seen.add(key));
    return true;
  });
  if (merged.length) return merged;
  if (isValidImageUrl(content.logo)) return [content.logo as string];
  return ["/placeholder.svg?height=900&width=1400"];
};

function DetailMeta({
  content,
  location,
  website,
  experience,
  category,
  taskLabel,
  imageCount,
  summary,
}: {
  content: PostContent;
  location?: string;
  website?: string;
  experience: ReturnType<typeof getSiteExperience>;
  category: string;
  taskLabel: string;
  imageCount: number;
  summary: string;
}) {
  const hasPrimaryDetails = Boolean(website || content.phone || content.email || location);

  return (
    <div className={`rounded-[1.75rem] p-5 ${experience.softPanelClass}`}>
      <h2 className="text-lg font-semibold text-foreground">Details</h2>
      <div className={`mt-4 space-y-3 text-sm ${experience.mutedClass}`}>
        {website ? (
          <div className="flex items-start gap-2">
            <Globe className="mt-0.5 h-4 w-4" />
            <a href={website} target="_blank" rel="noreferrer" className="break-all text-foreground hover:underline">
              {website}
            </a>
          </div>
        ) : null}
        {content.phone ? (
          <div className="flex items-start gap-2">
            <Phone className="mt-0.5 h-4 w-4" />
            <span>{content.phone}</span>
          </div>
        ) : null}
        {content.email ? (
          <div className="flex items-start gap-2">
            <Mail className="mt-0.5 h-4 w-4" />
            <a href={`mailto:${content.email}`} className="break-all text-foreground hover:underline">
              {content.email}
            </a>
          </div>
        ) : null}
        {location ? (
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4" />
            <span>{location}</span>
          </div>
        ) : null}
        {!hasPrimaryDetails ? (
          <>
            <div className="flex items-start justify-between gap-4 rounded-[1rem] border border-border/60 bg-white/60 px-4 py-3">
              <span className="font-medium text-foreground">Category</span>
              <span>{category}</span>
            </div>
            <div className="flex items-start justify-between gap-4 rounded-[1rem] border border-border/60 bg-white/60 px-4 py-3">
              <span className="font-medium text-foreground">Type</span>
              <span>{taskLabel}</span>
            </div>
            <div className="flex items-start justify-between gap-4 rounded-[1rem] border border-border/60 bg-white/60 px-4 py-3">
              <span className="font-medium text-foreground">Images</span>
              <span>{imageCount}</span>
            </div>
            <div className="rounded-[1rem] border border-border/60 bg-white/60 px-4 py-3">
              <p className="font-medium text-foreground">Summary</p>
              <p className={`mt-2 line-clamp-4 ${experience.mutedClass}`}>{stripHtml(summary)}</p>
            </div>
          </>
        ) : null}
      </div>
      {website ? (
        <Button asChild className={`mt-5 w-full ${experience.buttonClass}`}>
          <a href={website} target="_blank" rel="noreferrer">
            Visit website
          </a>
        </Button>
      ) : null}
    </div>
  );
}

function renderSuggestions(
  experience: ReturnType<typeof getSiteExperience>,
  related: SitePost[],
  task: TaskKey,
  category: string,
  route?: string,
  taskLabel?: string
) {
  if (!related.length) return null;

  if (experience.key === "codepixelmedia" || experience.key === "helloartcity") {
    return (
      <section className="mt-14">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Related work</h2>
          {route ? (
            <Link href={route} className={`text-sm font-semibold ${experience.mutedClass}`}>
              View all
            </Link>
          ) : null}
        </div>
        <div className="flex gap-5 overflow-x-auto pb-2">
          {related.map((item) => (
            <div key={item.id} className="min-w-[280px] max-w-[320px] flex-none">
              <TaskPostCard post={item} href={buildPostUrl(task, item.slug)} taskKey={task} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Fundable-inspired layout for radianpark
  if (experience.key === "radianpark") {
    return (
      <section className="mt-16">
        <div className="mb-8 flex items-end justify-between border-b border-zinc-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Discover more</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Related {taskLabel || task}</h2>
          </div>
          {route ? (
            <Link 
              href={route} 
              className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
            >
              View all
              <span aria-hidden>→</span>
            </Link>
          ) : null}
        </div>
        
        {/* Horizontal scrolling cards - Fundable-inspired */}
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 lg:-mx-0 lg:px-0">
          {related.map((item) => (
            <div key={item.id} className="min-w-[320px] max-w-[380px] flex-none">
              <div className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                <Link href={buildPostUrl(task, item.slug)} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-100">
                    <ContentImage 
                      src={item.media?.[0]?.url || "/placeholder.svg?height=400&width=600"} 
                      alt={item.title} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                      {item.tags?.[0] || category}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-zinc-950 line-clamp-1">{item.title}</h3>
                    <p className="mt-2 text-sm text-zinc-500 line-clamp-2">{item.summary || 'Explore this entry to learn more details.'}</p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Action cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link 
            href={route || '/'} 
            className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition-colors hover:bg-zinc-100"
          >
            <div>
              <p className="text-sm font-semibold text-zinc-950">Browse all {taskLabel || task}</p>
              <p className="text-xs text-zinc-500 mt-1">See the complete collection</p>
            </div>
            <span className="text-zinc-400">→</span>
          </Link>
          <Link 
            href={`/search?q=${encodeURIComponent(category)}`}
            className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition-colors hover:bg-zinc-100"
          >
            <div>
              <p className="text-sm font-semibold text-zinc-950">Explore {category}</p>
              <p className="text-xs text-zinc-500 mt-1">More in this category</p>
            </div>
            <span className="text-zinc-400">→</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-14">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Related work</h2>
        {route ? (
          <Link href={route} className={`text-sm font-semibold ${experience.mutedClass}`}>
            View all
          </Link>
        ) : null}
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {related.map((item) => (
          <TaskPostCard key={item.id} post={item} href={buildPostUrl(task, item.slug)} taskKey={task} />
        ))}
      </div>
      <nav className={`mt-6 rounded-[1.75rem] p-5 ${experience.softPanelClass}`}>
        <p className="text-sm font-semibold text-foreground">More paths</p>
        <ul className="mt-3 space-y-2 text-sm">
          {route ? (
            <li>
              <Link href={route} className="text-primary underline-offset-4 hover:underline">
                Browse all {task}
              </Link>
            </li>
          ) : null}
          <li>
            <Link href={`/search?q=${encodeURIComponent(category)}`} className="text-primary underline-offset-4 hover:underline">
              Search more in {category}
            </Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}

export async function TaskDetailPage({ task, slug }: { task: TaskKey; slug: string }) {
  const taskConfig = getTaskConfig(task);
  const post = await fetchTaskPostBySlug(task, slug);

  if (!post) notFound();

  const content = getContent(post);
  const isArticle = task === "article";
  const isBookmark = task === "sbm" || task === "social";
  const isImageTask = task === "image";
  const category = content.category || post.tags?.[0] || taskConfig?.label || task;
  const description = content.description || post.summary || "Details coming soon.";
  const descriptionHtml = !isArticle ? formatRichHtml(description, "Details coming soon.") : "";
  const articleHtml = isArticle ? formatArticleHtml(content, post) : "";
  const articleSummary = post.summary || (typeof content.excerpt === "string" ? content.excerpt : "") || "";
  const articleAuthor =
    (typeof content.author === "string" && content.author.trim()) || post.authorName || "Editorial Team";
  const articleDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const postTags = Array.isArray(post.tags) ? post.tags.filter((tag) => typeof tag === "string") : [];
  const location = content.address || content.location;
  const images = getImageUrls(post, content);
  const website = content.website;
  const related = (await fetchTaskPosts(task, 6)).filter((item) => item.slug !== post.slug).slice(0, 3);
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const experience = getSiteExperience(SITE_CONFIG.baseUrl);

  const schemaPayload = {
    "@context": "https://schema.org",
    "@type": isArticle ? "Article" : "WebPage",
    name: post.title,
    description: articleSummary || description,
    url: `${baseUrl}${taskConfig?.route || "/posts"}/${post.slug}`,
  };

  const introCard =
    experience.key === "scoreminers"
      ? `${experience.softPanelClass} border-[3px]`
      : experience.softPanelClass;

  return (
    <div className={`min-h-screen ${experience.pageClass} ${experience.fontClass}`}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SchemaJsonLd data={schemaPayload} />
        <Link href={taskConfig?.route || "/"} className={`inline-flex items-center gap-2 text-sm font-semibold ${experience.mutedClass}`}>
          <span aria-hidden>←</span> Back to {taskConfig?.label || "posts"}
        </Link>

        <section className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {!isBookmark ? (
              experience.key === "codepixelmedia" ? (
                <div className={`overflow-hidden rounded-[2rem] ${experience.panelClass}`}>
                  <div className="relative aspect-[16/10]">
                    <ContentImage src={images[0]} alt={post.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${experience.badgeClass}`}>
                        {category}
                      </span>
                      <h1 className="mt-4 text-4xl font-semibold text-white">{post.title}</h1>
                    </div>
                  </div>
                </div>
              ) : experience.key === "radianpark" ? (
                <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_24px_70px_rgba(24,24,27,0.08)]">
                  {/* Hero Image with Overlay - Fundable-inspired */}
                  <div className="relative aspect-[16/9] lg:aspect-[21/9]">
                    <ContentImage src={images[0]} alt={post.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 lg:p-10">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-zinc-950">
                          {category}
                        </span>
                        {location ? (
                          <span className="flex items-center gap-1.5 text-sm text-white/90">
                            <MapPin className="h-4 w-4" />
                            {location}
                          </span>
                        ) : null}
                      </div>
                      <h1 className="mt-4 max-w-3xl text-3xl font-semibold text-white lg:text-4xl xl:text-5xl">
                        {post.title}
                      </h1>
                    </div>
                  </div>

                  {/* Stats Bar - Fundable-inspired horizontal metrics */}
                  <div className="border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 lg:px-10">
                    <div className="flex flex-wrap items-center gap-6 lg:gap-10">
                      {[
                        { label: 'Published', value: articleDate || 'Recently' },
                        { label: 'Category', value: category },
                        { label: 'Views', value: '2.4K' },
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
              ) : experience.key === "helloartcity" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {images.slice(0, 2).map((image, index) => (
                    <div key={`${image}-${index}`} className={`overflow-hidden rounded-[1.75rem] ${experience.panelClass}`}>
                      <div className={`relative ${index === 0 ? "aspect-[4/5]" : "aspect-square"}`}>
                        <ContentImage src={image} alt={`${post.title} ${index + 1}`} fill className="object-cover" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isImageTask ? (
                <div className={`overflow-hidden rounded-[2rem] ${experience.panelClass}`}>
                  <div className="relative aspect-[16/10] w-full">
                    <ContentImage
                      src={images[0]}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className={`overflow-hidden rounded-[2rem] ${experience.panelClass}`}>
                  <TaskImageCarousel images={images} />
                </div>
              )
            ) : null}

            <div className={`rounded-[2rem] p-6 ${experience.panelClass}`}>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="inline-flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  {category}
                </Badge>
                {location ? (
                  <span className={`inline-flex items-center gap-1 text-sm ${experience.mutedClass}`}>
                    <MapPin className="h-4 w-4" />
                    {location}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
                {post.title}
              </h1>

              {isArticle ? (
                <>
                  <p className={`mt-3 text-sm font-medium ${experience.mutedClass}`}>By {articleAuthor}</p>
                  {articleSummary ? <p className={`mt-4 text-sm leading-8 ${experience.mutedClass}`}>{articleSummary}</p> : null}
                  <RichContent html={articleHtml} className="mt-6 leading-8 prose-p:my-5 prose-h2:my-7 prose-h3:my-6" />
                  <div className={`mt-8 rounded-[1.75rem] p-5 ${introCard}`}>
                    <p className="text-sm font-semibold text-foreground">Discussion</p>
                    <div className="mt-4">
                      <ArticleComments slug={post.slug} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <RichContent html={descriptionHtml} className="mt-4 max-w-3xl" />
                  {content.highlights?.length ? (
                    <div className={`mt-6 rounded-[1.75rem] p-5 ${experience.softPanelClass}`}>
                      <p className="text-sm font-semibold text-foreground">Highlights</p>
                      <ul className={`mt-3 space-y-2 text-sm ${experience.mutedClass}`}>
                        {content.highlights.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {isImageTask && images.length > 1 ? (
                    <DedupedImageGallery
                      images={images.slice(1)}
                      title={post.title}
                      cardClassName={`overflow-hidden rounded-[1.5rem] ${experience.softPanelClass}`}
                      excludeSrc={images[0]}
                    />
                  ) : null}
                </>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className={`rounded-[2rem] p-6 ${experience.panelClass}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${experience.mutedClass}`}>
                {experience.label}
              </p>
              <p className="mt-4 text-2xl font-semibold text-foreground">{taskConfig?.label || task}</p>
              <p className={`mt-3 text-sm leading-7 ${experience.mutedClass}`}>
                {experience.heroDescription}
              </p>
            </div>

            <DetailMeta
              content={content}
              location={location}
              website={website}
              experience={experience}
              category={category}
              taskLabel={taskConfig?.label || task}
              imageCount={images.length}
              summary={description}
            />

          </aside>
        </section>

        {renderSuggestions(experience, related, task, category, taskConfig?.route, taskConfig?.label)}
      </main>
      <Footer />
    </div>
  );
}
