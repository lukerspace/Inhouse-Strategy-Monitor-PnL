import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, Activity, TrendingUp, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import EquitiesChart from "@/components/EquitiesChart";
import { SeriesItem } from "@/components/EchartSetting";

interface DashboardTemplateProps {
  apiEndpoint: string; // <-- Flexible API endpoint
  title: string; // e.g., "USA Model 2"
  description?: string; // optional subtitle
}

interface PendingOrder {
  submittedTime: number;
  ticker: string;
  action: string;
  quantity: number;
  orderType: string;
  executePrice: number | null;
  comment: string | null;
}

interface FilledOrder {
  date: number;
  ticker: string;
  action: string;
  quantity: number;
  price: number;
  fee: number;
  comment: string | null;
}

interface Trade {
  ticker: string;
  share: number;
  enterDate: number;
  enterPrice: number;
  exitDate: number | null;
  exitPrice: number | null;
  exitReason: string | null;
  todayPrice: number;
  profitPercent: number;
  maxGainPercent: number;
  maxLossPercent: number;
  days: number;
}

interface StrategyStatus {
  totalPnl: number;
  totalReturn: number;
  activePos: number;
  winRate: number;
}

interface EquitySeries {
  title: string;
  series: SeriesItem[];
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  apiEndpoint,
  title,
  description,
}) => {
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [filledOrders, setFilledOrders] = useState<FilledOrder[]>([]);
  const [tradeBook, setTradeBook] = useState<Trade[]>([]);
  const [status, setStatus] = useState<StrategyStatus>({
    totalPnl: 0,
    totalReturn: 0,
    activePos: 0,
    winRate: 0,
  });
  const [datetime, setDatetime] = useState(Date.now());
  const [equitySeriesList, setEquitySeriesList] = useState<EquitySeries[]>([]);
  const [equitySeries, setEquitySeries] = useState<SeriesItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(apiEndpoint)
      .then((res) => res.json())
      .then((data) => {
        setPendingOrders(data.pendingOrders || []);
        setFilledOrders(data.filledOrders || []);
        setTradeBook(data.tradebook || []);
        setStatus(data.status || {});
        setDatetime(data.datetime || Date.now());
        setEquitySeriesList(data.equitySeries ?? []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || String(err));
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      });
  }, [apiEndpoint]);

  const formatDate = (timestamp: number | null) =>
    timestamp
      ? new Date(timestamp).toLocaleDateString("en-US", { timeZone: "UTC" })
      : "-";
  const formatCurrency = (v: number | null) =>
    v == null ? "-" : `$${v.toFixed(2)}`;
  const formatPercent = (v: number | null) =>
    v == null ? "-" : `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
  const profitClass = (v: number | null) =>
    v == null ? "text-muted-foreground" : v >= 0 ? "text-profit" : "text-loss";

  if (loading) return <p className="p-6">Loading data...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Last Update: {formatDate(datetime)}</span>
          </div>
        </div>

        {/* Strategy Status */}
        <Card className="gradient-card border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Strategy Status
              </CardTitle>
              <Badge className="bg-profit/10 text-profit border-profit/20">
                <Activity className="w-3 h-3 mr-1" /> ACTIVE
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total P&L</p>
                <p
                  className={`text-xl font-bold ${profitClass(
                    status.totalPnl
                  )}`}
                >
                  {formatCurrency(status.totalPnl)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Return</p>
                <p
                  className={`text-xl font-bold ${profitClass(
                    status.totalReturn
                  )}`}
                >
                  {formatPercent(status.totalReturn)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Active Positions
                </p>
                <p className="text-xl font-bold">{status.activePos}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
                <p className="text-xl font-bold">
                  {formatPercent(status.winRate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Current Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Execute Price</TableHead>
                  <TableHead>Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingOrders.map((o, i) => (
                  <TableRow key={i}>
                    <TableCell>{formatDate(o.submittedTime)}</TableCell>
                    <TableCell className="font-medium">{o.ticker}</TableCell>
                    <TableCell>{o.action}</TableCell>
                    <TableCell>{o.quantity}</TableCell>
                    <TableCell>{o.orderType}</TableCell>
                    <TableCell>{formatCurrency(o.executePrice)}</TableCell>
                    <TableCell>{o.comment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Filled Orders */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Today's Filled Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filledOrders.map((o, i) => (
                  <TableRow key={i}>
                    <TableCell>{formatDate(o.date)}</TableCell>
                    <TableCell>{o.ticker}</TableCell>
                    <TableCell>{o.action}</TableCell>
                    <TableCell>{o.quantity}</TableCell>
                    <TableCell>{formatCurrency(o.price)}</TableCell>
                    <TableCell>{formatCurrency(o.fee)}</TableCell>
                    <TableCell>{o.comment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Trade Book */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Trade Book
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticker</TableHead>
                    <TableHead>Enter Date</TableHead>
                    <TableHead>Enter Price</TableHead>
                    <TableHead>Exit Date</TableHead>
                    <TableHead>Exit Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Today Price</TableHead>
                    <TableHead>Profit %</TableHead>
                    <TableHead>Max Gain %</TableHead>
                    <TableHead>Max Loss %</TableHead>
                    <TableHead>Days</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradeBook.map((t, i) => (
                    <TableRow key={i}>
                      <TableCell>{t.ticker}</TableCell>
                      <TableCell>{formatDate(t.enterDate)}</TableCell>
                      <TableCell>{formatCurrency(t.enterPrice)}</TableCell>
                      <TableCell>{formatDate(t.exitDate)}</TableCell>
                      <TableCell>{formatCurrency(t.exitPrice)}</TableCell>
                      <TableCell>
                        {t.exitReason ? (
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            {t.exitReason}
                          </Badge>
                        ) : (
                          <Badge
                            className={
                              t.share > 0
                                ? "border-transparent bg-green-100 text-green-700 hover:bg-green-200"
                                : "border-transparent bg-red-100 text-red-700 hover:bg-red-200"
                            }
                          >
                            OPEN
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatCurrency(t.todayPrice)}</TableCell>
                      <TableCell className={profitClass(t.profitPercent)}>
                        {formatPercent(t.profitPercent)}
                      </TableCell>
                      <TableCell className="text-profit">
                        {formatPercent(t.maxGainPercent)}
                      </TableCell>
                      <TableCell className="text-loss">
                        {formatPercent(t.maxLossPercent)}
                      </TableCell>
                      <TableCell>{t.days}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Equity Chart */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Interactive Plot
            </CardTitle>
          </CardHeader>
          {equitySeriesList.map((item, index) => (
            <CardContent key={index}>
              <h2 className="text-xl font-semibold text-center mb-4">
                {item.title}
              </h2>
              <EquitiesChart equitySeries={item.series} />
            </CardContent>
          ))}
        </Card>
      </main>
    </div>
  );
};

export default DashboardTemplate;
