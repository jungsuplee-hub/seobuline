import Link from "next/link";

const nav = [
  ["소개", "/introduce"],
  ["진행현황", "/status"],
  ["뉴스", "/news"],
  ["공지", "/notices"],
  ["게시판", "/board"],
  ["정치인정보", "/politicians"],
  ["자료실", "/resources"],
  ["일정", "/events"],
  ["참여", "/join"],
  ["위원회", "/about"],
  ["관리자", "/admin"],
] as const;

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container-width flex flex-wrap items-center justify-between gap-4 py-4">
        <Link href="/" className="text-lg font-bold text-primary">
          서부선 추진위원회
        </Link>
        <nav className="flex flex-wrap gap-3 text-sm">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-primary">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-mutedBg">
      <div className="container-width py-8 text-sm text-slate-600">
        © 2026 서부선 정상화 추진 위원회 · 공개 출처 기반 정보 아카이브 운영
      </div>
    </footer>
  );
}
