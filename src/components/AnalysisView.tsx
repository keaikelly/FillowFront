// 분석 결과 컴포넌트. 결과를 시각화 담당

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

// 고정비+변동비 도넛차트
import UnifiedCostChart from "./unified-cost-chart";
// 아이콘
import {
  BarChart3,
  Building2,
  AlertCircle,
  Calculator,
  DollarSign,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

// 비용 구조: 고정비/변동비 공통 구조 정의
type CostItem = {
  id: string;
  name: string;
  amount: number;
};

// AnalysisView가 부모로부터 "받는" props 타입
type AnalysisViewProps = {
  productName: string; // 제품명
  targetPrice: string; // 목표 판매가 (문자열)
  margin: number; // 마진율 (기여이익률)
  monthlyProfit: number; // 월 예상 순이익
  breakeven: number; // 손익분기점 판매 수량
  // 아래 값들은 page에서 계산/관리되는 편집 상태들
  variableItems: CostItem[];
  fixedItems: CostItem[];
  includeLoanInterest: boolean;
  loanInterest: number;
  newVariableName: string;
  newVariableAmount: string;
  newFixedName: string;
  newFixedAmount: string;
  sunkItems: CostItem[];
  computedFixedItems: CostItem[];
  totalFixedValue: number;
  totalVariableValue: number;
  totalSunkValue: number;
  onVariableItemsChange: (items: CostItem[]) => void;
  onFixedItemsChange: (items: CostItem[]) => void;
  onSunkItemsChange: (items: CostItem[]) => void;
  onExportExcel: () => void;
  onIncludeLoanInterestChange: (next: boolean) => void;
  onLoanInterestChange: (value: number) => void;
  onNewVariableNameChange: (value: string) => void;
  onNewVariableAmountChange: (value: string) => void;
  onNewFixedNameChange: (value: string) => void;
  onNewFixedAmountChange: (value: string) => void;
};

export default function AnalysisView({
  productName,
  targetPrice,
  margin,
  monthlyProfit,
  breakeven,
  variableItems,
  fixedItems,
  includeLoanInterest,
  loanInterest,
  newVariableName,
  newVariableAmount,
  newFixedName,
  newFixedAmount,
  sunkItems,
  computedFixedItems,
  totalFixedValue,
  totalVariableValue,
  totalSunkValue,
  onVariableItemsChange,
  onFixedItemsChange,
  onSunkItemsChange,
  onExportExcel,
  onIncludeLoanInterestChange,
  onLoanInterestChange,
  onNewVariableNameChange,
  onNewVariableAmountChange,
  onNewFixedNameChange,
  onNewFixedAmountChange,
}: AnalysisViewProps) {
  // 문자열로 들어온 판매가를 숫자로 변환
  const price = Number.parseFloat(targetPrice || "0");

  return (
    <div className="space-y-8">
      {/* 상단 제목 영역 */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">유닛 이코노믹스 분석 결과</h1>
        <p className="text-muted-foreground">
          제품의 수익성과 손익분기점을 확인하세요
        </p>
      </div>

      {/* KPI 요약 카드 5개 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        {/* 제품명 */}
        <Card className="border border-primary/20 bg-gradient-to-br from-white to-orange-50">
          <CardHeader className="py-4 text-center">
            <CardDescription className="text-xs">제품명</CardDescription>
            <CardTitle className="text-lg">{productName}</CardTitle>
          </CardHeader>
        </Card>

        {/* 목표 판매가 */}
        <Card className="border border-primary/20 bg-gradient-to-br from-white to-orange-50">
          <CardHeader className="py-4 text-center">
            <CardDescription className="text-xs">목표 판매가</CardDescription>
            <CardTitle className="text-lg text-primary">
              ₩{price.toLocaleString()} {/* 천 단위 콤마 */}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* 마진율 (기여이익률) */}
        <Card className="border border-primary/20 bg-gradient-to-br from-white to-orange-50">
          <CardHeader className="py-4 text-center">
            <CardDescription className="text-xs">예상 마진율</CardDescription>
            <CardTitle className="text-lg text-primary">
              {margin.toFixed(1)}% {/* 소수점 1자리 */}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* 월 예상 순이익 */}
        <Card className="border border-primary/20 bg-gradient-to-br from-white to-orange-50">
          <CardHeader className="py-4 text-center">
            <CardDescription className="text-xs">
              월 예상 순이익
            </CardDescription>
            <CardTitle className="text-lg text-primary">
              ₩{monthlyProfit.toLocaleString()} {/* 천 단위 콤마 */}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* 손익분기점 */}
        <Card className="border border-primary/20 bg-gradient-to-br from-white to-orange-50">
          <CardHeader className="py-4 text-center">
            <CardDescription className="text-xs">손익분기점</CardDescription>
            <CardTitle className="text-lg text-primary">
              {breakeven.toLocaleString()}개 {/* 천 단위 콤마 */}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* 비용 구조 분석 영역 */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              비용 구조
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">전체 비용 구조</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 font-medium mb-1">
                  총 고정비
                </p>
                <p className="text-2xl font-bold text-blue-700">
                  ₩{totalFixedValue.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-primary font-medium mb-1">
                  총 변동비
                </p>
                <p className="text-2xl font-bold text-primary">
                  ₩{totalVariableValue.toLocaleString()}
                </p>
              </div>
            </div>
            {/* 도넛 차트 */}
            <UnifiedCostChart
              fixedCosts={computedFixedItems}
              variableCosts={variableItems}
            />
            {margin >= 20 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  마진이 평균보다 높습니다. 누락된 고정비나 변동비가 없는지 다시
                  확인해보세요.{" "}
                </AlertDescription>
              </Alert>
            )}
            {margin < 10 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  마진이 낮아 수익성이 위험할 수 있습니다. 판매가 조정이나
                  변동비 절감을 고려해보세요.{" "}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* 변동비 / 고정비 상세 목록 */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                변동비 (Variable Costs)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {/* 변동비 항목 편집 */}
                {variableItems.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <p className="text-sm font-medium">{item.name}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">₩</span>
                      <input
                        type="number"
                        className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
                        value={item.amount}
                        onChange={(e) => {
                          const newAmount = Number(e.target.value || 0); //입력값을 숫자로
                          const next = variableItems.map(
                            (entry) =>
                              entry.id === item.id
                                ? {
                                    ...entry,
                                    amount: newAmount,
                                  } //현재 수정중 항목이면 newAmount로 변경
                                : entry // 다른 항목은 그대로 반환
                          );

                          onVariableItemsChange(next);
                        }}
                      />
                      <span className="text-sm text-muted-foreground">
                        / 개
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onVariableItemsChange(
                            variableItems.filter(
                              (entry) => entry.id !== item.id //현재 클릭한 id가 아닌 다른 항목들만 남김(filter), 즉 제거
                            )
                          )
                        }
                        className="h-10 w-10 rounded-md border border-border text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* 변동비 항목 추가 */}
                <div className="border-t pt-4">
                  {/* 3열 그리드. 숫자는 크기 의미 */}
                  <div className="grid grid-cols-[1.5fr_1fr_auto] gap-3 items-center">
                    <input
                      placeholder="항목명 (예: 원자재비)"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm
                 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
                      value={newVariableName}
                      onChange={(e) => onNewVariableNameChange(e.target.value)}
                    />
                    {/* 금액 입력 */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-muted-foreground"></span>
                      <input
                        type="number"
                        placeholder="금액(원)"
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm
                   focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
                        value={newVariableAmount}
                        onChange={(e) =>
                          onNewVariableAmountChange(e.target.value)
                        }
                      />
                    </div>
                    {/* 추가 버튼 */}
                    <button
                      type="button"
                      onClick={() => {
                        const name = newVariableName.trim(); // 항목명 앞뒤 공백 제거
                        const amount = Number(newVariableAmount || 0);
                        if (!name || Number.isNaN(amount)) return;

                        // 기존 변동비 목록에 새 항목 추가
                        onVariableItemsChange([
                          ...variableItems,
                          {
                            id: `variable-${Date.now()}`, // 임시 고유 ID
                            name,
                            amount,
                          },
                        ]);

                        // 입력창 초기화
                        onNewVariableNameChange("");
                        onNewVariableAmountChange("");
                      }}
                      className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold
                 inline-flex items-center gap-1 hover:bg-primary/90"
                    >
                      <Plus className="h-4 w-4" />
                      추가
                    </button>
                  </div>
                </div>

                {/* 변동비 합계 */}
                <div className="pt-3 border-t flex items-center justify-between text-sm font-semibold">
                  <span>변동비 합계</span>
                  <span className="text-primary">
                    ₩{totalVariableValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                고정비 (Fixed Period Costs)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {/* 대출이자 포함 토글 */}
                <div className="grid grid-cols-[1fr_140px_90px] gap-3 items-center text-sm">
                  <span className="text-muted-foreground">대출이자</span>
                  <input
                    type="number"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-right focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-600 disabled:opacity-60"
                    value={loanInterest}
                    onChange={(e) =>
                      onLoanInterestChange(Number(e.target.value || 0))
                    }
                    disabled={!includeLoanInterest}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onIncludeLoanInterestChange(!includeLoanInterest)
                    }
                    className={`h-9 rounded-full border px-3 text-xs font-medium ${
                      includeLoanInterest
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-border bg-white text-muted-foreground"
                    }`}
                  >
                    {includeLoanInterest ? "포함" : "미포함"}
                  </button>
                </div>

                {/* 고정비 항목 편집 */}
                {fixedItems.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <p className="text-sm font-medium">{item.name}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">₩</span>
                      <input
                        type="number"
                        className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-600"
                        value={item.amount}
                        onChange={(e) => {
                          const next = fixedItems.map((entry) =>
                            entry.id === item.id
                              ? {
                                  ...entry,
                                  amount: Number(e.target.value || 0),
                                }
                              : entry
                          );
                          onFixedItemsChange(next);
                        }}
                      />
                      <span className="text-sm text-muted-foreground">
                        / 월
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onFixedItemsChange(
                            fixedItems.filter((entry) => entry.id !== item.id)
                          )
                        }
                        className="h-10 w-10 rounded-md border border-border text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* 고정비 항목 추가 */}
                <div className="border-t pt-4">
                  {/* 3열 그리드. 숫자는 크기 의미 */}
                  <div className="grid grid-cols-[1.5fr_1fr_auto] gap-3 items-center">
                    <input
                      placeholder="항목명 (예: 원자재비)"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm
                 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-600"
                      value={newFixedName}
                      onChange={(e) => onNewFixedNameChange(e.target.value)}
                    />
                    {/* 금액 입력 */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-muted-foreground"></span>
                      <input
                        type="number"
                        placeholder="금액(원)"
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm
                   focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-600"
                        value={newFixedAmount}
                        onChange={(e) => onNewFixedAmountChange(e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const name = newFixedName.trim();
                        const amount = Number(newFixedAmount || 0);
                        if (!name || Number.isNaN(amount)) return;
                        onFixedItemsChange([
                          ...fixedItems,
                          {
                            id: `fixed-${Date.now()}`,
                            name,
                            amount,
                          },
                        ]);
                        onNewFixedNameChange("");
                        onNewFixedAmountChange("");
                      }}
                      className="h-10 px-4 rounded-md bg-blue-600 text-white text-sm font-semibold inline-flex items-center gap-1 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      추가
                    </button>
                  </div>
                </div>

                {/* 고정비 합계 */}
                <div className="pt-3 border-t flex items-center justify-between text-sm font-semibold">
                  <span>고정비 합계</span>
                  <span className="text-blue-600">
                    ₩{totalFixedValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 초기 투자 비용(PSI) 요약 */}
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-base">
                초기 투자 비용 (Primary Sunk Investment)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="text-sm font-semibold mb-2">List of costs</div>
                {sunkItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>₩ {item.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between text-sm font-semibold">
                  <span>= Total PSI</span>
                  <span>₩ {totalSunkValue.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 저장/동기화 액션 */}
      <div className="grid md:grid-cols-2 gap-4">
        <button
          type="button"
          className="w-full h-12 rounded-full bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90"
          onClick={onExportExcel}
        >
          <Calculator className="h-4 w-4" />
          유닛이코노믹스 저장
        </button>
        <button
          type="button"
          className="w-full h-12 rounded-full bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90"
          onClick={() => alert("국세청 장부 동기화 기능은 준비중입니다!")}
        >
          <DollarSign className="h-4 w-4" />
          국세청 장부로 동기화
        </button>
      </div>
    </div>
  );
}
