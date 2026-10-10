export interface Channel {
  id: number;
  name: string;
}

export interface MessageItem {
  id: number;
  channelId: number; // どのチャンネルに属しているか
  type: "text" | "image";
  content: string;
  url?: string;    // 後方互換（バックエンドからの単一画像）
  urls?: string[]; // 複数画像URL（最大4枚）
  time: string;
  tags?: string[]; //複数タグを保持する配列
  isEdited?:boolean;
}
