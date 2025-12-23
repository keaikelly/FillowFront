import type { HTMLAttributes } from "react";
type DivProps = HTMLAttributes<HTMLDivElement>;
//TS에서는 <div>안에 className, onClick 등 미리 지정해야 하는데 DivProps로 미리 정의

// Card 컴포넌트
// 실제로는 <div>이지만, 카드 스타일이 기본으로 적용된 래퍼
export function Card({ className = "", ...props }: DivProps) {
  return (
    <div
      // 기본 카드 스타일 + 외부에서 전달된 className 합치기
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props} // 나머지 모든 props(onClick 등) 전달
    />
  );
}

// 카드 상단 영역 (제목, 설명 영역)
export function CardHeader({ className = "", ...props }: DivProps) {
  return (
    <div
      // 세로 방향 정렬 + 내부 여백
      className={`flex flex-col space-y-1.5 p-6 ${className}`}
      {...props}
    />
  );
}

// 카드 제목 컴포넌트. <h3> 태그
export function CardTitle({
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      // 제목용 기본 스타일
      className={`font-semibold leading-none tracking-tight ${className}`}
      // h3가 받을 수 있는 모든 props 전달
      {...props}
    />
  );
}

// 카드 설명 텍스트. 실제 태그는 <p>이지만 div 하위를 재사용
export function CardDescription({ className = "", ...props }: DivProps) {
  return (
    <p
      // 설명용 텍스트 스타일
      className={`text-sm text-muted-foreground ${className}`}
      {...props}
    />
  );
}

// 카드 본문 영역
export function CardContent({ className = "", ...props }: DivProps) {
  return (
    <div
      // p-6: 전체 padding
      // pt-0: 위쪽 padding 제거 (Header와 자연스럽게 붙이기 위함)
      className={`p-6 pt-0 ${className}`}
      {...props}
    />
  );
}
