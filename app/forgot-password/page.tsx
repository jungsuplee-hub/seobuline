"use client";

import { useState } from "react";
import type React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setResetLink(null);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "초기화 요청에 실패했습니다.");
      return;
    }

    setMessage(data.message || "비밀번호 초기화 링크가 생성되었습니다.");
    setResetLink(data.resetLink || null);
  };

  return (
    <Card className="mx-auto max-w-lg border-[#d0a453]/40 bg-[#111824]">
      <h1 className="text-2xl font-bold">비밀번호 초기화</h1>
      <p className="mt-1 text-sm text-[#dccdaf]">요청이 성공하면 운영 도메인 기준의 비밀번호 재설정 링크가 표시됩니다.</p>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="가입한 이메일" required />
        {error && <p className="text-sm text-red-300">{error}</p>}
        {message && <p className="text-sm text-emerald-300">{message}</p>}
        {resetLink && (
          <p className="break-all text-sm">
            재설정 링크: <a className="underline" href={resetLink}>{resetLink}</a>
          </p>
        )}
        <Button type="submit" className="w-full">초기화 링크 생성</Button>
      </form>
    </Card>
  );
}
