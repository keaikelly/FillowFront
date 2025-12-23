"use client"; //클라이언트 컴포넌트. useState, useEffect, useRouter 같은 훅을 쓰려면 반드시 필요

import { useState } from "react";
import { useRouter } from "next/navigation"; // 페이지 이동 훅 (useNavigate)
import MainHeader from "@/components/MainHeader"; // 공통 헤더 컴포넌트
import PlanStep from "@/components/PlanStep"; // 플랜 선택 UI 컴포넌트

export default function PlanPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null); //선택플랜관리

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
    // TODO: 나중에 백엔드에 선택한 플랜 저장(API 호출)
    router.push("/product");
  };

  return (
    // 전체 페이지 배경 및 최소 높이 설정
    <div>
      <MainHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* container: 가운데 정렬 
        mx-auto: 좌우마진 자동 (가운데배치) 
        px: 패딩(안쪽여백) 
        max-w: 최대너비 설정 */}

        <PlanStep
          // 현재 선택된 플랜 값 전달
          selectedPlan={selectedPlan} //선택된 플랜전달(starter, core, pro)
          onPlanSelect={handlePlanSelect}
        />
      </main>
    </div>
  );
}
