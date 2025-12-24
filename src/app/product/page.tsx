// 2단계: 제품 정보 입력 페이지 (/product)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainHeader from "@/components/MainHeader";
import { ProductStep, ProductLoading } from "@/components/ProductStep";

export default function ProductPage() {
  const router = useRouter();
  const [productName, setProductName] = useState(""); //제품명
  const [targetPrice, setTargetPrice] = useState(""); //목표판매가
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // async: 비동기 처리 함수
    setLoading(true);
    try {
      // TODO: 나중에 백엔드에 제품 정보 저장(API 호출, await 비동기처리(동기로. 결과가 올때까지 기다림))
      await new Promise((r) => setTimeout(r, 800)); // 데모용으로 최소 0.8초는 로딩 보여주기
      router.push("/channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MainHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {loading ? (
          <ProductLoading />
        ) : (
          <ProductStep
            productName={productName}
            targetPrice={targetPrice}
            onChangeName={setProductName}
            onChangePrice={setTargetPrice}
            onSubmit={handleSubmit}
          />
        )}
      </main>
    </div>
  );
}
