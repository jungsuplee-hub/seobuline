"use client";

import { useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSupabaseBrowserClient } from "@/lib/supabase";

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
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return setError(error.message);
    if (data.user) {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: data.user.id, email, region, nickname }),
      });
    }
    router.push("/login");
  };

  return (
    <Card className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold">회원가입</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" required minLength={8} />
        <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="지역정보(예: 은평구)" required />
        <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임(선택)" />
        {error && <p className="text-sm text-red-300">{error}</p>}
        <Button type="submit" className="w-full">가입하기</Button>
      </form>
    </Card>
  );
}
