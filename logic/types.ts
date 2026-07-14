// 型定義をしておくと今後のRails連携（API）で型安全になります
export interface Channel {
  id: number;
  name: string;
}

export interface MessageItem {
  id: number;
  channelId: number; // どのチャンネルに属しているか
  type: "text" | "image";
  content: string;
  url?: string;
  time: string;
}