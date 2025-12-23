// 공통으로 사용하는 상단 헤더 컴포넌트
"use client";

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
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <div className="border-l pl-4">
            {/*왼쪽 선*/}
            <p className="text-xs text-muted-foreground">
              사업자를 위한 스마트 회계
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
