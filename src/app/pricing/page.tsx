"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

// 고정비 / 변동비 공통 구조
type CostItem = {
  id: string;
  name: string;
  amount: number;
};

/**
 * UnifiedCostChart 컴포넌트 Props
 * - 고정비 배열
 * - 변동비 배열
 */
type UnifiedCostChartProps = {
  fixedCosts: CostItem[];
  variableCosts: CostItem[];
};

/**
 * 오렌지 계열 색상 팔레트 생성 함수
 * - 항목 개수만큼 색상을 잘라서 사용
 * - 차트 항목 수가 많아져도 색이 반복되지 않도록 대비
 */
const generateOrangeShades = (count: number) => {
  const baseColors = [
    "#FF6B00",
    "#FF8533",
    "#FF9F66",
    "#FFB380",
    "#FFC799",
    "#E65A00",
    "#CC5000",
    "#B34600",
    "#FFDAB3",
    "#FFEDCC",
    "#D94A00",
    "#FF7A1A",
    "#FF9E4D",
    "#FFB880",
  ];

  // 항목이 0개일 때를 방지하기 위해 최소 1개 보장
  return baseColors.slice(0, Math.max(count, 1));
};

export default function UnifiedCostChart({
  fixedCosts,
  variableCosts,
}: UnifiedCostChartProps) {
  /**
   * 고정비 + 변동비를 하나의 배열로 병합
   * - 차트는 단일 데이터 배열을 요구하기 때문
   * - name에 "(고정비)/(변동비)"를 붙여 구분
   */
  const allCosts = [
    ...fixedCosts.map((item) => ({
      name: `${item.name} (고정비)`,
      value: item.amount,
      category: "fixed" as const,
    })),
    ...variableCosts.map((item) => ({
      name: `${item.name} (변동비)`,
      value: item.amount,
      category: "variable" as const,
    })),
  ];

  // 항목 개수에 맞는 색상 목록 생성
  const colors = generateOrangeShades(allCosts.length);

  /**
   * 차트에 실제로 전달될 데이터
   * - 색상(color)을 각 항목에 매칭
   */
  const data = allCosts.map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
  }));

  /**
   * 고정비 / 변동비 / 전체 비용 합계 계산
   * - 현재 컴포넌트에서는 직접 사용하지 않지만
   * - 추후 비율 표시, 중앙 텍스트 등에 활용 가능
   */
  const totalFixed = fixedCosts.reduce((sum, item) => sum + item.amount, 0);
  const totalVariable = variableCosts.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const grandTotal = totalFixed + totalVariable;

  return (
    <div className="space-y-6">
      {data.length > 0 ? (
        /**
         * 비용 항목이 하나라도 있을 때 → 도넛 차트 표시
         */
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>

              {/* 마우스 오버 시 툴팁 */}
              <Tooltip
                formatter={(value, name) => {
                  const numericValue =
                    typeof value === "number" ? value : Number(value);

                  return [`₩${numericValue.toLocaleString()}`, name];
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  padding: "12px",
                  backgroundColor: "white",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />

              {/* 범례 (항목 이름 표시) */}
              <Legend
                verticalAlign="bottom"
                height={60}
                formatter={(value) => <span className="text-sm">{value}</span>}
                wrapperStyle={{ paddingTop: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /**
         * 비용 항목이 하나도 없을 때 안내 메시지
         */
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">
            비용 항목을 추가하면 차트가 표시됩니다
          </p>
        </div>
      )}
    </div>
  );
}
