import type React from "react";import type { Metadata } from "next";import "./globals.css";import { Footer, Header } from "@/components/layout";
export const metadata:Metadata={title:"서부선 추진위원회",description:"서부선 관련 뉴스, 공지, 진행현황, 게시판을 제공하는 주민 정보 플랫폼",openGraph:{title:"서부선 추진위원회",description:"서부선 관련 공개 자료 기반 정보 아카이브",url:process.env.NEXT_PUBLIC_SITE_URL,siteName:"서부선 추진위원회"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body><Header/><main className="container-width py-8">{children}</main><Footer/></body></html>;}
