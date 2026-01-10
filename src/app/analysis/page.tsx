// 4단계: 분석 결과 페이지 (/analysis)
"use client";

import { useMemo, useState } from "react";
import MainHeader from "@/components/MainHeader";
import AnalysisView from "@/components/AnalysisView";

export default function AnalysisPage() {
  // TODO: 분석 데이터 실제로 받아오기
  // 현재는 화면/UX 확인용으로 더미(dummy) 데이터 사용

  // 더미 제품 정보 (앞 단계에서 받아올 값이라고 가정)
  const productName = "더미 제품명";
  const targetPrice = "50000";
  const price = Number.parseFloat(targetPrice || "0"); // 목표 판매가 문자열 → 숫자로 변환

  // -----------------------------
  // 고정비 더미 데이터
  // -----------------------------
  const dummyFixedCostItems = [
    { id: "1", name: "임대료", amount: 3000000 },
    { id: "2", name: "인건비", amount: 5000000 },
  ];

  // -----------------------------
  // 변동비 더미 데이터
  // -----------------------------
  const dummyCommission = 100; // 수수료 (앞에서 선택한 값이라고 가정)
  const dummyVariableCostItems = [
    { id: "1", name: "원자재비", amount: 5000 },
    { id: "2", name: "포장비", amount: 500 },
    { id: "3", name: "물류비", amount: 2500 },
    { id: "4", name: "수수료", amount: dummyCommission },
  ];

  // 편집 가능한 비용 상태들 (분석 페이지에서 관리)
  const [variableItems, setVariableItems] = useState(dummyVariableCostItems);
  const [fixedItems, setFixedItems] = useState(dummyFixedCostItems);
  const [includeLoanInterest, setIncludeLoanInterest] = useState(false);
  const [loanInterest, setLoanInterest] = useState(0);
  const [newVariableName, setNewVariableName] = useState("");
  const [newVariableAmount, setNewVariableAmount] = useState("");
  const [newFixedName, setNewFixedName] = useState("");
  const [newFixedAmount, setNewFixedAmount] = useState("");
  const [sunkItems, setSunkItems] = useState([
    { id: "sunk-1", name: "개발비", amount: 100000 },
    { id: "sunk-2", name: "마케팅 초기 예산", amount: 50000 },
    { id: "sunk-3", name: "웹사이트", amount: 10000 },
  ]);

  // 대출이자 포함 여부에 따른 고정비 계산
  const computedFixedItems = useMemo(() => {
    if (!includeLoanInterest) return fixedItems;
    return [
      ...fixedItems,
      { id: "loan-interest", name: "대출이자", amount: loanInterest },
    ];
  }, [fixedItems, includeLoanInterest, loanInterest]);

  // 합계 계산
  const totalFixedValue = useMemo(() => {
    return computedFixedItems.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
  }, [computedFixedItems]);

  const totalVariableValue = useMemo(() => {
    return variableItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [variableItems]);

  const totalSunkValue = useMemo(() => {
    return sunkItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [sunkItems]);

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

  const handleExportExcel = () => {
    const rows: Array<Array<string | number>> = [
      ["유닛 이코노믹스 저장"],
      ["제품명", productName],
      ["목표 판매가", price],
      ["마진율(%)", Number.isFinite(dummyMargin) ? dummyMargin.toFixed(1) : 0],
      ["월 예상 순이익", Math.round(dummyMonthlyProfit)],
      ["손익분기점(판매수량)", dummyBreakeven],
      [],
      ["변동비 항목"],
      ["항목", "금액(원)"],
      ...variableItems.map((item) => [item.name, item.amount]),
      ["변동비 합계", totalVariableValue],
      [],
      ["고정비 항목"],
      ["항목", "금액(원)"],
      ...computedFixedItems.map((item) => [item.name, item.amount]),
      ["고정비 합계", totalFixedValue],
      [],
      ["초기 투자 비용 (PSI)"],
      ["항목", "금액(원)"],
      ...sunkItems.map((item) => [item.name, item.amount]),
      ["PSI 합계", totalSunkValue],
    ];

    const escapeCell = (value: string | number) => {
      const text = String(value ?? "");
      if (/[",\n]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    };

    const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "unit-economics.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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
          loanInterest={loanInterest}
          newVariableName={newVariableName}
          newVariableAmount={newVariableAmount}
          newFixedName={newFixedName}
          newFixedAmount={newFixedAmount}
          sunkItems={sunkItems}
          computedFixedItems={computedFixedItems}
          totalFixedValue={totalFixedValue}
          totalVariableValue={totalVariableValue}
          totalSunkValue={totalSunkValue}
          onVariableItemsChange={setVariableItems}
          onFixedItemsChange={setFixedItems}
          onSunkItemsChange={setSunkItems}
          onExportExcel={handleExportExcel}
          onIncludeLoanInterestChange={setIncludeLoanInterest}
          onLoanInterestChange={setLoanInterest}
          onNewVariableNameChange={setNewVariableName}
          onNewVariableAmountChange={setNewVariableAmount}
          onNewFixedNameChange={setNewFixedName}
          onNewFixedAmountChange={setNewFixedAmount}
        />
      </main>
    </div>
  );
}
