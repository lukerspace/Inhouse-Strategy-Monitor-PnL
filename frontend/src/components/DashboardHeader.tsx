import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, RefreshCw, Settings, Bell } from "lucide-react";
import { Link } from "react-router-dom";

export const DashboardHeader = () => {
  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <header className="gradient-header border-b border-border/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="block">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center glow-primary">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Quant Trading Dashboard</h1>
                <p className="text-sm text-muted-foreground">Real-time strategy monitoring</p>
              </div>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          {/* <div className="text-right">
            <p className="text-xs text-muted-foreground">Market Status</p>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-profit/20 text-profit border-profit/30">
                <div className="w-2 h-2 bg-profit rounded-full mr-1 animate-pulse-glow"></div>
                LIVE
              </Badge>
              <span className="text-sm text-foreground font-medium">{currentTime}</span>
            </div>
          </div> */}
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};