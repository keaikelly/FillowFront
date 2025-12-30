// 카드 UI 컴포넌트 (레이아웃용)
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { ShoppingCart, Building2 } from "lucide-react"; //아이콘

// 부모로 주는 props 타입 정의
type ChannelStepProps = {
  environment: "online" | "offline";
  platform: string; //온라인일 때 플랫폼
  location: string; //오프라인일 때 매장 위치

  onEnvironmentChange: (env: "online" | "offline") => void; //환경변경시호출
  onPlatformChange: (value: string) => void; // 플랫폼 선택 변경 시 호출
  onLocationChange: (value: string) => void; // 매장 위치 선택 변경 시 호출

  onBack: () => void; // 이전 단계로 돌아가기
  onCalculate: () => void; // 계산 실행 버튼 클릭 시
};

// 판매 채널 선택 단계 컴포넌트
export default function ChannelStep({
  environment,
  platform,
  location,
  onEnvironmentChange,
  onPlatformChange,
  onLocationChange,
  onBack,
  onCalculate,
}: ChannelStepProps) {
  const canCalculate = //버튼 활성화 조건
    (environment === "online" && platform) || // - 온라인: platform이 선택되어 있어야 함
    (environment === "offline" && location); // - 오프라인: location이 선택되어 있어야 함

  return (
    <div className="pt-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 상단 제목 영역 */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold">판매 채널 선택</h2>
        <p className="text-sm text-muted-foreground">
          제품을 판매할 채널을 선택하세요
        </p>
      </div>

      {/* 온/오프 선택 카드 그리드*/}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* 온라인 판매 카드 */}
        <Card
          // 선택된 경우 테두리 강조
          className={`cursor-pointer transition-all rounded-2xl border-2 shadow-sm hover:shadow-lg ${
            environment === "online"
              ? "border-primary bg-orange-50/40"
              : "border-muted"
          }`}
          // 클릭 시 판매 환경을 online으로 변경
          onClick={() => onEnvironmentChange("online")}
        >
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>온라인 (플랫폼)</CardTitle>
            <CardDescription>
              스마트스토어, 쿠팡 등 전자상거래 플랫폼을 통해 판매
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 오프라인 판매 카드 */}
        <Card
          className={`cursor-pointer transition-all rounded-2xl border-2 shadow-sm hover:shadow-lg ${
            environment === "offline"
              ? "border-primary bg-orange-50/40"
              : "border-muted"
          }`}
          // 클릭 시 판매 환경을 offline으로 변경
          onClick={() => onEnvironmentChange("offline")}
        >
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>오프라인 (매장)</CardTitle>
            <CardDescription>
              임대료와 운영 비용이 발생하는 실제 매장을 통해 판매
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* 상세 선택 영역 (환경에 따라 내용 변경) */}
      <Card className="max-w-2xl mx-auto border-2 rounded-[40px] shadow-sm">
        <CardContent className="pt-6 pb-6 space-y-6">
          {/* 상단 안내 텍스트 */}
          <p className="font-semibold">세부 정보</p>

          {/* 온라인일 경우: 플랫폼 선택 */}
          {environment === "online" ? (
            <div className="space-y-2 ">
              <label
                htmlFor="platform"
                className="text-xs font-medium text-muted-foreground"
              >
                플랫폼 선택
              </label>
              <select
                id="platform"
                className="flex h-10 w-full rounded-md border border-input bg-background px-2 py-2 text-sm shadow-sm"
                value={platform}
                onChange={(e) => onPlatformChange(e.target.value)}
              >
                <option value="" disabled>
                  플랫폼을 선택하세요
                </option>
                <option value="smartstore">스마트스토어 (수수료 4%)</option>
                <option value="coupang">쿠팡 (수수료 11%)</option>
                <option value="11st">
                  11번가 (수수료 1~20%-카테고리별 상이)
                </option>
                <option value="gmarket">
                  지마켓 (수수료 4~15%-카테고리별 상이)
                </option>
              </select>
            </div>
          ) : (
            /* 오프라인일 경우: 매장 위치 선택 */
            <div className="space-y-2 ">
              <label
                htmlFor="location"
                className="text-xs font-medium text-muted-foreground"
              >
                매장 위치
              </label>
              <select
                id="location"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
              >
                <option value="" disabled>
                  위치를 선택하세요
                </option>
                <option value="seoul">서울권 (₩3,000,000/월)</option>
                <option value="gyeonggi">경기/인천권 (₩2,000,000/월)</option>
                <option value="chungcheong">충청권 (₩1,500,000/월)</option>
                <option value="jeolla">전라권 (₩1,400,000/월)</option>
                <option value="gyeongsang">경상권 (₩1,600,000/월)</option>
                <option value="gangwon">강원/제주권 (₩1,200,000/월)</option>
              </select>
            </div>
          )}
          {/* 하단 버튼 영역 */}
          <div className="flex gap-4">
            {/* 이전 단계 버튼 */}
            <button
              type="button"
              onClick={onBack}
              className="flex-1 h-11 inline-flex items-center justify-center rounded-lg border border-border bg-white text-sm font-medium text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary hover:bg-muted/60"
            >
              이전
            </button>

            {/* 계산 실행 버튼 */}
            <button
              type="button"
              onClick={onCalculate}
              disabled={!canCalculate} // 필요한 선택이 안 되어 있으면 비활성화
              className="flex-1 h-11 inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              유닛 이코노믹스 계산하기
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
