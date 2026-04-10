import { PageShell } from "@/components/shared/page-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { fetchSiteFeed } from "@/lib/site-connector";
import { buildPostUrl, getPostTaskKey } from "@/lib/task-data";
import { getMockPostsForTask } from "@/lib/mock-posts";
import { SITE_CONFIG } from "@/lib/site-config";
import { TaskPostCard } from "@/components/shared/task-post-card";

export const revalidate = 3;

const matchText = (value: string, query: string) =>
  value.toLowerCase().includes(query);

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ");

const compactText = (value: unknown) => {
  if (typeof value !== "string") return "";
  return stripHtml(value).replace(/\s+/g, " ").trim().toLowerCase();
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>;
}) {
  const resolved = (await searchParams) || {};
  const query = (resolved.q || "").trim();
  const normalized = query.toLowerCase();
  const category = (resolved.category || "").trim().toLowerCase();
  const task = (resolved.task || "").trim().toLowerCase();
  const useMaster = resolved.master !== "0";
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster
      ? { fresh: true, category: category || undefined, task: task || undefined }
      : undefined
  );
  const posts =
    feed?.posts?.length
      ? feed.posts
      : useMaster
        ? []
        : SITE_CONFIG.tasks.flatMap((task) => getMockPostsForTask(task.key));

  const filtered = posts.filter((post) => {
    const content = post.content && typeof post.content === "object" ? post.content : {};
    const typeText = compactText((content as any).type);
    if (typeText === "comment") return false;
    const description = compactText((content as any).description);
    const body = compactText((content as any).body);
    const excerpt = compactText((content as any).excerpt);
    const categoryText = compactText((content as any).category);
    const tags = Array.isArray(post.tags) ? post.tags.join(" ") : "";
    const tagsText = compactText(tags);
    const derivedCategory = categoryText || tagsText;
    if (category && !derivedCategory.includes(category)) return false;
    if (task && typeText && typeText !== task) return false;
    if (!normalized.length) return true;
    return (
      matchText(compactText(post.title || ""), normalized) ||
      matchText(compactText(post.summary || ""), normalized) ||
      matchText(description, normalized) ||
      matchText(body, normalized) ||
      matchText(excerpt, normalized) ||
      matchText(tagsText, normalized)
    );
  });

  const results = normalized.length > 0 ? filtered : filtered.slice(0, 24);

  return (
    <PageShell
      title="Search"
      description={
        query
          ? `Results for "${query}"`
          : "Find ideas, creators, and posts across image sharing and profiles."
      }
      actions={
        <form
          action="/search"
          className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
        >
          <input type="hidden" name="master" value="1" />
          {category ? <input type="hidden" name="category" value={category} /> : null}
          {task ? <input type="hidden" name="task" value={task} /> : null}
          <div className="relative flex h-12 w-full min-w-0 items-center rounded-full border border-[#e3e3e3] bg-[#f1f1f1] pl-4 pr-2 transition-colors focus-within:bg-[#ececec] sm:w-80">
            <Search className="pointer-events-none h-5 w-5 shrink-0 text-[#5f5f5f]" aria-hidden />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search ideas, creators, and images"
              className="h-full min-w-0 flex-1 border-0 bg-transparent pl-3 pr-2 text-sm text-[#111] placeholder:text-[#767676] shadow-none focus-visible:ring-0"
            />
          </div>
          <Button
            type="submit"
            className="h-12 shrink-0 rounded-full bg-[#e60023] px-6 text-sm font-semibold text-white hover:bg-[#ad081b]"
          >
            Search
          </Button>
        </form>
      }
    >
      <div className="rounded-3xl border border-[#e3e3e3] bg-white p-5 shadow-sm sm:p-8">
        {results.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {results.map((post) => {
              const task = getPostTaskKey(post);
              const href = task ? buildPostUrl(task, post.slug) : `/posts/${post.slug}`;
              return <TaskPostCard key={post.id} post={post} href={href} />;
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#e3e3e3] bg-[#fafafa] px-6 py-14 text-center">
            <p className="text-sm font-medium text-[#111]">No matching posts yet</p>
            <p className="mt-2 text-sm text-[#767676]">
              Try different keywords or browse image sharing and profiles from the home page.
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
