import { Channel } from "../logic/types";

interface ChannnelBarProps {
  channels: Channel[];
  activeChannelId: number|null;//要修正
  setActiveChannelId: (id: number) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onCreateChannel: () => void;
  onDeleteChannel: (id: number) => void;
}

export default function ChannnelBar({
  channels,
  activeChannelId,
  setActiveChannelId,
  isMenuOpen,
  setIsMenuOpen,
  onCreateChannel,
  onDeleteChannel,
}: ChannnelBarProps) {
  return (
    <div className={`
      fixed inset-0 z-50 md:relative md:flex md:z-10
      transition-all duration-300 ease-in-out
      ${isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    `}>
      {isMenuOpen && (
        <div className="absolute inset-0 bg-black/50 md:hidden" onClick={() => setIsMenuOpen(false)}></div>
      )}

      <div className="relative flex flex-col w-60 h-full bg-[#2b2d31] p-3 space-y-2 shrink-0">
        <div className="font-bold text-white border-b border-[#1f2023] pb-3 mb-2 px-2 flex justify-between items-center">
          folder
          <button className="md:hidden text-[#949ba4] hover:text-white" onClick={() => setIsMenuOpen(false)}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {channels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => {
                setActiveChannelId(channel.id);
                setIsMenuOpen(false);
              }}
              className={`group/ch flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm font-medium transition ${
                channel.id === activeChannelId
                  ? "bg-[#404249] text-white"
                  : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
              }`}
            >
              <span className="truncate"># {channel.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChannel(channel.id);
                }}
                className="opacity-0 group-hover/ch:opacity-100 ml-1 p-0.5 rounded hover:bg-red-500/20 hover:text-red-400 text-[#949ba4] transition shrink-0"
                title="チャンネルを削除"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={onCreateChannel}
          className="w-full py-2 bg-[#248046] hover:bg-[#1a6535] text-white text-xs font-semibold rounded transition-all mt-auto"
        >
          + チャンネルを作成
        </button>
      </div>
    </div>
  );
}