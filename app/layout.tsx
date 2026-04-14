import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header } from "@/components/layout";

export const metadata: Metadata = {
  title: "서부선 추진위원회",
  description:
    "서울 경전철 서부선(새절역~서울대입구역) 사업의 진행현황, 뉴스, 공개자료를 출처와 기준일과 함께 제공하는 주민 정보 아카이브",
  openGraph: {
    title: "서부선 추진위원회",
    description:
      "서부선 도시철도 사업의 추진 경과와 공개 발언·보도자료·공식문서를 출처 기반으로 정리한 아카이브",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "서부선 추진위원회",
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
