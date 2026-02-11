"use client";

import { useState } from "react";
import { ChevronDown, Sparkles, BarChart3 } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CostItem = {
  id: string;
  name: string;
  amount: number;
};

type SavedAnalysis = {
  id: string;
  savedAt: string;
  productName: string;
  simulationName: string;
  targetPrice: number;
  margin: number;
  monthlyProfit: number;
  breakeven: number;
  variableItems: CostItem[];
  fixedItems: CostItem[];
  sunkItems: CostItem[];
  totalVariableValue: number;
  totalFixedValue: number;
  totalSunkValue: number;
};

const dummyAnalyses: SavedAnalysis[] = [
  {
    id: "dummy-1",
    savedAt: "2026-02-11T09:30:00.000Z",
    productName: "프리미엄 가죽 지갑",
    simulationName: "쿠팡_보수안",
    targetPrice: 59000,
    margin: 23.4,
    monthlyProfit: 8420000,
    breakeven: 712,
    variableItems: [
      { id: "d1-v1", name: "원자재비", amount: 18000 },
      { id: "d1-v2", name: "포장비", amount: 2500 },
      { id: "d1-v3", name: "물류비", amount: 4200 },
      { id: "d1-v4", name: "플랫폼 수수료", amount: 3200 },
    ],
    fixedItems: [
      { id: "d1-f1", name: "임대료", amount: 320000 },
      { id: "d1-f2", name: "인건비", amount: 4200000 },
      { id: "d1-f3", name: "마케팅비", amount: 1100000 },
      { id: "d1-f4", name: "대출이자", amount: 130000 },
    ],
    sunkItems: [],
    totalVariableValue: 27900,
    totalFixedValue: 5730000,
    totalSunkValue: 0,
  },
  {
    id: "dummy-2",
    savedAt: "2026-02-10T15:10:00.000Z",
    productName: "반려동물 간식",
    simulationName: "네이버스토어",
    targetPrice: 15000,
    margin: 15.3,
    monthlyProfit: 3280000,
    breakeven: 1190,
    variableItems: [
      { id: "d2-v1", name: "원재료비", amount: 5200 },
      { id: "d2-v2", name: "포장비", amount: 800 },
      { id: "d2-v3", name: "배송비", amount: 2600 },
      { id: "d2-v4", name: "플랫폼 수수료", amount: 900 },
    ],
    fixedItems: [
      { id: "d2-f1", name: "임대료", amount: 2400000 },
      { id: "d2-f2", name: "인건비", amount: 3000000 },
      { id: "d2-f3", name: "운영비", amount: 900000 },
      { id: "d2-f4", name: "광고비", amount: 700000 },
    ],
    sunkItems: [],
    totalVariableValue: 9500,
    totalFixedValue: 7000000,
    totalSunkValue: 0,
  },
];

export default function MyPage() {
  // API 연동 전: 임시 더미 목록만 표시
  const [displayedAnalyses] = useState<SavedAnalysis[]>(dummyAnalyses);

  return (
    <div className="min-h-screen bg-white">
      <MainHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-blue-50 p-6">
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-orange-100/80 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-blue-100/80 blur-2xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                My Simulation Hub
              </div>
              <h1 className="text-3xl font-bold">마이페이지</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-white/80 px-3 py-2 text-sm text-blue-700">
              <BarChart3 className="h-4 w-4" />
              분석 히스토리 {displayedAnalyses.length}건
            </div>
          </div>
        </div>

        <p className="pt-6 text-sm text-muted-foreground">
          API 연동 전 임시 더미 데이터입니다.
        </p>
        {displayedAnalyses.map((analysis) => (
          <Card key={analysis.id}>
            <CardHeader>
              <CardTitle>{analysis.productName}</CardTitle>
              <CardDescription>
                {analysis.simulationName
                  ? `시뮬레이션: ${analysis.simulationName} · `
                  : ""}
                저장일: {new Date(analysis.savedAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-4 text-sm">
                <div>
                  <p className="text-muted-foreground">목표 판매가</p>
                  <p className="font-semibold">
                    ₩{analysis.targetPrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">마진율</p>
                  <p className="font-semibold">{analysis.margin.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">월 예상 순이익</p>
                  <p className="font-semibold">
                    ₩{analysis.monthlyProfit.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">손익분기점</p>
                  <p className="font-semibold">
                    {analysis.breakeven.toLocaleString()}개
                  </p>
                </div>
              </div>

              <details className="group rounded-lg border border-border bg-white">
                {" "}
                {/*detail: 숨김/펼침 되는 html*/}
                <summary className="cursor-pointer list-none select-none px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">상세 비용 보기</p>
                      <p className="text-xs text-muted-foreground">
                        변동비 {analysis.variableItems.length}개 · 고정비{" "}
                        {analysis.fixedItems.length}개
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
                      펼치기
                      <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                    </div>
                  </div>
                </summary>
                <div className="grid gap-4 border-t px-4 py-4 md:grid-cols-2">
                  <div className="rounded-xl border border-orange-200 bg-orange-50/40 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-primary">
                        변동비 상세
                      </p>
                      <span className="text-xs text-primary/80">단위당</span>
                    </div>
                    <div className="space-y-2">
                      {analysis.variableItems.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          등록된 항목 없음
                        </p>
                      ) : (
                        analysis.variableItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-md bg-white/80 px-3 py-2 text-sm"
                          >
                            <span>{item.name}</span>
                            <span className="font-medium">
                              ₩{item.amount.toLocaleString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="mt-3 border-t border-orange-200 pt-3 text-sm font-semibold flex items-center justify-between">
                      <span>합계</span>
                      <span className="text-primary">
                        ₩{analysis.totalVariableValue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-blue-700">
                        고정비 상세
                      </p>
                      <span className="text-xs text-blue-700/80">월 기준</span>
                    </div>
                    <div className="space-y-2">
                      {analysis.fixedItems.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          등록된 항목 없음
                        </p>
                      ) : (
                        analysis.fixedItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-md bg-white/80 px-3 py-2 text-sm"
                          >
                            <span>{item.name}</span>
                            <span className="font-medium">
                              ₩{item.amount.toLocaleString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="mt-3 border-t border-blue-200 pt-3 text-sm font-semibold flex items-center justify-between">
                      <span>합계</span>
                      <span className="text-blue-700">
                        ₩{analysis.totalFixedValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </details>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}
