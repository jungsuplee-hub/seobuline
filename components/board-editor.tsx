"use client";

import { useState } from "react";

type Props = {
  mode: "new" | "edit";
  action: string;
  submitLabel: string;
  defaultValue?: {
    title?: string;
    category?: string;
    region?: string;
    content?: string;
    imageUrls?: string[];
  };
};

export default function BoardEditor({ mode, action, submitLabel, defaultValue }: Props) {
  const [content, setContent] = useState(() => (defaultValue?.content || "").replace(/^!\[[^\]]*\]\(\/uploads\/[^)\s]+\)\s*$/gm, "").trim());
  const [imageUrls, setImageUrls] = useState<string[]>(defaultValue?.imageUrls || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("scope", "posts");
    const res = await fetch("/api/uploads", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "업로드 실패");
    return data.url as string;
  }

  async function handleFileInput(files: FileList | null) {
    if (!files?.length) return;
    try {
      setError(null);
      setUploading(true);
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await upload(file));
      }
      setImageUrls((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
    }
  }

  async function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const images = Array.from(e.clipboardData.items)
      .map((item) => (item.kind === "file" ? item.getAsFile() : null))
      .filter((file): file is File => Boolean(file && file.type.startsWith("image/")));

    if (!images.length) return;

    e.preventDefault();
    try {
      setError(null);
      setUploading(true);
      const urls: string[] = [];
      for (const image of images) {
        urls.push(await upload(image));
      }
      setImageUrls((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "붙여넣기 업로드 실패");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} method="post" className="mt-4 space-y-3">
      {mode === "edit" && <input type="hidden" name="_method" value="PATCH" />}
      <select name="category" defaultValue={defaultValue?.category || "자유게시판"} required>
        <option value="자유게시판">자유게시판</option>
        <option value="지역제보">지역제보</option>
        <option value="질문답변">질문답변</option>
      </select>
      <input name="title" placeholder="제목" required maxLength={120} defaultValue={defaultValue?.title || ""} />
      <input name="region" placeholder="지역(선택)" maxLength={30} defaultValue={defaultValue?.region || ""} />
      <textarea
        name="content"
        placeholder="내용 (이미지 붙여넣기 Ctrl+V 지원)"
        className="min-h-48 w-full"
        required
        maxLength={5000}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onPaste={handlePaste}
      />
      <div className="space-y-2 rounded-md border border-[#d0a453]/40 p-3">
        <p className="text-xs text-[#d9cbad]">이미지 첨부(여러 장 가능, jpg/png/webp/gif, 10MB 이하)</p>
        <input type="file" accept="image/*" multiple onChange={(e) => handleFileInput(e.target.files)} />
        {uploading && <p className="text-xs text-[#f7d899]">이미지 업로드 중...</p>}
        {error && <p className="text-xs text-red-300">{error}</p>}
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {imageUrls.map((url) => (
            <div key={url} className="relative">
              <img src={url} alt="첨부 이미지" className="h-20 w-full rounded object-cover" />
              <button
                type="button"
                className="absolute right-1 top-1 rounded bg-black/60 px-1 text-xs"
                onClick={() => setImageUrls((prev) => prev.filter((item) => item !== url))}
              >
                제거
              </button>
            </div>
          ))}
        </div>
      </div>
      <input type="hidden" name="image_urls" value={JSON.stringify(imageUrls)} />
      <button className="rounded-md bg-[#d0a453] px-4 py-2 font-semibold text-[#1e1610]">{submitLabel}</button>
    </form>
  );
}
