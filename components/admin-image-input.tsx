"use client";

import { useState } from "react";

export default function AdminImageInput({ scope, name, defaultUrl }: { scope: string; name?: string; defaultUrl?: string | null }) {
  const [currentUrl, setCurrentUrl] = useState(defaultUrl || "");
  const [newUrl, setNewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalUrl = newUrl ?? currentUrl;

  async function onPick(file: File) {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("scope", scope);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const text = await res.text();
      let data: { ok?: boolean; url?: string; error?: string } = {};
      if (text) {
        try {
          data = JSON.parse(text) as { ok?: boolean; url?: string; error?: string };
        } catch {
          throw new Error("업로드 응답을 해석하지 못했습니다.");
        }
      }
      if (!res.ok || !data.url) throw new Error(data.error || "업로드 실패");
      setNewUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-md border border-[#d0a453]/30 p-3">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#f7d899]">현재 이미지</p>
        {currentUrl ? (
          <img src={currentUrl} alt="현재 이미지" className="max-h-[320px] w-full rounded border border-[#d0a453]/30 object-contain" />
        ) : (
          <p className="text-xs text-[#cab898]">등록된 현재 이미지가 없습니다.</p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#f7d899]">새 이미지 업로드 (선택)</p>
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])} />
        {loading && <p className="text-xs text-[#f7d899]">업로드 중...</p>}
        {error && <p className="text-xs text-red-300">{error}</p>}
      </div>

      {newUrl && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#f7d899]">새 이미지 미리보기</p>
          <img src={newUrl} alt="새 이미지 미리보기" className="max-h-[320px] w-full rounded border border-[#d0a453]/30 object-contain" />
          <button type="button" onClick={() => setNewUrl(null)} className="rounded border px-2 py-1 text-xs">
            새 이미지 취소
          </button>
        </div>
      )}

      {finalUrl && (
        <button
          type="button"
          onClick={() => {
            setCurrentUrl("");
            setNewUrl(null);
          }}
          className="rounded border px-2 py-1 text-xs"
        >
          이미지 제거
        </button>
      )}

      <input type="hidden" name={name || "image_url"} value={finalUrl} />
    </div>
  );
}
