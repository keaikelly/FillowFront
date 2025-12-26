"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MainHeader from "@/components/MainHeader";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 로그인 버튼 스피너/비활성화 제어용

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // submit시 기본적으로 새로고침하는거 막기
    if (!loginId || !password) {
      alert("아이디와 비밀번호를 입력하세요.");
      return;
    }

    try {
      setLoading(true); // 로딩 UI
      // TODO: 나중에 실제 로그인 API 연동
      // await login({ loginId, password }); // 비동기 로그인 요청

      window.localStorage.setItem("ff_logged_in", "1"); // 로컬스토리지에 토큰 받음 가정 후 로그인 플래그 저장
      router.push("/");
    } finally {
      setLoading(false); // 완료 후 로딩 해제
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MainHeader />
      {/* 헤더 높이를 뺀 높이에서 카드가 세로 중앙*/}
      <main className="container mx-auto px-4 py-12 max-w-md flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-6">로그인</h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white rounded-lg border p-6 shadow-sm"
          >
            <div className="space-y-2">
              {/*htmlFor: input의 id와 연결. 
                즉 '아이디' 글자를 누르면 input 칸으로 이동. 
                label 자체가 항목의 이름을 의미*/}
              <label htmlFor="loginId" className="text-sm font-medium">
                아이디
              </label>
              <input
                id="loginId"
                type="text"
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
                placeholder="아이디를 입력하세요"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading} // 로딩 중에는 중복 클릭 방지
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>

            <p className="text-xs text-muted-foreground text-center pt-2">
              아직 계정이 없으신가요?{" "}
              <Link href="/signup" className="underline underline-offset-2">
                회원가입
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
