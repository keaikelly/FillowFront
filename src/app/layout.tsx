// Next.js 전체 앱 공통 레이아웃 정의. 전역 및 메타데이터 관리

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // 구글서버 cdn이 아닌 폰트 파일 다운로드
import "./globals.css"; // 전역 css

// Geist Sans 폰트 설정 (일반 텍스트용)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"], //영어권 문자만 사용
});

// Geist Mono 폰트 설정 (코드용 고정폭 폰트)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 메타데이터
export const metadata: Metadata = {
  // 브라우저 탭 제목
  title: "FILLOW - AI 회계",

  // 검색엔진 / 미리보기용 설명
  description: "[FILLOW] AI 기반 단위경제흐름 계산기 및 회계 서비스",

  icons: {
    icon: [{ url: "/logo.png", type: "image/png", sizes: "any" }],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

// RootLayout 컴포넌트
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Next.js App Router에서는 여기서 <html> 직접 정의
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} // 폰트 적용 및 부드럽게
      >
        {children} {/*페이지 렌더링*/}
      </body>
    </html>
  );
}
