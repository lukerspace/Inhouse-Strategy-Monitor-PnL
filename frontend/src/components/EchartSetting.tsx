import * as echarts from "echarts";

export type EquityPoint = { date: string; value: number };
export type SeriesItem = { Ticker: string; data: EquityPoint[] };

/**
 * 將日期統一格式化成 yyyy-MM-dd
 */
const formatDate = (input: string) => {
  const d = new Date(input);
  if (isNaN(d.getTime())) return input;
  return d.toISOString().split("T")[0];
};

/**
 * 建立 ECharts Option
 * 可重複使用在多個 Component
 */
export const buildOption = (equitySeries: SeriesItem[]) => {
  if (!Array.isArray(equitySeries) || equitySeries.length === 0) return null;

  // 收集全部日期、去重、排序
  const allDates = Array.from(
    new Set(
      equitySeries.flatMap((s) =>
        (s.data ?? []).map((p) => formatDate(p.date))
      )
    )
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const series = equitySeries.map((s) => {
    const map = new Map<string, number | null>();
    (s.data ?? []).forEach((p) => {
      const key = formatDate(p.date);
      const v = Number(p?.value);
      map.set(key, Number.isFinite(v) ? +(v * 100).toFixed(2) : null);
    });
    return {
      name: s.Ticker,
      type: "line" as const,
      showSymbol: false,
      connectNulls: true,
      smooth: false,
      lineStyle: { width: 2 },
      data: allDates.map((d) => (map.has(d) ? map.get(d) : null)),
    };
  });

  return {
    backgroundColor: "transparent",
    textStyle: { color: "#FFFFFF" },
    animation: false,
    title: {
      text: "Equities Return in Percentage %",
      left: "center",
      textStyle: { color: "#FFFFFF", fontSize: 16 },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#FFFFFF",
      textStyle: { color: "#000000" },
      borderColor: "#CCCCCC",
      borderWidth: 1,
      valueFormatter: (v: number | null) => (v == null ? "-" : `${v}%`),
    },
    legend: {
      type: "scroll",
      orient: "vertical",
      right: 10,
      top: "middle",
      textStyle: { color: "#FFFFFF" },
      data: equitySeries.map((s) => s.Ticker),
    },
    grid: {
      top: "10%",
      bottom: "10%",
      left: "10%",
      right: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: allDates,
      axisLabel: {
        rotate: 45,
        color: "#FFFFFF",
        margin: 10,
      },
      axisLine: { lineStyle: { color: "#FFFFFF" } },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value} %",
        color: "#FFFFFF",
        margin: 10,
      },
      axisLine: { lineStyle: { color: "#FFFFFF" } },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.2)" } },
    },
    series,
  } as echarts.EChartsOption;
};
