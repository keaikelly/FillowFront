// 판매 채널 선택 페이지 (/channel)

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainHeader from "@/components/MainHeader";
import ChannelStep from "@/components/ChannelStep";
import { ProductLoading } from "@/components/ProductStep";

export default function ChannelPage() {
  const router = useRouter();
  //상태가 online or offline. 초기값은 online
  const [environment, setEnvironment] = useState<"online" | "offline">(
    "online"
  );
  const [platform, setPlatform] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    // TODO: 나중에 fetch("/api/...")로 플랫폼/위치 정보를 보내고 계산을 요청
    router.push("/analysis");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 3단계 채널 선택 화면 */}
      <MainHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {loading ? (
          <ProductLoading />
        ) : (
          <ChannelStep
            environment={environment}
            platform={platform}
            location={location}
            onEnvironmentChange={setEnvironment}
            onPlatformChange={setPlatform}
            onLocationChange={setLocation}
            onBack={() => router.push("/product")}
            onCalculate={handleCalculate}
          />
        )}
      </main>
    </div>
  );
}
