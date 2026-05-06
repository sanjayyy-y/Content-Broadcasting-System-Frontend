"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageWrapper } from "@/components/common/PageWrapper";
import { ContentCard } from "@/components/content/ContentCard";
import { PreviewModal } from "@/components/content/PreviewModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useContent } from "@/hooks/useContent";

const rejectSchema = z.object({
  reason: z.string().min(10, "Reason must be at least 10 characters")
});

export default function ApprovalsPage() {
  const { pending, loading, error, fetchPendingContent, approve, reject } = useContent();
  const [selected, setSelected] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(rejectSchema),
    defaultValues: { reason: "" }
  });

  useEffect(() => {
    fetchPendingContent();
  }, [fetchPendingContent]);

  const handleApprove = useCallback(async (id) => {
    try {
      await approve(id);
      toast({ title: "Approved", description: "Content is ready for broadcast." });
    } catch (err) {
      toast({ title: "Approval failed", description: err.message, variant: "error" });
    }
  }, [approve]);

  const onReject = async (values) => {
    try {
      await reject(selected.id, values.reason);
      toast({ title: "Rejected", description: "Teacher will see the rejection reason." });
      setSelected(null);
      reset();
    } catch (err) {
      toast({ title: "Rejection failed", description: err.message, variant: "error" });
    }
  };

  return (
    <PageWrapper title="Pending Approvals" description="Review teacher uploads before they appear on public displays.">
      {loading ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-96" />)}</div> : null}
      {!loading && error ? <Card><CardContent className="p-6 text-red-600">{error}</CardContent></Card> : null}
      {!loading && !error && pending.length === 0 ? <Card><CardContent className="p-8 text-center text-muted-foreground">All caught up! No pending approvals</CardContent></Card> : null}
      {!loading && !error && pending.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pending.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onPreview={setPreviewItem}
              actions={
                <>
                  <Button size="sm" onClick={() => handleApprove(item.id)}><Check className="h-4 w-4" />Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => setSelected(item)}><X className="h-4 w-4" />Reject</Button>
                </>
              }
            />
          ))}
        </div>
      ) : null}
      <PreviewModal item={previewItem} open={Boolean(previewItem)} onOpenChange={(open) => !open && setPreviewItem(null)} />
      <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject content</DialogTitle>
            <DialogDescription>Provide a clear reason so the teacher can fix and resubmit.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit(onReject)}>
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection reason</Label>
              <Textarea id="reason" {...register("reason")} />
              {errors.reason ? <p className="text-sm text-red-600">{errors.reason.message}</p> : null}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
              <Button type="submit" variant="destructive" disabled={isSubmitting}>{isSubmitting ? "Rejecting..." : "Reject content"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
