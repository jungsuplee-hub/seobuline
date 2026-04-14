"use client";

import { useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, region, nickname }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "회원가입에 실패했습니다.");
      return;
    }

    router.push("/mypage");
    router.refresh();
  };

  return (
    <Card className="mx-auto max-w-lg border-[#d0a453]/40 bg-[#111824]">
      <h1 className="text-2xl font-bold">회원가입</h1>
      <p className="mt-1 text-sm text-[#dccdaf]">가입 후 바로 로그인 상태로 전환됩니다.</p>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호(8자 이상)" required minLength={8} />
        <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="지역정보(예: 은평구)" required />
        <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임(선택)" />
        {error && <p className="text-sm text-red-300">{error}</p>}
        <Button type="submit" className="w-full">가입하기</Button>
      </form>
    </Card>
  );
}
