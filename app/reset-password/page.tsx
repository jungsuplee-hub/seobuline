"use client";

import { useState } from "react";
import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError("토큰이 없습니다. 다시 요청해 주세요.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "비밀번호 재설정에 실패했습니다.");
      return;
    }

    setMessage(data.message || "비밀번호가 재설정되었습니다.");
    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 1200);
  };

  return (
    <Card className="mx-auto max-w-lg border-[#d0a453]/40 bg-[#111824]">
      <h1 className="text-2xl font-bold">새 비밀번호 설정</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="새 비밀번호(8자 이상)" required minLength={8} />
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="새 비밀번호 확인" required minLength={8} />
        {error && <p className="text-sm text-red-300">{error}</p>}
        {message && <p className="text-sm text-emerald-300">{message}</p>}
        <Button type="submit" className="w-full">비밀번호 변경</Button>
      </form>
    </Card>
  );
}
