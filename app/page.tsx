"use client";

import { useState } from "react";

// 型定義をしておくと今後のRails連携（API）で型安全になります
interface Channel {
  id: number;
  name: string;
}

interface MessageItem {
  id: number;
  channelId: number; // どのチャンネルに属しているか
  type: "text" | "image";
  content: string;
  url?: string;
  time: string;
}

export default function Home() {
  // 1. チャンネルのデータもStateで管理（将来的にRailsからGETする）
  const [channels, setChannels] = useState<Channel[]>([
    { id: 1, name: "全般・画像保存" },
    { id: 2, name: "テキストメモ" },
  ]);
  
  // 現在選択されているチャンネルのID
  const [activeChannelId, setActiveChannelId] = useState<number>(1);

  // 2. メッセージに「channelId」を持たせる
  const [items, setItems] = useState<MessageItem[]>( [
    { id: 1, channelId: 1, type: "text", content: "7月のバイト代でラズパイ5買うぞ！💪", time: "12:34" },
    { id: 2, channelId: 1, type: "image", content: "聖女様のイラスト", url: "https://chunithm.sega.jp/storage/chara/chunithm-sun/illustration/s_others_4.webp?_=20260701.190431", time: "13:00" },
    { id: 3, channelId: 2, type: "text", content: "ここにRailsのAPI設計メモを書く予定", time: "15:00" },
  ]);

  const [inputText, setInputText] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // チャンネル作成のモック関数（今日のノルマ用！）
  const handleCreateChannel = () => {
    const name = prompt("新しいチャンネル名を入力してください");
    if (!name?.trim()) return;
    setChannels([...channels, { id: Date.now(), name: name.trim() }]);
  };

  // メッセージ削除処理（モック）
  const handleDeleteMessage = (id: number) => {
    if (confirm("メッセージを削除しますか？")) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    setItems([
      ...items,
      {
        id: Date.now(),
        channelId: activeChannelId, // 現在のチャンネルIDを紐付ける！
        type: "text",
        content: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputText("");
  };

  // 現在アクティブなチャンネルオブジェクトを取得
  const currentChannel = channels.find(c => c.id === activeChannelId);

  // 現在のチャンネルに紐づくメッセージだけを抽出（今日のノルマの核心！）
  const filteredItems = items.filter(item => item.channelId === activeChannelId);

  return (
    <div className="flex h-screen bg-[#313338] text-[#dbdee1] font-sans antialiased overflow-hidden relative">
      
      {/* 左側：サイドバー */}
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
            📁 My Storage
            <button className="md:hidden text-[#949ba4] hover:text-white" onClick={() => setIsMenuOpen(false)}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              </svg>
            </button>
          </div>

          {/* チャンネル一覧のループレンダリング */}
          <div className="flex-1 overflow-y-auto space-y-1">
            {channels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => {
                  setActiveChannelId(channel.id);
                  setIsMenuOpen(false); // スマホ用：タップしたらメニューを閉じる
                }}
                className={`px-3 py-2 rounded-md cursor-pointer text-sm font-medium transition ${
                  channel.id === activeChannelId
                    ? "bg-[#404249] text-white"
                    : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
                }`}
              >
                # {channel.name}
              </div>
            ))}
          </div>

          {/* チャンネル作成ボタン */}
          <button 
            onClick={handleCreateChannel}
            className="w-full py-2 bg-[#248046] hover:bg-[#1a6535] text-white text-xs font-semibold rounded transition-all mt-auto"
          >
            + チャンネルを作成
          </button>
        </div>
      </div>

      {/* 右側：メイン画面 */}
      <div className="flex flex-col flex-1 bg-[#313338]">
        {/* ヘッダー */}
        <div className="h-12 border-b border-[#1f2023] flex items-center px-2 md:px-4 font-bold text-white shadow-sm shrink-0">
          <button className="md:hidden p-2 text-[#949ba4] hover:text-white mr-1" onClick={() => setIsMenuOpen(true)}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16a1 1 0 010 2H4a1 1 0 010-2zM4 12h16a1 1 0 010 2H4a1 1 0 010-2zM4 18h16a1 1 0 010 2H4a1 1 0 010-2z" />
            </svg>
          </button>
          <span className="text-[#80848e] mr-2">#</span> {currentChannel?.name}
        </div>

        {/* メッセージ表示エリア（フィルター済みの配列を表示） */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="relative flex flex-col space-y-1 hover:bg-[#2e3035] -mx-4 px-4 py-1 transition group">
              <div className="flex items-baseline space-x-2">
                <span className="font-semibold text-white text-sm cursor-pointer hover:underline">
                  kei5ot
                </span>
                <span className="text-[10px] text-[#949ba4]">{item.time}</span>
              </div>
              
              {item.type === "text" ? (
                <p className="text-sm text-[#dbdee1] leading-relaxed whitespace-pre-wrap">{item.content}</p>
              ) : (
                <div className="mt-2 max-w-[95%] md:max-w-sm rounded-md overflow-hidden border border-[#2b2d31] bg-[#2b2d31]">
                  <img src={item.url} alt={item.content} className="w-full h-auto object-cover" />
                  <div className="p-2 text-xs text-[#949ba4]">{item.content}</div>
                </div>
              )}
              
              <button 
                onClick={() => handleDeleteMessage(item.id)} 
                className="absolute top-0 right-0 m-2 px-2 py-1 text-xs text-[#dbdee1] bg-[#313338] border border-[#232428] rounded shadow-md hover:bg-[#404249] hover:text-red-400 transition-all cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                削除
              </button>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="text-sm text-[#80848e] italic text-center pt-8">
              メッセージはまだありません。最初のメッセージを送信してみましょう！
            </div>
          )}
        </div>

        {/* 入力フォーム */}
        <div className="p-6 bg-[#313338] shrink-0">
          <div className="flex items-center bg-[#383a40] rounded-xl px-5 py-4 space-x-4">
            <label className="cursor-pointer text-[#b5bac1] hover:text-[#dbdee1] transition p-1">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z" />
              </svg>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={() => alert("ここに画像アップロード処理を実装するよ！")} 
              />
            </label>

            <input
              type="text"
              placeholder={`# ${currentChannel?.name} へのメッセージ`}
              className="bg-transparent flex-1 focus:outline-none text-base text-[#dbdee1] placeholder-[#80848e] font-medium"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={!inputText.trim()} // 入力が空の時は押せないようにする（親切設計）
              className={`
                p-2 rounded-lg transition-all duration-200 cursor-pointer shrink-0
                ${inputText.trim() 
                  ? "text-[#23a55a] hover:bg-[#23a55a]/10 hover:scale-105 active:scale-95" 
                  : "text-[#4e5058] cursor-not-allowed"
                }
              `}
            >
              {/* 紙飛行機（送信）のスタイリッシュなSVGアイコン */}
              <svg className="w-6 h-6 transform rotate-45 -translate-x-0.5 translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}