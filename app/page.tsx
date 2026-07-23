"use client";

import { useState, useRef } from "react";
import ChannnelBar from "../components/channnelbar";
import MessageArea from "../components/messagearea";
import PictureBar from "../components/picturebar";
import { Channel, MessageItem } from "../logic/types";

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([
    { id: 1, name: "全般・画像保存" },
    { id: 2, name: "テキストメモ" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChannelId, setActiveChannelId] = useState<number>(1);
  const [isImageSidebarOpen, setIsImageSidebarOpen] = useState(false);
  const [items, setItems] = useState<MessageItem[]>([
    { id: 1, channelId: 1, type: "text", content: "7月のバイト代でラズパイ5買うぞ！💪", time: "12:34" },
    { id: 2, channelId: 1, type: "image", content: "聖女様のイラスト", url: "https://chunithm.sega.jp/storage/chara/chunithm-sun/illustration/s_others_4.webp?_=20260701.190431", time: "13:00" },
    {id:4,channelId: 1,type:"image",content:"ノワさんのイラスト",url:"https://chunithm.sega.jp/storage/chara/chunithm-mate/illustration/m_3.webp",time:"11:88"},
    { id: 3, channelId: 2, type: "text", content: "ここにRailsのAPI設計メモを書く予定", time: "15:00" },
  ]);
  const [inputText, setInputText] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 🔴 page.tsx 内の State 定義に追加
  const [attachedImage, setAttachedImage] = useState<{ url: string; name: string } | null>(null);
  

  // チャンネル作成のモック
  const handleCreateChannel = () => {
    const name = prompt("新しいチャンネル名を入力してください");
    if (!name?.trim()) return;
    setChannels([...channels, { id: Date.now(), name: name.trim() }]);
  };

  // メッセージ削除処理
  const handleDeleteMessage = (id: number) => {
    if (confirm("メッセージを削除しますか？")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  // テキストメッセージ送信
  // 🔴 page.tsx の handleSend を修正
  const handleSend = () => {
    // テキストも画像も無ければ送信しない
    if (!inputText.trim() && !attachedImage) return;

    // 1. 画像が添付されている場合は画像メッセージを作成
    if (attachedImage) {
      setItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          channelId: activeChannelId,
          type: "image",
          content: inputText.trim() || attachedImage.name, // テキストがあればそれを、無ければファイル名をキャプションに
          url: attachedImage.url,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } 
    // 2. テキストのみの場合は通常テキストメッセージを作成
    else if (inputText.trim()) {
      setItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          channelId: activeChannelId,
          type: "text",
          content: inputText.trim(),
          url: "",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }

    // 送信後にフォームと添付画像をクリア
    setInputText("");
    setAttachedImage(null);
  };

  // 画像ファイル追加（FileReaderを使ったモック）
  // 🔴 画像ファイルを「送信」せず「一時保存」するように修正
  const uploadImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      // 即時 setItems せず、添付Stateに保持する
      setAttachedImage({
        url: base64Url,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  // 1. ファイル選択（input type="file"）時のハンドラ
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    uploadImageFile(files[0]);
    e.target.value = ""; // 同じファイルを連続で選択できるようにリセット
  };

  // 2. コピペ（Paste）時のハンドラ
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      // 貼り付けられたデータが「画像」かどうかをチェック
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          // デフォルトの貼り付け動作（テキストとしてのペーストなど）を防止
          e.preventDefault();
          uploadImageFile(file);
          break; // 1枚見つかったら処理を抜ける
        }
      }
    }
  };

  const currentChannel = channels.find((c) => c.id === activeChannelId);
  // 1. まず現在のチャンネルで絞り込む
  const filteredItems = items.filter((item) => item.channelId === activeChannelId);

  // 2. さらに検索キーワードに一致するものだけを絞り込む（displayedItemsとする）
  const displayedItems = filteredItems.filter((item) => {
    if (!searchQuery.trim()) return true; // 検索ワードが空なら全部表示
    return item.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // スクロール参照用のrefとスクロール関数
  const messageRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const scrollToMessage = (id: number) => {
    messageRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className="flex h-screen bg-[#313338] text-[#dbdee1] font-sans antialiased overflow-hidden relative">
      {/* 1. 左側：チャンネルバー */}
      <ChannnelBar
        channels={channels}
        activeChannelId={activeChannelId}
        setActiveChannelId={setActiveChannelId}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onCreateChannel={handleCreateChannel}
      />

      {/* 2. 中央：メインメッセージ画面 */}
      <MessageArea
        currentChannel={currentChannel}
        filteredItems={displayedItems} // 👈 ここを displayedItems に変更！
        searchQuery={searchQuery}       // 👈 追加
        setSearchQuery={setSearchQuery} // 👈 追加
        attachedImage={attachedImage}
        onRemoveAttachedImage={() => setAttachedImage(null)}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isImageSidebarOpen={isImageSidebarOpen}
        setIsImageSidebarOpen={setIsImageSidebarOpen}
        inputText={inputText}
        setInputText={setInputText}
        onSend={handleSend}
        onFileChange={handleFileChange}
        onPaste={handlePaste}
        onDeleteMessage={handleDeleteMessage}
        messageRefs={messageRefs}
      />

      {/* 3. 右側：画像一覧バー */}
      <PictureBar
        filteredItems={filteredItems}
        isImageSidebarOpen={isImageSidebarOpen}
        setIsImageSidebarOpen={setIsImageSidebarOpen}
        onScrollToMessage={scrollToMessage}
      />
    </div>
  );
}