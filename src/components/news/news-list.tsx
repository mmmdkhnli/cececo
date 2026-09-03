"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "relume-icons";
import { calculateReadingMinutes } from "@/lib/reading-time";
import { NewsDatePicker } from "@/components/news/news-date-picker";
import type { BlogPostRow } from "@/db/schema";

type MonthCount = { month: string; count: number };

export function NewsList({
  initialPosts,
  initialHasMore,
  months,
}: {
  initialPosts: BlogPostRow[];
  initialHasMore: boolean;
  months: MonthCount[];
}) {
  const [month, setMonth] = useState<string | null>(null);
  const [posts, setPosts] = useState(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const params = new URLSearchParams({ offset: String(posts.length) });
    if (month) params.set("month", month);
    const res = await fetch(`/api/news?${params}`);
    const data = await res.json();
    setPosts((prev) => [...prev, ...data.posts]);
    setHasMore(data.hasMore);
    setLoading(false);
  }, [loading, hasMore, posts.length, month]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  function selectMonth(next: string | null) {
    setMonth(next);
    setLoading(true);
    const params = new URLSearchParams();
    if (next) params.set("month", next);
    fetch(`/api/news?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setHasMore(data.hasMore);
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="flex flex-col gap-8">
      <NewsDatePicker
        month={month}
        availableMonths={months.map((m) => m.month)}
        onSelectMonth={selectMonth}
      />

      <div>
        {posts.length === 0 ? (
          <p className="text-center text-medium text-neutral">No news posts found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16">
            {posts.map((post) => (
              <Card key={post.id} className="flex size-full flex-col items-center justify-start">
                <Link href={`/news/${post.slug}`} className="w-full">
                  {post.coverImage && (
                    <img src={post.coverImage} alt="" className="aspect-[3/2] size-full object-cover" />
                  )}
                </Link>
                <div className="px-5 py-6 md:p-6">
                  <div className="mb-3 flex w-full items-center justify-start md:mb-4">
                    <Badge className="mr-4">{post.category}</Badge>
                    <p className="inline text-small font-semibold">
                      {calculateReadingMinutes(post.body)} min read
                    </p>
                  </div>
                  <Link className="mb-2 block" href={`/news/${post.slug}`}>
                    <h2 className="text-h5 font-bold">{post.title}</h2>
                  </Link>
                  <p>{post.excerpt}</p>
                  <Button
                    asChild
                    title="Read more"
                    variant="link"
                    size="link"
                    iconRight={<ChevronRight className="text-scheme-text" />}
                    className="mt-5 flex items-center justify-center gap-x-2 md:mt-6"
                  >
                    <Link href={`/news/${post.slug}`}>Read more</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {hasMore && <div ref={sentinelRef} className="h-1" />}
        {loading && <p className="mt-8 text-center text-small text-neutral">Loading...</p>}
      </div>
    </div>
  );
}
