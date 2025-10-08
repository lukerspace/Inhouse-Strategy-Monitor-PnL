import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Target, Zap } from "lucide-react";

export const PerformanceMetrics = () => {
  const metrics = [
    {
      title: "Today's P&L",
      value: "$34,827",
      change: "+2.1%",
      isPositive: true,
      icon: TrendingUp
    },
    {
      title: "Active Strategies",
      value: "3",
      // change: "100% uptime",
      // isPositive: true,
      icon: Target
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="gradient-card border-border/50 p-4 hover:border-primary/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{metric.title}</p>
              <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
              <p className={`text-sm font-medium ${metric.isPositive ? 'text-profit' : 'text-loss'}`}>
                {metric.change}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};