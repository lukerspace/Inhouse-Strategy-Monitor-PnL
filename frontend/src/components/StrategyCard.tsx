import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Clock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface Asset {
  symbol: string;
  return: number;
}

interface StrategyCardProps {
  name: string;
  periodReturn: number;
  topAssets: Asset[];
  bottomAssets: Asset[];
  lastUpdate: string;
  isActive: boolean;
  detailsUrl?: string;
}

export const StrategyCard = ({
  name,
  periodReturn,
  topAssets,
  bottomAssets,
  lastUpdate,
  isActive,
  detailsUrl
}: StrategyCardProps) => {
  const isProfitable = periodReturn >= 0;
  const returnClass = isProfitable ? "text-profit" : "text-loss";
  const glowClass = isProfitable ? "glow-profit" : "glow-loss";

  const getProfitClass = (value: number | null) => {
    if (value == null) return "text-muted-foreground";
    return value >= 0 ? "text-profit" : "text-loss";
  };
  
  return (
    <Card className={`gradient-card border-border/50 p-6 hover:border-primary/50 transition-all duration-300 ${isProfitable ? 'hover:glow-profit' : 'hover:glow-loss'}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">{name}</h3>
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
              {isActive ? "ACTIVE" : "PAUSED"}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              {lastUpdate}
            </div>
          </div>
        </div>
        {detailsUrl ? (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10" asChild>
            <Link to={detailsUrl}>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10">
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Period Return</p>
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold ${returnClass}`}>
              {periodReturn >= 0 ? '+' : ''}{periodReturn.toFixed(2)}%
            </span>
            {/* <TrendingUp className={`w-4 h-4 ${isProfitable ? 'text-profit' : 'text-loss'}`} /> */}
            {isProfitable ? (
              <TrendingUp className="w-4 h-4 text-profit" />
            ) : (
              <TrendingDown className="w-4 h-4 text-loss" />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">TOP PERFORMERS</h4>
          <div className="space-y-1">
            {topAssets.map((asset, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-foreground font-medium">{asset.symbol}</span>
                <span className={`font-semibold ${getProfitClass(asset.return)}`}>
                  {asset.return.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">BOTTOM PERFORMERS</h4>
          <div className="space-y-1">
            {bottomAssets.map((asset, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-foreground font-medium">{asset.symbol}</span>
                <span className={`font-semibold ${getProfitClass(asset.return)}`}>
                  {asset.return.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};