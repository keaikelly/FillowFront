// 4단계: 분석 결과 페이지 (/analysis)
"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import MainHeader from "@/components/MainHeader";
import AnalysisView from "@/components/AnalysisView";

const DEFAULT_DRAFT_SNAPSHOT = JSON.stringify({
  productName: "더미 제품명",
  simulationName: "",
  selectedPlan: "standard",
  targetPrice: "50000",
  channelData: null,
});

export default function AnalysisPage() {
  const router = useRouter();
  const emptySubscribe = () => () => {};

  // 분석 결과 타입 정의 (저장용))
  type SavedAnalysis = {
    id: string;
    savedAt: string;
    productName: string;
    simulationName?: string;
    targetPrice: number;
    margin: number;
    monthlyProfit: number;
    breakeven: number;
    variableItems: { id: string; name: string; amount: number }[];
    fixedItems: { id: string; name: string; amount: number }[];
    totalVariableValue: number;
    totalFixedValue: number;
  };

  // TODO: 분석 데이터 실제로 받아오기
  // 현재는 화면/UX 확인용으로 더미(dummy) 데이터 사용

  const draftSnapshot = useSyncExternalStore(
    // 외부저장(로.스)에서 값 가져오기

    emptySubscribe,

    //client에서만 실행되는 값 읽기
    () => {
      try {
        const rawChannel = localStorage.getItem("simulationChannelData");
        return JSON.stringify({
          productName:
            localStorage.getItem("simulationDraftProductName") || "더미 제품명",
          simulationName: localStorage.getItem("simulationDraftName") || "",
          selectedPlan: localStorage.getItem("selectedPlan") || "standard",
          targetPrice:
            localStorage.getItem("simulationDraftTargetPrice") || "50000",
          channelData: rawChannel
            ? (JSON.parse(rawChannel) as Record<string, string>)
            : null,
        });
      } catch {
        return DEFAULT_DRAFT_SNAPSHOT;
      }
    },

    // 서버에서는 항상 기본값 사용 (로컬스토리지 접근 불가)
    () => DEFAULT_DRAFT_SNAPSHOT,
  );
  const draft = JSON.parse(draftSnapshot) as {
    productName: string;
    simulationName: string;
    selectedPlan: string;
    targetPrice: string;
    channelData: Record<string, string> | null;
  };

  const productName = draft.productName;
  const simulationName = draft.simulationName;
  const selectedPlan = draft.selectedPlan;
  const targetPrice = draft.targetPrice;
  const channelData = draft.channelData;

  const isExtensionPlan = selectedPlan === "pro";
  const price = Number.parseFloat(targetPrice || "0"); // 목표 판매가 문자열 → 숫자로 변환

  const toNumber = (value: string | undefined) => {
    if (!value) return 0;
    const normalized = value.replaceAll(",", "").replaceAll("원", "").trim(); //단위 기호 제거
    const n = Number(normalized); //문자열 → 숫자 변환 시도
    return Number.isFinite(n) ? n : 0;
  };

  const getCommissionByPlatform = (platform: string | undefined) => {
    if (!platform) return 0;
    const map: Record<string, number> = {
      // 플랫폼별 기본 수수료율 (예시값). 나중에 실제 API에서 받아오도록 변경 예정.
      smartstore: 0.04,
      coupang: 0.11,
      "11st": 0.12,
      gmarket: 0.1,
    };
    return map[platform] ?? 0;
  };

  const getMonthlyRentByLocation = (location: string | undefined) => {
    if (!location) return 0;
    const map: Record<string, number> = {
      seoul: 3000000,
      gyeonggi: 2000000,
      chungcheong: 1500000,
      jeolla: 1400000,
      gyeongsang: 1600000,
      gangwon: 1200000,
      jeju: 1200000,
    };
    return map[location] ?? 0;
  };

  const customCommission = toNumber(channelData?.commission);
  const platformRate = getCommissionByPlatform(channelData?.platform);
  const commissionAmount =
    customCommission > 0 ? customCommission : Math.round(price * platformRate);

  const customRent = toNumber(channelData?.monthlyRent);
  const mappedRent = getMonthlyRentByLocation(channelData?.location);
  const rentAmount = customRent > 0 ? customRent : mappedRent;

  // -----------------------------
  // 고정비 더미 데이터
  // -----------------------------
  const dummyFixedCostItems = [
    { id: "1", name: "임대료", amount: rentAmount || 3000000 },
    { id: "2", name: "인건비", amount: 5000000 },
  ];

  // -----------------------------
  // 변동비 더미 데이터
  // -----------------------------
  const dummyVariableCostItems = [
    { id: "1", name: "원자재비", amount: 5000 },
    { id: "2", name: "포장비", amount: 500 },
    { id: "3", name: "물류비", amount: 2500 },
    { id: "4", name: "수수료", amount: commissionAmount || 100 },
  ];

  // 편집 가능한 비용 상태들 (분석 페이지에서 관리)
  const [variableItems, setVariableItems] = useState(dummyVariableCostItems);
  const [fixedItems, setFixedItems] = useState(dummyFixedCostItems);
  const [includeLoanInterest, setIncludeLoanInterest] = useState(false);
  const [loanPrincipal, setLoanPrincipal] = useState(""); //대출금
  const [loanAnnualRate, setLoanAnnualRate] = useState(""); //연이율
  const [loanTermMonths, setLoanTermMonths] = useState(""); //대출기간(개월)
  const [newVariableName, setNewVariableName] = useState("");
  const [newVariableAmount, setNewVariableAmount] = useState("");
  const [newFixedName, setNewFixedName] = useState("");
  const [newFixedAmount, setNewFixedAmount] = useState("");

  // 대출이자 포함 여부에 따른 고정비 계산
  // 대출 정보로 "월 상환액" 계산 (원리금균등 방식)
  const loanMonthlyPayment = useMemo(() => {
    if (!includeLoanInterest) return 0; //대출이자 미포함이면 0
    const principal = Number(loanPrincipal || 0);
    const annualRate = Number(loanAnnualRate || 0);
    const termMonths = Number(loanTermMonths || 0);
    // 입력이 비어있으면 계산하지 않음
    if (!principal || !termMonths) return 0;
    const monthlyRate = annualRate / 100 / 12; //연이율->월이율로 변환
    // 이자 0% 무이자면, 원금만 나눠서 계산
    if (monthlyRate === 0) return principal / termMonths;
    // 원리금균등의 분모계산: P * r / (1 - (1+r)^-n)
    const denominator = 1 - Math.pow(1 + monthlyRate, -termMonths);
    if (denominator === 0) return 0;
    // 월상환액: 원금 * (월이율 / 분모)
    return principal * (monthlyRate / denominator);
  }, [includeLoanInterest, loanPrincipal, loanAnnualRate, loanTermMonths]);

  const computedFixedItems = useMemo(() => {
    if (!includeLoanInterest) return fixedItems; //대출이자 미포함 시 기존 고정비 반환
    return [
      ...fixedItems, //기존 고정비 복사
      {
        id: "loan-interest",
        name: "대출이자",
        amount: Math.round(loanMonthlyPayment),
      }, //대출이자 항목 추가
    ];
  }, [fixedItems, includeLoanInterest, loanMonthlyPayment]); //이 항목이 변경될 때 재계산 (useMemo)

  // 합계 계산
  const totalFixedValue = useMemo(() => {
    return computedFixedItems.reduce(
      (sum, item) => sum + (item.amount || 0),
      0,
    );
  }, [computedFixedItems]);

  const totalVariableValue = useMemo(() => {
    return variableItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [variableItems]);

  // 마진율 계산: (판매가 - 변동비) / 판매가 * 100
  const dummyMargin =
    price > 0 ? ((price - totalVariableValue) / price) * 100 : 0;

  // 월 이익 계산: (월 판매량 2,500개 가정)
  const dummyMonthlyProfit =
    (price - totalVariableValue) * 2500 - totalFixedValue;

  // 손익분기점 계산: 고정비 / (판매가 - 변동비)
  const dummyBreakeven =
    price - totalVariableValue > 0
      ? Math.ceil(totalFixedValue / (price - totalVariableValue)) //ceil: 올림 처리
      : 0;

  const saveAnalysis = async () => {
    // TODO(api): 현재는 단순 저장(append)만 수행.
    // Extension에서는 "현재 시뮬 업데이트(PUT)"와 "새 버전 저장(POST)"를 분리해야 함.
    const next: SavedAnalysis = {
      id: String(Date.now()),
      savedAt: new Date().toISOString(),
      productName,
      simulationName: isExtensionPlan ? simulationName : "",
      targetPrice: price,
      margin: dummyMargin,
      monthlyProfit: dummyMonthlyProfit,
      breakeven: dummyBreakeven,
      variableItems,
      fixedItems: computedFixedItems,
      totalVariableValue,
      totalFixedValue,
    };

    try {
      // TODO(api): 실제 저장 API가 준비되면 fetch("/api/...")로 교체.
      // 현재는 로컬 더미 저장으로만 동작.
      const raw = localStorage.getItem("mockSavedAnalyses");
      const prev = raw ? (JSON.parse(raw) as SavedAnalysis[]) : [];
      localStorage.setItem(
        "mockSavedAnalyses",
        JSON.stringify([next, ...prev]),
      );
      return true;
    } catch {
      return false;
    }
  };

  const handleExportExcel = async () => {
    const rows: string[][] = [
      ["구분", "항목", "값"],
      ["기본", "제품/사업 이름", productName],
      ["기본", "시뮬레이션 이름", simulationName || "-"],
      ["기본", "목표 판매가", String(price)],
      ["성과", "마진율(%)", dummyMargin.toFixed(1)],
      ["성과", "월 예상 순이익", String(Math.round(dummyMonthlyProfit))],
      ["성과", "손익분기점(개)", String(dummyBreakeven)],
      ["", "", ""],
      ["변동비", "항목", "금액"],
      ...variableItems.map((item) => [
        "변동비",
        item.name,
        String(item.amount),
      ]),
      ["변동비", "합계", String(totalVariableValue)],
      ["", "", ""],
      ["고정비", "항목", "금액"],
      ...computedFixedItems.map((item) => [
        "고정비",
        item.name,
        String(item.amount),
      ]),
      ["고정비", "합계", String(totalFixedValue)],
    ];

    try {
      const XLSX = await import("xlsx");
      //2차원 배열을 엑셀 시트로
      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      const workbook = XLSX.utils.book_new(); //생성
      XLSX.utils.book_append_sheet(workbook, worksheet, "Analysis"); //워크북에 시트추가
      XLSX.writeFile(
        workbook,
        `${productName}_${simulationName || "기본시뮬"}.xlsx`,
      ); //제품명+시뮬이름으로 파일저장
    } catch {
      alert("엑셀 파일 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleSaveAndCompare = async () => {
    const ok = await saveAnalysis();
    if (!ok) {
      alert("저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    router.push("/extension-compare");
  };

  return (
    <div className="min-h-screen bg-white">
      <MainHeader />

      {/* 분석 결과 메인 영역 */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 실제분석은 컴포넌트. 데이터 준비, 계산, 전달 역할 */}
        <AnalysisView
          productName={productName} // 제품명
          targetPrice={targetPrice} // 목표 판매가
          margin={dummyMargin} // 마진율 (%)
          monthlyProfit={dummyMonthlyProfit} // 월 예상 이익
          breakeven={dummyBreakeven} // 손익분기점(판매량)
          variableItems={variableItems}
          fixedItems={fixedItems}
          includeLoanInterest={includeLoanInterest}
          loanPrincipal={loanPrincipal}
          loanAnnualRate={loanAnnualRate}
          loanTermMonths={loanTermMonths}
          loanMonthlyPayment={loanMonthlyPayment}
          newVariableName={newVariableName}
          newVariableAmount={newVariableAmount}
          newFixedName={newFixedName}
          newFixedAmount={newFixedAmount}
          computedFixedItems={computedFixedItems}
          totalFixedValue={totalFixedValue}
          totalVariableValue={totalVariableValue}
          onVariableItemsChange={setVariableItems}
          onFixedItemsChange={setFixedItems}
          onExportExcel={handleExportExcel}
          isExtensionPlan={isExtensionPlan}
          onSaveAndCompare={handleSaveAndCompare}
          onIncludeLoanInterestChange={setIncludeLoanInterest}
          onLoanPrincipalChange={setLoanPrincipal}
          onLoanAnnualRateChange={setLoanAnnualRate}
          onLoanTermMonthsChange={setLoanTermMonths}
          onNewVariableNameChange={setNewVariableName}
          onNewVariableAmountChange={setNewVariableAmount}
          onNewFixedNameChange={setNewFixedName}
          onNewFixedAmountChange={setNewFixedAmount}
        />
      </main>
    </div>
  );
}
