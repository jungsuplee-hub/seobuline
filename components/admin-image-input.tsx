"use client";

import { useState } from "react";

type AdminImageInputProps = {
  scope: string;
  name?: string;
  defaultUrl?: string | null;
  defaultUrls?: string[];
  multiple?: boolean;
  accept?: string;
  currentLabel?: string;
  uploadLabel?: string;
};

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);
}

export default function AdminImageInput({
  scope,
  name,
  defaultUrl,
  defaultUrls,
  multiple = false,
  accept = "image/*",
  currentLabel = "현재 이미지",
  uploadLabel = "새 이미지 업로드 (선택)",
}: AdminImageInputProps) {
  const [currentUrls, setCurrentUrls] = useState<string[]>(
    multiple ? (defaultUrls || []).filter(Boolean) : (defaultUrl ? [defaultUrl] : []),
  );
  const [newUrls, setNewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalUrls = [...currentUrls, ...newUrls];
  const finalValue = multiple ? JSON.stringify(finalUrls) : (newUrls[0] ?? currentUrls[0] ?? "");

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
      if (multiple) {
        setNewUrls((prev) => [...prev, data.url as string]);
      } else {
        setNewUrls([data.url as string]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-md border border-[#d0a453]/30 p-3">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#f7d899]">{currentLabel}</p>
        {currentUrls.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {currentUrls.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer" className="block rounded border border-[#d0a453]/30 p-2 text-xs text-[#cab898]">
                {isImageUrl(url) ? (
                  <img src={url} alt="현재 이미지" className="max-h-[200px] w-full rounded object-contain" />
                ) : (
                  <span className="block truncate">{url.split("/").pop() || "등록 파일 보기"}</span>
                )}
              </a>
            ))}
          </div>
        ) : <p className="text-xs text-[#cab898]">등록된 파일이 없습니다.</p>}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#f7d899]">{uploadLabel}</p>
        <input type="file" accept={accept} onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])} />
        {loading && <p className="text-xs text-[#f7d899]">업로드 중...</p>}
        {error && <p className="text-xs text-red-300">{error}</p>}
      </div>

      {newUrls.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#f7d899]">{multiple ? "새로 추가된 파일" : "새 파일 미리보기"}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {newUrls.map((url, idx) => (
              <div key={url} className="rounded border border-[#d0a453]/30 p-2 text-xs">
                {isImageUrl(url) ? (
                  <img src={url} alt="새 파일 미리보기" className="max-h-[200px] w-full rounded object-contain" />
                ) : (
                  <a href={url} target="_blank" rel="noreferrer" className="block truncate text-[#cab898]">
                    {url.split("/").pop() || "업로드 파일"}
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setNewUrls((prev) => prev.filter((_, i) => i !== idx))}
                  className="mt-2 rounded border px-2 py-1 text-xs"
                >
                  제거
                </button>
              </div>
            ))}
          </div>
          {!multiple && (
            <button type="button" onClick={() => setNewUrls([])} className="rounded border px-2 py-1 text-xs">
              새 파일 취소
            </button>
          )}
        </div>
      )}

      {finalUrls.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setCurrentUrls([]);
            setNewUrls([]);
          }}
          className="rounded border px-2 py-1 text-xs"
        >
          {multiple ? "전체 파일 제거" : "파일 제거"}
        </button>
      )}

      <input type="hidden" name={name || "image_url"} value={finalValue} />
      {multiple && (
        <p className="text-xs text-[#cab898]">
          파일을 계속 추가하면 아래 노선도에 모두 표시됩니다.
        </p>
      )}
    </div>
  );
}
