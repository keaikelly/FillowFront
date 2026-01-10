// 마진율에 따른 경고 컴포넌트

import type { HTMLAttributes } from "react";

type DivProps = HTMLAttributes<HTMLDivElement>;

export function Alert({ className = "", ...props }: DivProps) {
  return (
    <div
      className={`
        relative w-full rounded-lg border border-border
        bg-card text-card-foreground
        p-4 flex items-start gap-2
        ${className}
      `}
      role="alert" // 접근성: 중요한 알림임을 명시
      {...props} // children, onClick 등 나머지 props 전달
    />
  );
}

/**
 * AlertDescription 컴포넌트
 * - Alert 안에서 실제 설명 텍스트를 담당
 * - 기본 텍스트 크기와 색상을 통일
 * - className으로 색상/강조 커스터마이징 가능
 */
export function AlertDescription({ className = "", ...props }: DivProps) {
  return (
    <div className={`text-sm text-muted-foreground ${className}`} {...props} />
  );
}
