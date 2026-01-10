"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  type TooltipProps,
} from "recharts";

type CostItem = {
  id: string;
  name: string;
  amount: number; // number여야 함 (string이면 차트/합계 다 꼬임)
};

type UnifiedCostChartProps = {
  fixedCosts: CostItem[];
  variableCosts: CostItem[];
};

// 고정비(블루) / 변동비(오렌지) 팔레트
const FIXED_COLORS = ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"];
const VARIABLE_COLORS = ["#FF6B00", "#FF8533", "#FF9F66", "#FFB380", "#FFC799"];

type ViewMode = "all" | "fixed" | "variable";

export default function UnifiedCostChart({
  fixedCosts,
  variableCosts,
}: UnifiedCostChartProps) {
  const [view, setView] = useState<ViewMode>("all");

  // 1) 고정비/변동비 데이터를 차트용 형식으로 변환 (색상 포함)
  const fixedData = useMemo(
    () =>
      fixedCosts.map((item, index) => ({
        name: `${item.name} (고정비)`,
        value: Number(item.amount) || 0,
        category: "fixed" as const,
        color: FIXED_COLORS[index % FIXED_COLORS.length],
      })),
    [fixedCosts]
  );

  const variableData = useMemo(
    () =>
      variableCosts.map((item, index) => ({
        name: `${item.name} (변동비)`,
        value: Number(item.amount) || 0,
        category: "variable" as const,
        color: VARIABLE_COLORS[index % VARIABLE_COLORS.length],
      })),
    [variableCosts]
  );

  // 2) 토글(view)에 따라 표시할 데이터 선택
  const data = useMemo(() => {
    if (view === "fixed") return fixedData;
    if (view === "variable") return variableData;
    return [...fixedData, ...variableData];
  }, [view, fixedData, variableData]);

  // 4) Tooltip formatter: value가 string/number 섞여 들어와도 안전하게 처리
  const tooltipFormatter: TooltipProps<number, string>["formatter"] = (
    value,
    name
  ) => {
    const numericValue =
      typeof value === "number" ? value : Number(value ?? 0) || 0;
    return [`₩${numericValue.toLocaleString()}`, String(name)];
  };

  // 5) Legend formatter: JSX 반환하면 타입/빌드에서 터질 수 있어서 문자열로만 반환
  //    (글씨 크기 등 스타일은 wrapperStyle로 처리)
  const legendFormatter = (value: string | number) => String(value);

  return (
    <div className="space-y-6">
      {/* 보기 모드 토글 */}
      <div className="flex items-center justify-center gap-2">
        {(
          [
            { key: "all", label: "전체" },
            { key: "fixed", label: "고정비" },
            { key: "variable", label: "변동비" },
          ] as const
        ).map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setView(item.key)}
            className={`h-9 rounded-full border px-4 text-sm font-medium transition-colors ${
              view === item.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-white text-muted-foreground hover:bg-muted/60"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {data.length > 0 ? (
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
                animationDuration={800}
                animationBegin={0}
                labelLine
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                formatter={tooltipFormatter}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  padding: "12px",
                  backgroundColor: "white",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />

              <Legend
                verticalAlign="bottom"
                height={60}
                formatter={legendFormatter}
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "0.875rem", // text-sm
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">
            비용 항목을 추가하면 차트가 표시됩니다
          </p>
        </div>
      )}
    </div>
  );
}
