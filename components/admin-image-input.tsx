"use client";

import { useState } from "react";

export default function AdminImageInput({ scope, name, defaultUrl }: { scope: string; name?: string; defaultUrl?: string | null }) {
  const [url, setUrl] = useState(defaultUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPick(file: File) {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("scope", scope);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "업로드 실패");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])} />
      {loading && <p className="text-xs text-[#f7d899]">업로드 중...</p>}
      {error && <p className="text-xs text-red-300">{error}</p>}
      {url && (
        <div className="space-y-2">
          <img src={url} alt="미리보기" className="h-28 w-full rounded object-cover" />
          <button type="button" onClick={() => setUrl("")} className="rounded border px-2 py-1 text-xs">이미지 제거</button>
        </div>
      )}
      <input type="hidden" name={name || "image_url"} value={url} />
    </div>
  );
}
