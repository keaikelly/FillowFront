// 플랜 UI 컴포넌트
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { Check } from "lucide-react"; //체크아이콘

// props '타입' 정의
type PlanStepProps = {
  // 현재 선택된 플랜 (없으면 null)
  selectedPlan: string | null; //선택한 플랜
  onPlanSelect: (planName: string) => void; // 선택버튼 눌렀을 때 부모 함수 실행되도록 연결
};

// 플랜 선택 UI 컴포넌트
export default function PlanStep(
  { selectedPlan, onPlanSelect }: PlanStepProps //props 타입연결
) {
  return (
    // animate-in ...      : 페이지 진입 애니메이션
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4 py-10">
        <h2 className="text-5xl font-bold text-balance">
          사업의 규모에 맞는
          <br />
          최적의 플랜을 선택하세요
        </h2>

        {/* 설명 문구 */}
        <p className="text-xl text-muted-foreground text-pretty mx-auto">
          Financial Flow와 함께 가격 실수를 막고 마진을 확보하세요
        </p>
      </div>

      {/* 플랜 카드 3개 레이아웃 (3열 grid) */}
      <div className="grid md:grid-cols-3 gap-7 max-w-6xl mx-auto">
        {}
        {/* ================= 1️⃣ Standard 플랜 ================= */}
        <Card className="relative hover:shadow-xl transition-all duration-300 border-2 hover:border-muted-foreground/20">
          {/* 카드 상단 (제목, 가격) */}
          <CardHeader className="space-y-4 pb-8">
            <div className="space-y-2">
              <CardTitle className="text-2xl">Standard</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">₩39,000</span>
                <span className="text-muted-foreground">/월</span>
              </div>
            </div>

            <CardDescription className="text-base">
              수익구조 확인을 위한 필수 엔진
            </CardDescription>
          </CardHeader>

          {/* 카드 내용 (기능 목록 + 선택 버튼) */}
          <CardContent className="space-y-6">
            {/* 기능 목록 */}
            <ul className="space-y-3">
              {[
                "최대 3개 제품 관리",
                "기본 유닛 이코노믹스 구조 분석",
                "국세청 장부 업로드용 엑셀 제공",
              ].map((text) => (
                <li key={text} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <button
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-border bg-transparent hover:bg-muted h-11 px-8"
              onClick={() => onPlanSelect("starter")}
            >
              {/* 현재 선택된 플랜이면 상태 표시 */}
              {selectedPlan === "standard" ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  선택됨
                </>
              ) : (
                "선택하기"
              )}
            </button>
          </CardContent>
        </Card>

        {/* ================= 2️⃣ Pro 플랜 (추천) ================= */}
        {/* transition-all 호버될때 부드럽게 */}
        <Card className="relative hover:shadow-2xl transition-all duration-300 border-2 border-primary shadow-lg scale-105">
          {/* 추천 배지 */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
            가장 인기
          </div>

          <CardHeader className="space-y-4 pb-8 pt-8">
            <div className="space-y-2">
              <CardTitle className="text-2xl">Pro</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">₩89,000</span>
                <span className="text-muted-foreground">/월</span>
              </div>
            </div>

            <CardDescription className="text-base">
              AI가 찾아주는 가장 안전한 가격
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {[
                "최대 15개 제품 관리",
                "AI 기반 비용 최적화",
                "국세청 장부 업로드용 엑셀 제공",
              ].map((text) => (
                <li key={text} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <button
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
              onClick={() => onPlanSelect("core")}
            >
              {selectedPlan === "core" ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  선택됨
                </>
              ) : (
                "선택하기"
              )}
            </button>
          </CardContent>
        </Card>

        {/* ================= 3️⃣ Extension 플랜 ================= */}
        <Card className="relative hover:shadow-xl transition-all duration-300 border-2 hover:border-muted-foreground/20">
          <CardHeader className="space-y-4 pb-8">
            <div className="space-y-2">
              <CardTitle className="text-2xl">Extension</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">₩179,000</span>
                <span className="text-muted-foreground">/월</span>
              </div>
            </div>

            <CardDescription className="text-base">
              전문적인 가격 최적화 전략
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {[
                "무제한 제품 관리",
                "고급 AI 전략 분석 및 시뮬레이션",
                "국세청 업로드 연동",
              ].map((text) => (
                <li key={text} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <button
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-border bg-transparent hover:bg-muted h-11 px-8"
              onClick={() => onPlanSelect("pro")}
            >
              {selectedPlan === "pro" ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  선택됨
                </>
              ) : (
                "선택하기"
              )}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
