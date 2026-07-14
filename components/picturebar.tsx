import { MessageItem } from "../logic/types";

interface PictureBarProps {
  filteredItems: MessageItem[];
  isImageSidebarOpen: boolean;
  setIsImageSidebarOpen: (open: boolean) => void;
  onScrollToMessage: (id: number) => void;
}

export default function PictureBar({
  filteredItems,
  isImageSidebarOpen,
  setIsImageSidebarOpen,
  onScrollToMessage,
}: PictureBarProps) {
  const images = filteredItems.filter((item) => item.type === "image");

  return (
    <div className={`
      h-full bg-[#2b2d31] border-l border-[#1f2023] flex flex-col shrink-0 transition-all duration-300 ease-in-out
      ${isImageSidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0 overflow-hidden border-l-0"}
    `}>
      {/* 右バーのヘッダー */}
      <div className="h-12 border-b border-[#1f2023] flex items-center justify-between px-4 font-bold text-white shrink-0">
        <div className="flex items-center space-x-2 text-sm">
          <span>🖼️ 保存画像一覧</span>
        </div>
        <button 
          className="text-[#949ba4] hover:text-white transition cursor-pointer"
          onClick={() => setIsImageSidebarOpen(false)}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
        </button>
      </div>

      {/* 画像グリッドエリア */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2 content-start">
        {images.map((item) => (
          <div 
            key={item.id} 
            className="relative aspect-square rounded overflow-hidden border border-[#1f2023] bg-[#313338] group/thumb cursor-pointer hover:border-[#5865f2] transition"
            onClick={() => onScrollToMessage(item.id)}
            title={item.content}
          >
            <img src={item.url} alt={item.content} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition flex items-end p-1">
              <span className="text-[10px] text-[#dbdee1] truncate w-full">{item.content}</span>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-2 text-center text-xs text-[#80848e] italic pt-8">
            画像はありません
          </div>
        )}
      </div>
    </div>
  );
}