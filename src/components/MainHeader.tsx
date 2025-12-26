// 공통으로 사용하는 상단 헤더 컴포넌트
"use client";

import Link from "next/link";

// 메인 헤더 컴포넌트
export default function MainHeader() {
  return (
    // header 영역
    // border-b        : 하단 테두리
    // sticky top-0    : 스크롤 시 상단에 고정
    // backdrop-blur~  : 블러 효과, 블러되면 반투명 적용
    // z-50            : 다른 요소 위에 보이도록 z-index 설정
    <header className="border-b sticky top-0 backdrop-blur supports-backdrop-filter:bg-background/60 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* 왼쪽 영역: 로고 + 슬로건 */}
        <Link href="/" className="flex items-center gap-4">
          {/*로고 누르면 첫 페이지 (플랜)*/}
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <div className="border-l pl-4">
            {/*왼쪽 선*/}
            <p className="text-xs text-muted-foreground">
              사업자를 위한 스마트 회계
            </p>
          </div>
        </Link>
        {/* 오른쪽 영역: 로그인 / 회원가입 */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md text-xs font-medium px-3 h-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3"
          >
            회원가입
          </Link>
        </div>
      </div>
    </header>
  );
}
