"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainHeader from "@/components/MainHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SavedAnalysis = {
  id: string;
  savedAt: string;
  productName: string;
  simulationName?: string;
  targetPrice: number;
  margin: number;
  monthlyProfit: number;
  breakeven: number;
};

export default function ExtensionComparePage() {
  const router = useRouter();

  //제품명 가져오기
  const [productName] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("simulationDraftProductName") ?? "";
  });

  //시뮬명 가져오기 (사용자 입력)
  const [simulationName, setSimulationName] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("simulationDraftName") ?? "";
  });

  //임시저장된 분석결과 불러오기
  const [savedAnalyses] = useState<SavedAnalysis[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("mockSavedAnalyses");
      return raw ? (JSON.parse(raw) as SavedAnalysis[]) : [];
    } catch {
      return [];
    }
  });

  //분석 결과 비교를 위한 더미
  const dummyAnalyses: SavedAnalysis[] = [
    {
      id: "dummy-1",
      savedAt: new Date().toISOString(),
      productName: productName || "더미 제품명",
      simulationName: "보수안",
      targetPrice: 50000,
      margin: 14.8,
      monthlyProfit: 5200000,
      breakeven: 980,
    },
    {
      id: "dummy-2",
      savedAt: new Date().toISOString(),
      productName: productName || "더미 제품명",
      simulationName: "공격안",
      targetPrice: 55000,
      margin: 19.7,
      monthlyProfit: 7300000,
      breakeven: 810,
    },
  ];

  //제품명 같은거만 필터링
  const analyses = [...savedAnalyses, ...dummyAnalyses].filter(
    (item) => item.productName === (productName || "더미 제품명"),
  );

  //이익순 정렬
  const sortedAnalyses = [...analyses].sort(
    (a, b) => b.monthlyProfit - a.monthlyProfit,
  );

  //요약 계산
  const bestMargin = sortedAnalyses.length
    ? Math.max(...sortedAnalyses.map((item) => item.margin))
    : 0;
  const bestProfit = sortedAnalyses.length
    ? Math.max(...sortedAnalyses.map((item) => item.monthlyProfit))
    : 0;
  const bestBreakeven = sortedAnalyses.length
    ? Math.min(...sortedAnalyses.map((item) => item.breakeven))
    : 0;

  //다른 버전 분석 시작
  const handleCreateAnotherVersion = () => {
    if (!simulationName.trim()) return;
    // TODO(api): 여기서는 draft(제품명+시뮬명)를 localStorage에 임시 저장 중.
    // 추후에는 서버에 "새 시뮬 버전 생성 요청" 후 channel로 이동하도록 변경.
    if (productName.trim()) {
      localStorage.setItem("simulationDraftProductName", productName.trim());
    }
    localStorage.setItem("simulationDraftName", simulationName.trim());
    router.push("/channel");
  };

  //새 프로젝트 시작 시 localStorage 초기화 후 product 페이지로 이동
  const handleStartNewProject = () => {
    // TODO(api): 새 프로젝트 생성 API 연결 전까지는 localStorage 초기화로 대체.
    localStorage.removeItem("simulationDraftProductName");
    localStorage.removeItem("simulationDraftName");
    router.push("/product");
  };

  return (
    <div className="min-h-screen bg-white">
      <MainHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Extension 비교 시뮬레이션</CardTitle>
            <CardDescription>
              한 제품에 대해 시뮬레이션 이름을 바꿔 여러 케이스를 비교합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="simulationName"
                  className="text-sm font-medium leading-none"
                >
                  시뮬레이션 이름
                </label>
                <input
                  id="simulationName"
                  value={simulationName}
                  onChange={(e) => setSimulationName(e.target.value)}
                  placeholder="예: 스마트스토어_보수안"
                  maxLength={24}
                  className="h-11 w-full md:max-w-md rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground">최대 24자</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleCreateAnotherVersion}
                disabled={!simulationName.trim()}
                className="h-11 px-6 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
              >
                다른 버전 분석 시작
              </button>
              <button
                type="button"
                onClick={handleStartNewProject}
                className="h-11 px-6 rounded-md border border-border bg-white text-sm font-semibold hover:bg-muted/40"
              >
                새 프로젝트 시작
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>같은 제품 시뮬레이션 비교</CardTitle>
            <CardDescription>
              현재는 더미 결과 + 임시 저장 결과를 함께 보여줍니다.
              {/* TODO(api): 실제 API 연동 시 서버 결과로 대체 */}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                아직 비교할 시뮬레이션이 없습니다.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                    <p className="text-xs font-medium text-emerald-700">
                      최고 마진율
                    </p>
                    <p className="mt-1 text-2xl font-bold text-emerald-800">
                      {bestMargin.toFixed(1)}%
                    </p>
                  </div>
                  <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-4">
                    <p className="text-xs font-medium text-orange-700">
                      최대 월 순이익
                    </p>
                    <p className="mt-1 text-2xl font-bold text-orange-800">
                      ₩{Math.round(bestProfit).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
                    <p className="text-xs font-medium text-blue-700">
                      최소 손익분기점
                    </p>
                    <p className="mt-1 text-2xl font-bold text-blue-800">
                      {bestBreakeven.toLocaleString()}개
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40">
                      <tr className="border-b">
                        <th className="w-16 py-3 text-center">순위</th>
                        <th className="py-3 text-left">시뮬레이션</th>
                        <th className="py-3 text-right">마진율</th>
                        <th className="py-3 text-right">월 순이익</th>
                        <th className="py-3 text-right">손익분기점</th>
                        <th className="py-3 text-center">평가</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedAnalyses.map((item, index) => {
                        const isTop = index === 0;
                        const scoreLabel =
                          item.margin >= 20 // 마진 기준 20% 이상은 수익 우수, 10% 이상은 안정형, 그 미만은 검토 필요
                            ? "수익 우수"
                            : item.margin >= 10
                              ? "안정형"
                              : "검토 필요";
                        const scoreClass =
                          item.margin >= 20
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : item.margin >= 10
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : "bg-red-100 text-red-800 border-red-200";

                        return (
                          <tr
                            key={item.id}
                            className={`border-b last:border-0 ${isTop ? "bg-primary/5" : "bg-white"}`}
                          >
                            <td className="py-3 text-center font-semibold">
                              {isTop ? "TOP 1" : `#${index + 1}`}
                            </td>
                            <td className="py-3 font-medium">
                              {item.simulationName || "이름 없음"}
                            </td>
                            <td className="py-3 text-right">
                              {item.margin.toFixed(1)}%
                            </td>
                            <td className="py-3 text-right font-semibold">
                              ₩{Math.round(item.monthlyProfit).toLocaleString()}
                            </td>
                            <td className="py-3 text-right">
                              {item.breakeven.toLocaleString()}개
                            </td>
                            <td className="py-3 text-center">
                              <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${scoreClass}`}
                              >
                                {scoreLabel}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
