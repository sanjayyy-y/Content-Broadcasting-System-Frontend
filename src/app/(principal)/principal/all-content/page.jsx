"use client";

import { useEffect, useMemo, useState } from "react";
import { PageWrapper } from "@/components/common/PageWrapper";
import { ContentTable } from "@/components/content/ContentTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useContent } from "@/hooks/useContent";
import { formatDateTime, getScheduleStatus } from "@/lib/utils";

const pageSize = 10;

export default function AllContentPage() {
  const { items, loading, error, fetchAllContent } = useContent();
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAllContent();
  }, [fetchAllContent]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesStatus = status === "all" || item.status === status;
      const matchesSearch = !query || item.title.toLowerCase().includes(query) || item.teacherName.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [items, status, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page]);

  const columns = useMemo(() => [
    { key: "preview", header: "Preview", render: (item) => <img src={item.fileUrl} alt={item.title} className="h-12 w-20 rounded object-cover" /> },
    { key: "title", header: "Title", render: (item) => <div><p className="font-medium">{item.title}</p><p className="text-xs text-muted-foreground">{item.subject}</p></div> },
    { key: "teacherName", header: "Teacher" },
    { key: "status", header: "Status", render: (item) => <div className="flex flex-wrap gap-1"><StatusBadge status={item.status} /><StatusBadge status={getScheduleStatus(item.startTime, item.endTime)} /></div> },
    { key: "startTime", header: "Start", render: (item) => formatDateTime(item.startTime) },
    { key: "endTime", header: "End", render: (item) => formatDateTime(item.endTime) }
  ], []);

  useEffect(() => {
    setPage(1);
  }, [status, search]);

  return (
    <PageWrapper title="All Content" description="Search, filter, and audit every broadcast submission.">
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]">
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title or teacher" />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {loading ? <div className="space-y-3">{Array.from({ length: 10 }).map((_, index) => <Skeleton key={index} className="h-14" />)}</div> : null}
      {!loading && error ? <Card><CardContent className="p-6 text-red-600">{error}</CardContent></Card> : null}
      {!loading && !error && filtered.length === 0 ? <Card><CardContent className="p-8 text-center text-muted-foreground">No content matches your filters.</CardContent></Card> : null}
      {!loading && !error && filtered.length > 0 ? (
        <>
          <ContentTable columns={columns} data={paginated} />
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Page {page} of {totalPages} • {filtered.length} items</p>
            <div className="flex gap-2">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</Button>
              <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</Button>
            </div>
          </div>
        </>
      ) : null}
    </PageWrapper>
  );
}
