import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import { buildOption, SeriesItem } from "./EchartSetting";

interface EquitiesChartProps {
  equitySeries: SeriesItem[] | null;
}

const EquitiesChart: React.FC<EquitiesChartProps> = ({ equitySeries }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  const option = useMemo(
    () => (equitySeries ? buildOption(equitySeries) : null),
    [equitySeries]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize chart once
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current);
      const ro = new ResizeObserver(() => chartRef.current?.resize());
      ro.observe(containerRef.current);
      (chartRef.current as any).__ro = ro;
    }

    // Update chart when option changes
    if (option) {
      chartRef.current.setOption(option, true);
    }
  }, [option]);

  // Cleanup
  useEffect(() => {
    return () => {
      const c = chartRef.current as any;
      if (c?.__ro) {
        c.__ro.disconnect();
        delete c.__ro;
      }
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  if (!equitySeries || equitySeries.length === 0)
    return <p className="p-6 text-center">No data available</p>;

  return <div ref={containerRef} style={{ width: "95%", height: "85vh" }} />;
};

export default EquitiesChart;
