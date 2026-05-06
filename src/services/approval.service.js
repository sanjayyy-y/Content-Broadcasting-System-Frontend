import { updateContentStatus } from "@/services/content.service";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function approveContent(contentId) {
  await delay(550);
  const updated = updateContentStatus(contentId, "approved", "");
  if (!updated) {
    throw new Error("Content item not found");
  }
  return updated;
}

export async function rejectContent(contentId, reason) {
  await delay(550);
  if (!reason || reason.trim().length < 10) {
    throw new Error("Rejection reason must be at least 10 characters");
  }
  const updated = updateContentStatus(contentId, "rejected", reason.trim());
  if (!updated) {
    throw new Error("Content item not found");
  }
  return updated;
}
