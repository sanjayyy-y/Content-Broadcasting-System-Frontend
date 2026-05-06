import { mockContentItems } from "@/lib/mockData";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
let contentStore = [...mockContentItems];

function sortNewest(items) {
  return [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getMyContent(teacherId) {
  await delay(650);
  return sortNewest(contentStore.filter((item) => item.teacherId === teacherId));
}

export async function uploadContent(data) {
  await delay(850);
  const newItem = {
    id: `c${Date.now()}`,
    teacherId: data.teacherId,
    teacherName: data.teacherName,
    title: data.title,
    subject: data.subject,
    description: data.description || "",
    fileUrl: data.fileUrl,
    fileType: data.fileType,
    status: "pending",
    rejectionReason: "",
    startTime: data.startTime,
    endTime: data.endTime,
    rotationDuration: Number(data.rotationDuration || 10),
    createdAt: new Date().toISOString()
  };

  contentStore = [newItem, ...contentStore];
  return newItem;
}

export async function getLiveContent(teacherId) {
  await delay(500);
  const now = new Date();
  return sortNewest(
    contentStore.filter((item) => {
      const start = new Date(item.startTime);
      const end = new Date(item.endTime);
      return item.teacherId === teacherId && item.status === "approved" && start <= now && end >= now;
    })
  );
}

export async function getAllContent() {
  await delay(700);
  return sortNewest(contentStore);
}

export async function getPendingContent() {
  await delay(650);
  return sortNewest(contentStore.filter((item) => item.status === "pending"));
}

export function updateContentStatus(contentId, status, rejectionReason = "") {
  contentStore = contentStore.map((item) =>
    item.id === contentId
      ? {
          ...item,
          status,
          rejectionReason
        }
      : item
  );
  return contentStore.find((item) => item.id === contentId);
}
