import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const KAKAO_OPEN_CHAT = "https://open.kakao.com/o/g9w5KIpi";

export default function JoinPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">참여하기</h1>
      <Card>
        <h2 className="font-semibold">카카오톡 채팅방 참여</h2>
        <p className="mt-2 text-sm">진행현황 공유, 공청회/공지 알림, 주민 네트워크 소통을 오픈채팅방에서 운영합니다.</p>
        <a href={KAKAO_OPEN_CHAT} target="_blank" rel="noreferrer" className="mt-3 inline-block">
          <Button>카카오톡 채팅방 참여하기 ↗</Button>
        </a>
      </Card>
      <Card>
        <h2 className="font-semibold">제보하기</h2>
        <form className="mt-3 space-y-2">
          <input aria-label="이메일" className="w-full" placeholder="email" />
          <input aria-label="지역" className="w-full" placeholder="지역" />
          <textarea aria-label="내용" className="min-h-32 w-full" placeholder="내용" />
          <button className="rounded-md bg-[#d0a453] px-4 py-2 font-semibold text-[#1e1610]">제출</button>
        </form>
      </Card>
    </div>
  );
}
