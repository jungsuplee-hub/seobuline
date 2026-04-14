import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header } from "@/components/layout";

export const metadata: Metadata = {
  title: "서부선 정상화 추진위원회 | 공개 출처 기반 주민 아카이브",
  description:
    "서부선 정상화 추진위원회가 운영하는 공개 출처 기반 정보 아카이브. 진행현황, 뉴스, 정치인 정보, 주민 참여 채널을 제공합니다.",
  openGraph: {
    title: "서부선 정상화 추진위원회",
    description: "서부권 철도교통 핵심축 서부선의 추진현황과 시민 참여 정보를 공개 출처로 제공합니다.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "서부선 정상화 추진위원회",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main className="container-width py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
