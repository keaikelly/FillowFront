"use client";
// Next.js App Router에서 이 파일이 Client Component임을 명시
// (useState, onClick 같은 브라우저 상호작용을 쓰기 위함)

import { useRouter, useSearchParams } from "next/navigation";
import MainHeader from "@/components/MainHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// 결제 페이지 컴포넌트
export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") ?? "standard"; //주소에서 plan= 쿼리 파라미터로 구분

  //db 대용 플랜 이름+값 더미
  const planMap: Record<string, { name: string; price: number }> = {
    standard: { name: "Standard", price: 39000 },
    core: { name: "Pro", price: 89000 },
    pro: { name: "Extension", price: 179000 },
  };

  const selectedPlan = planMap[planParam] ?? planMap.standard; //planMap에서 찾고 오류 시 standard

  const handlePayment = () => {
    router.push("/product");
    //추후 실제 결제 로직 연동 예정
  };

  return (
    <div className="min-h-screen bg-white">
      <MainHeader />

      <main className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="space-y-2 text-center mb-10">
          <h1 className="text-3xl font-bold">결제</h1>
          <p className="text-sm text-muted-foreground">
            플랜 선택 후 결제를 완료하세요
          </p>
        </div>

        {/* 좌: 결제 정보 / 우: 플랜 요약 */}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* =========================
              결제 정보 카드 (입력 영역)
              ========================= */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">결제 정보</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* 카드 번호 입력 */}
              <div className="space-y-2">
                <label
                  htmlFor="cardNumber"
                  className="text-sm font-medium text-muted-foreground"
                >
                  카드 번호
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
                />
              </div>

              {/* 카드 소유자 / 만료일 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="cardName"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    카드 소유자
                  </label>
                  <input
                    id="cardName"
                    type="text"
                    placeholder="홍길동"
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="cardExpiry"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    만료일
                  </label>
                  <input
                    id="cardExpiry"
                    type="text"
                    placeholder="MM/YY"
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* CVC / 영수증 이메일 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="cardCvc"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    CVC
                  </label>
                  <input
                    id="cardCvc"
                    type="password"
                    placeholder="***"
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="billingEmail"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    영수증 이메일
                  </label>
                  <input
                    id="billingEmail"
                    type="email"
                    placeholder="example@email.com"
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* 결제 버튼 (실제 결제 로직 없음) */}
              <button
                type="button"
                onClick={handlePayment}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground text-base font-semibold inline-flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90"
              >
                결제 완료하기
              </button>
            </CardContent>
          </Card>

          {/* =========================
              플랜/결제 요약 영역
              ========================= */}
          <div className="space-y-6">
            {/* 선택한 플랜 정보 */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">선택한 플랜</CardTitle>
                <CardDescription>{selectedPlan.name}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>월 요금</span>
                  <span className="font-semibold">
                    ₩{selectedPlan.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>할인</span>
                  <span className="text-muted-foreground">₩0</span>
                </div>

                <div className="border-t pt-4 flex items-center justify-between text-base font-semibold">
                  <span>총 결제 금액</span>
                  <span className="text-primary">
                    ₩{selectedPlan.price.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 결제 관련 안내 문구 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">결제 요약</CardTitle>
                <CardDescription>
                  결제 완료 시 서비스가 즉시 활성화됩니다.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>환불 정책: 결제 후 7일 이내 환불 가능</p>
                <p>다음 결제일: 2025-02-01</p> {/*추후 연동*/}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
