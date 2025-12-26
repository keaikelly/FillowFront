"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainHeader from "@/components/MainHeader";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !loginId || !email || !password || !confirm) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    if (password !== confirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);
      // TODO: 나중에 실제 회원가입 API 연동
      // await signup({ name, userId, email, password });
      if (typeof window !== "undefined") {
        window.localStorage.setItem("ff_logged_in", "1");
      }
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MainHeader />
      <main className="container mx-auto px-4 py-12 max-w-md">
        <h1 className="text-2xl font-bold mb-6">회원가입</h1>
        {/* 하나의 묶음으로 제출하기 위한 form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white rounded-lg border p-6 shadow-sm"
        >
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              이름
            </label>
            <input
              id="name"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="userId" className="text-sm font-medium">
              아이디
            </label>
            {/* focus: 선택시 테두리 강조 */}
            <input
              id="userId"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
              placeholder="로그인에 사용할 아이디"
              value={loginId} //입력창에 보이는건 loginId 상태값 (입력값 검증가능)
              onChange={(e) => setLoginId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              이메일
            </label>
            <input
              id="email"
              type="email"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              이메일은 공지·알림을 받는 용도로만 사용됩니다.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
              placeholder="8자 이상 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm" className="text-sm font-medium">
              비밀번호 확인
            </label>
            <input
              id="confirm"
              type="password"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
              placeholder="비밀번호를 다시 입력하세요"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
          >
            {loading ? "가입 중..." : "가입하기"}
          </button>

          <p className="text-xs text-muted-foreground text-center pt-2">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="underline underline-offset-2">
              로그인
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
