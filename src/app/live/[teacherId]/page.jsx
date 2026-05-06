"use client";

import { Radio } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLiveFeed } from "@/hooks/useLiveFeed";
import { formatDateTime } from "@/lib/utils";

export default function LivePage({ params }) {
  const { items, loading, error } = useLiveFeed(params.teacherId);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeItem = useMemo(() => {
    if (!items.length) return null;
    return items[activeIndex % items.length];
  }, [items, activeIndex]);

  useEffect(() => {
    if (!activeItem) return;
    const timer = setTimeout(() => setActiveIndex((value) => value + 1), (activeItem.rotationDuration || 10) * 1000);
    return () => clearTimeout(timer);
  }, [activeItem]);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Radio className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold">Live Broadcast</h1>
              <p className="text-sm text-muted-foreground">Teacher feed: {params.teacherId}</p>
            </div>
          </div>
          <StatusBadge status="active" />
        </div>
      </header>
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl place-items-center px-4 py-8">
        {loading ? (
          <div className="w-full max-w-5xl space-y-4">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
          </div>
        ) : null}
        {!loading && error ? <Card className="w-full max-w-lg"><CardContent className="p-8 text-center text-red-600">{error}</CardContent></Card> : null}
        {!loading && !error && !activeItem ? (
          <Card className="w-full max-w-lg"><CardContent className="p-8 text-center text-muted-foreground">No content is currently being broadcast</CardContent></Card>
        ) : null}
        {!loading && !error && activeItem ? (
          <article className="w-full max-w-5xl">
            <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
              <img src={activeItem.fileUrl} alt={activeItem.title} className="aspect-video w-full object-cover" />
              <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <StatusBadge status={activeItem.status} />
                    <StatusBadge status="active" />
                  </div>
                  <h2 className="text-2xl font-semibold">{activeItem.title}</h2>
                  <p className="mt-1 text-muted-foreground">{activeItem.subject}</p>
                </div>
                <p className="text-sm text-muted-foreground">Until {formatDateTime(activeItem.endTime)}</p>
              </div>
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}
