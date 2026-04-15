import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

const nav = [
  ["소개", "/introduce"],
  ["진행현황", "/status"],
  ["뉴스", "/news"],
  ["공지", "/notices"],
  ["게시판", "/board"],
  ["예상노선도", "/route-map"],
  ["정치인정보", "/politicians"],
  ["자료실", "/resources"],
] as const;

const KAKAO_OPEN_CHAT = "https://open.kakao.com/o/g9w5KIpi";
const NAVER_CAFE = "https://cafe.naver.com/seobuline1";

const iconClassName =
  "inline-flex h-5 w-5 items-center justify-center rounded-md text-[11px] font-bold leading-none";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-[#d0a453]/20 bg-[#0a0f16]/95 text-[#f5efe5] backdrop-blur">
      <div className="container-width flex flex-wrap items-center justify-between gap-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-[#f7d899]">
          서부선 정상화 추진위원회
        </Link>
        <nav className="flex flex-wrap gap-3 text-sm text-[#eadcc3]">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-[#f7d899]">
              {label}
            </Link>
          ))}
          <a
            href={KAKAO_OPEN_CHAT}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded border border-[#d0a453]/60 px-2 py-1 text-[#f7d899]"
          >
            <span className={iconClassName} style={{ backgroundColor: "#FEE500", color: "#0a0f16" }} aria-hidden>
              K
            </span>
            카카오톡 채팅방 참여하기 ↗
          </a>
          {user ? (
            <>
              <Link href="/mypage" className="hover:text-[#f7d899]">
                마이페이지
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className="hover:text-[#f7d899]">
                  관리자
                </Link>
              )}
              <form action="/api/auth/logout" method="post">
                <button className="hover:text-[#f7d899]" type="submit">
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-[#f7d899]">
                로그인
              </Link>
              <Link href="/signup" className="hover:text-[#f7d899]">
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[#d0a453]/20 bg-[#0d121b] text-sm text-[#d6c5aa]">
      <div className="container-width space-y-2 py-8">
        <p>© 2026 서부선 정상화 추진위원회 · 공개 출처 기반 정보 아카이브</p>
        <Link href="/route-map" className="mr-4 underline">
          예상노선도 보기
        </Link>
        <a href={KAKAO_OPEN_CHAT} target="_blank" rel="noreferrer" className="mr-4 inline-flex items-center gap-2 underline">
          <span className={iconClassName} style={{ backgroundColor: "#FEE500", color: "#0a0f16" }} aria-hidden>
            K
          </span>
          오픈채팅방 바로가기 ↗
        </a>
        <a href={NAVER_CAFE} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 underline">
          <span className={iconClassName} style={{ backgroundColor: "#03C75A", color: "#ffffff" }} aria-hidden>
            N
          </span>
          네이버 카페 바로가기 ↗
        </a>
      </div>
    </footer>
  );
}
