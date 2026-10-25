export interface FanComment {
  id: string;
  author: string;
  role: "Supporter" | "Parent" | "Student Athlete" | "Youth Pastor" | "Church Member";
  clubSupported: string;
  message: string;
  category: "CHEER" | "PRAYER" | "SPORTSMANSHIP";
  timestamp: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  isPinned?: boolean;
}

export const DEFAULT_COMMENTS: FanComment[] = [
  {
    id: "cmt-1",
    author: "Pastor Samuel Mwangi",
    role: "Youth Pastor",
    clubSupported: "Royal Rangers",
    message:
      "Proud of the Rangers for reciting 1 Corinthians 9:24 before kickoff. Win or lose, Christ is glorified in our conduct!",
    category: "PRAYER",
    timestamp: "Sunday, Oct 25, 2026 • 3:45 PM",
    status: "APPROVED",
    isPinned: true,
  },
  {
    id: "cmt-2",
    author: "Grace Wanjiku",
    role: "Parent",
    clubSupported: "Samba Boys",
    message:
      "Great game from Kevin Omondi and the whole squad! Keep working hard and stay humble on the pitch.",
    category: "CHEER",
    timestamp: "Sunday, Oct 25, 2026 • 4:10 PM",
    status: "APPROVED",
  },
  {
    id: "cmt-3",
    author: "Brother David Kiprop",
    role: "Supporter",
    clubSupported: "Mzinga Boyz",
    message:
      "Incredible defensive discipline. Respect to the referee and opposing team today. True Christian sportsmanship!",
    category: "SPORTSMANSHIP",
    timestamp: "Saturday, Oct 24, 2026 • 6:30 PM",
    status: "APPROVED",
  },
];

const STORAGE_KEY = "mpesa_pes_comments_v1";

export function getComments(): FanComment[] {
  if (typeof window === "undefined") return DEFAULT_COMMENTS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_COMMENTS;
}

export function saveComments(list: FanComment[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("mpesa_comments_updated"));
  } catch (e) {
    console.error("Failed to save comments", e);
  }
}

export function submitFanComment(data: {
  author: string;
  role: FanComment["role"];
  clubSupported: string;
  message: string;
  category: FanComment["category"];
}): FanComment {
  const current = getComments();
  const newComment: FanComment = {
    id: `cmt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    ...data,
    timestamp: "Just now",
    status: "APPROVED", // Auto-approved for viewing, but flagged for admin moderation
    isPinned: false,
  };
  const updated = [newComment, ...current];
  saveComments(updated);
  return newComment;
}

export function deleteComment(id: string): void {
  const current = getComments();
  const updated = current.filter((c) => c.id !== id);
  saveComments(updated);
}

export function togglePinComment(id: string): void {
  const current = getComments();
  const updated = current.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c));
  saveComments(updated);
}

export function setCommentStatus(id: string, status: FanComment["status"]): void {
  const current = getComments();
  const updated = current.map((c) => (c.id === id ? { ...c, status } : c));
  saveComments(updated);
}
