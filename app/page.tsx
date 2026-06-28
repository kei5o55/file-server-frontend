"use client";

import { useState } from "react";

export default function Home() {
  // メモや画像のダミーデータ（後でRails APIと繋ぐ部分）
  const [items, setItems] = useState([
    { id: 1, type: "text", content: "7月のバイト代でラズパイ5買うぞ！💪", time: "12:34" },
    { id: 2, type: "image", content: "聖女様のイラスト", url: "https://via.placeholder.com/400x300", time: "13:00" },
  ]);

  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;
    setItems([
      ...items,
      {
        id: Date.now(),
        type: "text",
        content: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputText("");
  };

  return (
    <div className="flex h-screen bg-[#313338] text-[#dbdee1] font-sans antialiased">
      {/* 1. 左側：サーバー/チャンネルリスト（PCのみ表示、スマホでは隠す） */}
      <div className="hidden md:flex flex-col w-60 bg-[#2b2d31] p-3 space-y-2">
        <div className="font-bold text-white border-b border-[#1f2023] pb-3 mb-2 px-2">
          📁 My Storage
        </div>
        <div className="bg-[#404249] text-white px-3 py-2 rounded-md cursor-pointer text-sm font-medium">
          # 📥 全般・画像保存
        </div>
        <div className="hover:bg-[#35373c] px-3 py-2 rounded-md cursor-pointer text-sm text-[#949ba4] font-medium transition">
          # 📝 テキストメモ
        </div>
      </div>

      {/* 2. 右側：メインのチャット・タイムライン画面 */}
      <div className="flex flex-col flex-1 bg-[#313338]">
        {/* ヘッダー */}
        <div className="h-12 border-b border-[#1f2023] flex items-center px-4 font-bold text-white shadow-sm">
          <span className="text-[#80848e] mr-2">#</span> 📥 全般・画像保存
        </div>

        {/* メッセージ表示エリア（スクロール可能） */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col space-y-1 hover:bg-[#2e3035] -mx-4 px-4 py-1 transition group">
              <div className="flex items-baseline space-x-2">
                <span className="font-semibold text-white text-sm cursor-pointer hover:underline">
                  kei5ot
                </span>
                <span className="text-[10px] text-[#949ba4]">{item.time}</span>
              </div>
              
              {item.type === "text" ? (
                <p className="text-sm text-[#dbdee1] leading-relaxed whitespace-pre-wrap">{item.content}</p>
              ) : (
                <div className="mt-2 max-w-sm rounded-md overflow-hidden border border-[#2b2d31] bg-[#2b2d31]">
                  {/* ダミー画像。後でActive StorageのURLに差し替える */}
                  <img src={item.url} alt={item.content} className="w-full h-auto object-cover" />
                  <div className="p-2 text-xs text-[#949ba4]">{item.content}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 入力フォーム（最下部に固定） */}
        <div className="p-4 bg-[#313338]">
          <div className="flex items-center bg-[#383a40] rounded-lg px-4 py-2.5 space-x-3">
            {/* ファイル添付ボタン */}
            <label className="cursor-pointer text-[#b5bac1] hover:text-[#dbdee1] transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z" />
              </svg>
              <input type="file" className="hidden" accept="image/*" onChange={() => alert("ここに画像アップロード処理を実装するよ！")} />
            </label>

            {/* テキスト入力 */}
            <input
              type="text"
              placeholder="# 📥 全般・画像保存 へのメッセージ"
              className="bg-transparent flex-1 focus:outline-none text-sm text-[#dbdee1] placeholder-[#80848e]"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}