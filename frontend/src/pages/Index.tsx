import { DashboardHeader } from "@/components/DashboardHeader";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { StrategyCard } from "@/components/StrategyCard";
import React, { useEffect, useState } from "react";

type Asset = {
  symbol: string;
  return: number;
};

type Strategy = {
  name: string;
  periodReturn: number;
  topAssets: Asset[];
  bottomAssets: Asset[];
  lastUpdate: string;
  isActive: boolean;
  detailsUrl: string;
};

const Index = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      name: "TWSE Model 1",
      periodReturn: 8.42,
      topAssets: [],
      bottomAssets: [],
      lastUpdate: "2 min ago",
      isActive: false,
      detailsUrl: "/twse-model1",
    },
    {
      name: "USA Model 1",
      periodReturn: -2.15,
      topAssets: [
        { symbol: "JPM", return: 4.2 },
        { symbol: "BAC", return: 3.8 },
        { symbol: "WFC", return: 2.9 },
        { symbol: "GS", return: 2.1 },
        { symbol: "MS", return: 1.7 }
      ],
      bottomAssets: [
        { symbol: "COIN", return: -8.4 },
        { symbol: "HOOD", return: -6.7 },
        { symbol: "SQ", return: -5.3 },
        { symbol: "SHOP", return: -4.1 },
        { symbol: "ROKU", return: -3.8 }
      ],
      lastUpdate: "1 min ago",
      isActive: false,
      detailsUrl: "/usa-model1"
    },
    {
      name: "USA Model 2",
      periodReturn: 5.67,
      topAssets: [
        { symbol: "SPY", return: 3.1 },
        { symbol: "QQQ", return: 2.8 },
        { symbol: "IWM", return: 2.4 },
        { symbol: "DIA", return: 1.9 },
        { symbol: "VTI", return: 1.5 }
      ],
      bottomAssets: [
        { symbol: "TLT", return: -1.2 },
        { symbol: "GLD", return: -0.9 },
        { symbol: "SLV", return: -0.7 },
        { symbol: "UNG", return: -0.5 },
        { symbol: "USO", return: -0.3 }
      ],
      lastUpdate: "3 min ago",
      isActive: false,
      detailsUrl: "/usa-model2"
    },
    {
      name: "USA Model 3",
      periodReturn: 0,
      topAssets: [

      ],
      bottomAssets: [

      ],
      lastUpdate: "1 min ago",
      isActive: false,
      detailsUrl: "/ao-momentum"
    }
  ]);

  const fetchStrategyData = (url: string, strategyName: string) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setStrategies((prev) =>
          prev.map((s) =>
            s.name === strategyName
              ? {
                  ...s,
                  periodReturn: data.status.totalReturn,
                  lastUpdate: data.datetime,
                  isActive: true,
                  topAssets: data.tradebook
                    .filter((t) => t.profitPercent !== null)
                    .sort((a, b) => b.profitPercent - a.profitPercent)
                    .slice(0, 5)
                    .map((t) => ({
                      symbol: t.ticker.toString(),
                      return: t.profitPercent,
                    })),
                  bottomAssets: data.tradebook
                    .filter((t) => t.profitPercent !== null)
                    .sort((a, b) => a.profitPercent - b.profitPercent)
                    .slice(0, 5)
                    .map((t) => ({
                      symbol: t.ticker.toString(),
                      return: t.profitPercent,
                    })),
                }
              : s
          )
        );
      })
      .catch((err) => {
        console.error(`Error fetching ${strategyName} data:`, err);
      });
  };

  useEffect(() => {
    fetchStrategyData("http://localhost:8000/twse-model1", "TWSE Model 1");
    fetchStrategyData("http://localhost:8000/usa-model1", "USA Model 1");
    fetchStrategyData("http://localhost:8000/usa-model2", "USA Model 2");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="p-6">
        <PerformanceMetrics />
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Active Trading Strategies</h2>
          <p className="text-sm text-muted-foreground">Real-time performance monitoring and analytics</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {strategies.map((strategy, index) => (
            <StrategyCard
              key={index}
              name={strategy.name}
              periodReturn={strategy.periodReturn}
              topAssets={strategy.topAssets}
              bottomAssets={strategy.bottomAssets}
              lastUpdate={strategy.lastUpdate}
              isActive={strategy.isActive}
              detailsUrl={strategy.detailsUrl}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
