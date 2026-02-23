// 판매 채널 선택 페이지 (/channel)

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainHeader from "@/components/MainHeader";
import ChannelStep from "@/components/ChannelStep";

export default function ChannelPage() {
  const router = useRouter();
  //상태가 online or offline. 초기값은 online
  const [environment, setEnvironment] = useState<"online" | "offline">(
    "online",
  );
  const [platform, setPlatform] = useState("");
  const [location, setLocation] = useState("");
  const [commission, setCommission] = useState("");
  const [deposit, setDeposit] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");

  const handleCalculate = () => {
    //await new Promise((r) => setTimeout(r, 800));
    // TODO: 나중에 fetch("/api/...")로 플랫폼/위치 정보를 보내고 계산을 요청
    // 분석 페이지에서 같은 조건을 읽을 수 있도록 임시 저장
    localStorage.setItem(
      "simulationChannelData",
      JSON.stringify({
        environment,
        platform,
        location,
        commission,
        deposit,
        monthlyRent,
      }),
    );
    router.push("/analysis");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 3단계 채널 선택 화면 */}
      <MainHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <ChannelStep
          environment={environment}
          platform={platform}
          location={location}
          commission={commission}
          deposit={deposit}
          monthlyRent={monthlyRent}
          onEnvironmentChange={setEnvironment}
          onPlatformChange={setPlatform}
          onLocationChange={setLocation}
          onCommissionChange={setCommission}
          onDepositChange={setDeposit}
          onMonthlyRentChange={setMonthlyRent}
          onBack={() => router.push("/product")}
          onCalculate={handleCalculate}
        />
      </main>
    </div>
  );
}
