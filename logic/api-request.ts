import { Channel, MessageItem, OgpData } from "./types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// HTTP エラー時に投げる例外（ステータスとレスポンスボディを保持）
export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown
  ) {
    super(`HTTP error! status: ${status}`);
    this.name = "ApiError";
  }
}

// 共通リクエスト処理: res.ok でなければ ApiError を投げ、成功時は JSON を返す
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, init);
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, body);
  return body as T;
}

// ---- Channels ----

export const fetchChannels = () => request<Channel[]>("/api/v1/channels");

export const createChannel = (name: string) =>
  request<Channel>("/api/v1/channels", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

export const deleteChannel = (id: number) =>
  request<{ id: number }>(`/api/v1/channels/${id}`, { method: "DELETE" });

// ---- Messages ----

export const fetchMessages = async (channelId: number): Promise<MessageItem[]> => {
  const data = await request<unknown>(`/api/v1/channels/${channelId}/messages`);
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { messages?: unknown }).messages)) {
    return (data as { messages: MessageItem[] }).messages;
  }
  console.error("Received non-array data:", data);
  return [];
};

// formData: content / type / images[] / tags[] を含む multipart データ
export const createMessage = (channelId: number, formData: FormData) =>
  request<MessageItem>(`/api/v1/channels/${channelId}/messages`, {
    method: "POST",
    body: formData,
  });

export const deleteMessage = (channelId: number, id: number) =>
  request<{ id: number }>(`/api/v1/channels/${channelId}/messages/${id}`, {
    method: "DELETE",
  });

// ---- OGP ----

export const fetchOgp = (url: string, signal?: AbortSignal) =>
  request<OgpData>(`/api/v1/ogp?url=${encodeURIComponent(url)}`, { signal });
