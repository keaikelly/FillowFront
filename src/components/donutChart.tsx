"use client";

import { useMemo, useState } from "react";

// ResponsiveContainer: 반응형-부모 div 크기에 맞춰 자동 리사이즈
// PieChart/Pie/Cell: 파이(도넛) 차트 본체 + 조각 색상
// Legend/Tooltip: 범례/툴팁
// TooltipProps: TS에서 formatter 타입 잡을 때 사용
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  type TooltipProps,
} from "recharts";

// 비용 (고정비, 변동비 공통): amount는 반드시 number (string이면 계산 꼬임)
type CostItem = {
  id: string;
  name: string;
  amount: number;
};

/**
  이 컴포넌트가 부모에게서 받는 값(Props)
  - 고정비 배열
  - 변동비 배열
 */
type UnifiedCostChartProps = {
  fixedCosts: CostItem[];
  variableCosts: CostItem[];
};

// 차트 색상 고정비-파랑 변동비-톤다운오렌지
const FIXED_COLORS = ["#1E3A8A", "#1D4ED8", "#60A5FA", "#BFDBFE"];

const VARIABLE_COLORS = ["#F97316", "#FB923C", "#FDBA74", "#FED7AA", "#FFEDD5"];

// 차트 조회 토글 상태: 전체, 고정비, 변동비
type ViewMode = "all" | "fixed" | "variable";

export default function UnifiedCostChart({
  fixedCosts,
  variableCosts,
}: UnifiedCostChartProps) {
  // 조회 모드 상태. 클릭으로 setView 변경. 기본은 all로
  const [view, setView] = useState<ViewMode>("all");

  /** 고정비 배열 → 차트용 데이터로 변환
   * Recharts Pie는 기본적으로 { name, value, color } 구조를 기대
   * useMemo: fixedCosts가 바뀔 때만 다시 차트 데이터 map 실행 (불필요한 재계산 방지)
   */
  const fixedData = useMemo(
    () =>
      fixedCosts.map((item, index) => ({
        name: `${item.name} (고정비)`,
        value: Number(item.amount) || 0,
        category: "fixed" as const,
        color: FIXED_COLORS[index % FIXED_COLORS.length], // 항목 수가 많으면 색 반복
      })),
    [fixedCosts]
  );

  // 변동비 배열도 차트용 데이터로 변환. 팔레트 부분만 다름
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

  // 토글(view)에 따라 실제 차트에 보여줄 데이터 결정
  const data = useMemo(() => {
    if (view === "fixed") return fixedData;
    if (view === "variable") return variableData;
    return [...fixedData, ...variableData]; //all일때는 다 해체(...) 두개를 다 넣음
  }, [view, fixedData, variableData]);

  // Tooltip 포맷터 (차트에 마우스) - 금액을 항상 "₩숫자" 형태(원화 + 천 단위 콤마)로 보여주기 위함
  // - value가 string/number 섞여 들어오는 경우를 대비해 안전하게 숫자로 변환
  const tooltipFormatter: TooltipProps<number, string>["formatter"] = (
    value,
    name
  ) => {
    const numericValue =
      typeof value === "number" ? value : Number(value ?? 0) || 0;

    // [표시할 값, 항목명] 형태로 반환 (Recharts 규칙)
    return [`₩${numericValue.toLocaleString()}`, String(name)];
  };

  // Legend formatter 차트 하단에 표시되는 범례 이름 영역. 텍스트는 진회색 고정
  const legendFormatter = (value: string | number) => (
    <span className="text-gray-700">{String(value)}</span>
  );

  return (
    <div className="space-y-6">
      {/* 보기 모드 토글 버튼들 */}
      <div className="flex items-center justify-center gap-2">
        {(
          [
            { key: "all", label: "전체" },
            { key: "fixed", label: "고정비" },
            { key: "variable", label: "변동비" },
          ] as const
        ).map((item) => {
          const isActive = view === item.key;
          // 버튼별 색상 클래스
          const activeClass =
            item.key === "fixed"
              ? "border-blue-600 bg-blue-600 text-white"
              : item.key === "variable"
              ? "border-orange-500 bg-orange-500 text-white"
              : "border-gray-700 bg-gray-700 text-white";

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setView(item.key)} // 클릭하면 view 상태 변경
              className={`h-9 rounded-full border px-4 text-sm font-medium transition-colors ${
                isActive
                  ? activeClass // 선택 상태 스타일
                  : "border-border bg-white text-muted-foreground hover:bg-muted/60" // 비선택 상태 스타일
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {data.length > 0 ? ( //데이터가 있을때만 차트 렌더링
        <div className="h-[400px]">
          {/* h-400px은 높이를 400으로 지정한 것.
          ResponsiveContainer는 부모가 "높이/너비를 실제로 가지고 있어야" 정상 동작 */}

          <ResponsiveContainer width="100%" height={400}>
            {" "}
            <PieChart>
              <Pie
                data={data} // 우리가 만든 차트 데이터
                cx="50%" // 가운데 정렬
                cy="50%"
                innerRadius={80} // 도넛 안쪽 반지름
                outerRadius={140} // 도넛 바깥 반지름
                paddingAngle={2} // 조각 사이 간격
                dataKey="value" // value 필드를 조각 크기로 사용
                animationDuration={800}
                animationBegin={0}
                labelLine={false} //조각과 라벨 연결선 제거
              >
                {/* 데이터 배열을 돌면서 각 조각(Cell)에 색상 넣기 */}
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>

              {/* 마우스 올리면 툴팁 */}
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

              {/* 아래쪽 범례 */}
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
        // 데이터가 없으면 안내문구
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">
            비용 항목을 추가하면 차트가 표시됩니다
          </p>
        </div>
      )}
    </div>
  );
}
