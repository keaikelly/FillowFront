// 카드 UI 컴포넌트들 (공통 레이아웃)
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

// 아이콘 (시각적 강조용)
import { TrendingUp, Sparkles, Loader2 } from "lucide-react";

// ProductStep 컴포넌트가 부모로부터 받아야 하는 props 타입 정의
type ProductStepProps = {
  productName: string;
  targetPrice: string;

  onChangeName: (name: string) => void; //event가 아니라 값을 받음
  onChangePrice: (price: string) => void;

  // 다음 단계로 넘어갈 때 호출되는 함수
  onSubmit: () => void;
};

// 제품 정보 입력 단계 UI 컴포넌트
export function ProductStep({
  productName,
  targetPrice,
  onChangeName,
  onChangePrice,
  onSubmit,
}: ProductStepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4 py-8">
        {/* inline-flex: flex로 가운데 정렬 + 요소랑 한줄에 */}
        <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          AI 기반 재무 분석
        </div>
        <h2 className="text-4xl font-bold text-balance">
          제품의 유닛 이코노믹스를 계산하세요
        </h2>
        <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
          AI로 수익성, 손익분기점, 재무 전망을 즉시 확인하세요
        </p>
      </div>

      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            제품 정보
          </CardTitle>

          {/* 카드 설명 */}
          <CardDescription>제품 정보를 입력하여 시작하세요</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 제품명 입력 */}
          <div className="space-y-2">
            <label
              htmlFor="productName"
              className="text-sm font-medium leading-none"
            >
              제품명
            </label>
            <input
              id="productName"
              placeholder="예: 프리미엄 가죽 지갑"
              // 부모 상태를 그대로 사용 (controlled input)
              value={productName} //부모의 상태 사용
              onChange={(e) => onChangeName(e.target.value)} //타이핑 시 이름 onChangeName으로 setProductName (부모로 값 전달)
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-primary"
            />
          </div>

          {/* 목표 판매가 입력 */}
          <div className="space-y-2">
            <label
              htmlFor="targetPrice"
              className="text-sm font-medium leading-none"
            >
              목표 판매가 (₩)
            </label>
            <input
              id="targetPrice"
              type="number"
              placeholder="예: 50000"
              value={targetPrice}
              onChange={(e) => onChangePrice(e.target.value)} // 마찬가지로 값만 부모에 전달
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-primary"
            />
          </div>

          {/* 다음 단계 버튼 */}
          <button
            type="button"
            // 동일한 스타일
            className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
            onClick={onSubmit}
            disabled={!productName || !targetPrice} // 제품명 또는 가격이 비어 있으면 비활성화
          >
            계속하기
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

// 로딩 상태 전용 컴포넌트
export function ProductLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4 animate-in fade-in duration-500">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <p className="text-lg font-medium">AI가 분석을 시작합니다...</p>
      <p className="text-sm text-muted-foreground">잠시만 기다려주세요</p>
    </div>
  );
}
