import { requireModeratorOrAdmin } from "@/lib/auth";import { Card } from "@/components/ui/card";
export default async function AdminPage(){await requireModeratorOrAdmin();return <div className="space-y-4"><h1 className="text-2xl font-bold">관리자 페이지</h1><Card>대시보드: 최근 신고/제보/회원 가입 요약</Card><Card>운영 CRUD: 뉴스, 공지, 게시판 신고, 정치인 정보 검수, 자료실, 일정, FAQ, 타임라인</Card></div>;}
