"use client";

import { useState } from "react";
import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "로그인에 실패했습니다.");
      return;
    }

    const nextPath = searchParams.get("next");
    window.location.href = nextPath && nextPath.startsWith("/") ? nextPath : "/mypage";
  };

  return (
    <Card className="mx-auto max-w-lg border-[#d0a453]/40 bg-[#111824]">
      <h1 className="text-2xl font-bold">로그인</h1>
      <p className="mt-1 text-sm text-[#dccdaf]">이메일/비밀번호로 로그인 후 게시글을 작성할 수 있습니다.</p>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" required minLength={8} />
        {error && <p className="text-sm text-red-300">{error}</p>}
        <div className="text-right text-sm">
          <Link href="/forgot-password" className="underline hover:text-[#f7d899] focus:text-[#f7d899]">
            비밀번호를 잊으셨나요? 비밀번호 초기화
          </Link>
        </div>
        <Button type="submit" className="w-full">로그인</Button>
      </form>
    </Card>
  );
}
