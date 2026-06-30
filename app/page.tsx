"use client";

import { useState } from "react";

export default function Home() {
  const [items, setItems] = useState([
    { id: 1, type: "text", content: "7月のバイト代でラズパイ5買うぞ！💪", time: "12:34" },
    { id: 2, type: "image", content: "聖女様のイラスト", url: "https://via.placeholder.com/400x300", time: "13:00" },
  ]);

  const [inputText, setInputText] = useState("");
  // スマホ用：メニューの開閉状態を管理
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <div className="flex h-screen bg-[#313338] text-[#dbdee1] font-sans antialiased overflow-hidden relative">
      
      {/* 1. 左側：サーバー/チャンネルリスト（スマホではスライドメニュー化） */}
      <div className={`
        fixed inset-0 z-50 md:relative md:flex md:z-10
        transition-all duration-300 ease-in-out
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* スマホ用：背景を暗くするオーバーレイ */}
        {isMenuOpen && (
          <div className="absolute inset-0 bg-black/50 md:hidden" onClick={() => setIsMenuOpen(false)}></div>
        )}

        <div className="relative flex flex-col w-60 h-full bg-[#2b2d31] p-3 space-y-2 shrink-0">
          <div className="font-bold text-white border-b border-[#1f2023] pb-3 mb-2 px-2 flex justify-between items-center">
            📁 My Storage
            {/* スマホ用：閉じるボタン */}
            <button className="md:hidden text-[#949ba4] hover:text-white" onClick={() => setIsMenuOpen(false)}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              </svg>
            </button>
          </div>
          <div className="bg-[#404249] text-white px-3 py-2 rounded-md cursor-pointer text-sm font-medium">
            # 📥 全般・画像保存
          </div>
          <div className="hover:bg-[#35373c] px-3 py-2 rounded-md cursor-pointer text-sm text-[#949ba4] font-medium transition">
            # 📝 テキストメモ
          </div>
        </div>
      </div>

      {/* 2. 右側：メインのチャット・タイムライン画面 */}
      <div className="flex flex-col flex-1 bg-[#313338]">
        {/* ヘッダー */}
        <div className="h-12 border-b border-[#1f2023] flex items-center px-2 md:px-4 font-bold text-white shadow-sm shrink-0">
          {/* スマホ用：ハンバーガーメニューボタン */}
          <button className="md:hidden p-2 text-[#949ba4] hover:text-white mr-1" onClick={() => setIsMenuOpen(true)}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16a1 1 0 010 2H4a1 1 0 010-2zM4 12h16a1 1 0 010 2H4a1 1 0 010-2zM4 18h16a1 1 0 010 2H4a1 1 0 010-2z" />
            </svg>
          </button>
          <span className="text-[#80848e] mr-2">#</span> 📥 全般・画像保存
        </div>

        {/* メッセージ表示エリア */}
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
                <div className="mt-2 max-w-[95%] md:max-w-sm rounded-md overflow-hidden border border-[#2b2d31] bg-[#2b2d31]">
                  <img src={item.url} alt={item.content} className="w-full h-auto object-cover" />
                  <div className="p-2 text-xs text-[#949ba4]">{item.content}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 入力フォーム（最下部に固定） */}
        <div className="p-6 bg-[#313338] shrink-0">
          <div className="flex items-center bg-[#383a40] rounded-xl px-5 py-4 space-x-4">
            
            {/* ファイル添付ボタン */}
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

            {/* テキスト入力 */}
            <input
              type="text"
              placeholder="# 📥 全般・画像保存 へのメッセージ"
              className="bg-transparent flex-1 focus:outline-none text-base text-[#dbdee1] placeholder-[#80848e] font-medium"
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