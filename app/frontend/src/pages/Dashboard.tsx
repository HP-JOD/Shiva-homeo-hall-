import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { api, inr } from "@/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
  Plus,
  AlertCircle,
} from "lucide-react";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  testid: string;
  isLoading?: boolean;
}

interface DashboardStats {
  today_sales: number;
  total_sales: number;
  total_invoices: number;
  total_products: number;
  recent_invoices: Invoice[];
  low_stock_items: Product[];
}

interface Invoice {
  id: string;
  invoice_no: string;
  customer_name?: string;
  date: string;
  grand_total: number;
}

interface Product {
  id: string;
  name: string;
  potency?: string;
  quantity: number;
}

interface DashboardState {
  data: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

// ============================================================
// SKELETON LOADER
// ============================================================

function StatSkeleton() {
  return (
    <Card className="p-5 border-border bg-card animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-full">
          <div className="h-3 bg-muted rounded w-24 mb-2"></div>
          <div className="h-8 bg-muted rounded w-32"></div>
        </div>
        <div className="w-9 h-9 rounded-md bg-muted flex-shrink-0"></div>
      </div>
    </Card>
  );
}

// ============================================================
// STAT CARD COMPONENT
// ============================================================

function StatCard({
  label,
  value,
  icon: Icon,
  testid,
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return <StatSkeleton />;
  }

  return (
    <Card className="p-5 border-border bg-card" data-testid={testid}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 text-3xl font-serif text-primary tabular">
            {value}
          </div>
        </div>
        <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-primary" strokeWidth={1.75} />
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// RECENT INVOICES SECTION
// ============================================================

interface RecentInvoicesSectionProps {
  invoices: Invoice[];
  isLoading: boolean;
}

function RecentInvoicesSection({ invoices, isLoading }: RecentInvoicesSectionProps) {
  if (isLoading) {
    return (
      <Card className="lg:col-span-2 p-6 border-border bg-card animate-pulse">
        <div className="h-8 bg-muted rounded w-40 mb-6"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 p-6 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl text-primary">Recent Invoices</h2>
        <Link
          to="/invoices"
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
        >
          View all
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground text-sm">
          <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No invoices yet. Create your first bill.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2 pr-2">Invoice #</th>
                <th className="py-2 px-2">Customer</th>
                <th className="py-2 px-2">Date</th>
                <th className="py-2 pl-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-border/50 hover:bg-secondary/40 transition-colors"
                >
                  <td className="py-3 pr-2 font-medium">
                    <Link
                      to={`/invoices/${invoice.id}`}
                      className="hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded px-1"
                      aria-label={`View invoice ${invoice.invoice_no}`}
                    >
                      {invoice.invoice_no}
                    </Link>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">
                    {invoice.customer_name || "Walk-in"}
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 pl-2 text-right tabular">
                    {inr(invoice.grand_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

// ============================================================
// LOW STOCK SECTION
// ============================================================

interface LowStockSectionProps {
  items: Product[];
  isLoading: boolean;
}

function LowStockSection({ items, isLoading }: LowStockSectionProps) {
  if (isLoading) {
    return (
      <Card className="p-6 border-border bg-card animate-pulse">
        <div className="h-8 bg-muted rounded w-40 mb-6"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-border bg-card">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle
          className="w-4 h-4 text-destructive flex-shrink-0"
          aria-hidden="true"
        />
        <h2 className="font-serif text-2xl text-primary">Low Stock</h2>
      </div>

      {items.length === 0 ? (
        <div className="py-6 text-center">
          <div className="text-green-600 text-2xl mb-2">✓</div>
          <p className="text-sm text-muted-foreground">
            All medicines are well stocked.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border" role="list">
          {items.map((product) => (
            <li
              key={product.id}
              className="py-3 flex items-center justify-between hover:bg-secondary/20 px-2 -mx-2 rounded transition-colors"
              role="listitem"
            >
              <div>
                <div className="text-sm font-medium">{product.name}</div>
                <div className="text-xs text-muted-foreground">
                  {product.potency || "—"}
                </div>
              </div>
              <div className="text-sm tabular text-destructive font-semibold">
                {product.quantity} units
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

// ============================================================
// ERROR ALERT COMPONENT
// ============================================================

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
}

function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div
      className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 flex items-start gap-3 mb-6"
      role="alert"
    >
      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-destructive">{message}</p>
        <p className="text-xs text-destructive/70 mt-1">
          Some dashboard data may be unavailable.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="flex-shrink-0"
      >
        Retry
      </Button>
    </div>
  );
}

// ============================================================
// MAIN DASHBOARD COMPONENT
// ============================================================

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchStats = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.get("/stats");

      if (!response.data) {
        throw new Error("No data received from server");
      }

      setState({
        data: response.data as DashboardStats,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load dashboard stats";

      console.error("Dashboard stats error:", err);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  useEffect(() => {
    fetchStats();

    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const { data, isLoading, error } = state;

  // Memoize computed values
  const stats = useMemo(
    () => ({
      todaySales: inr(data?.today_sales || 0),
      totalSales: inr(data?.total_sales || 0),
      totalInvoices: data?.total_invoices ?? 0,
      totalProducts: data?.total_products ?? 0,
    }),
    [data]
  );

  return (
    <main className="space-y-8" data-testid="dashboard-page">
      {/* HEADER */}
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Overview
          </div>
          <h1 className="font-serif text-5xl text-primary mt-1">
            Good day at the counter.
          </h1>
        </div>
        <Link to="/billing">
          <Button
            data-testid="new-invoice-btn"
            className="bg-accent hover:bg-accent/90 text-accent-foreground press transition-all"
          >
            <Plus className="w-4 h-4 mr-1" aria-hidden="true" /> New Invoice
          </Button>
        </Link>
      </header>

      {/* ERROR ALERT */}
      {error && <ErrorAlert message={error} onRetry={fetchStats} />}

      {/* STATS GRID */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Key statistics">
        <StatCard
          label="Today's Sales"
          value={stats.todaySales}
          icon={TrendingUp}
          testid="stat-today-sales"
          isLoading={isLoading}
        />
        <StatCard
          label="Total Sales"
          value={stats.totalSales}
          icon={Receipt}
          testid="stat-total-sales"
          isLoading={isLoading}
        />
        <StatCard
          label="Invoices"
          value={stats.totalInvoices}
          icon={Receipt}
          testid="stat-total-invoices"
          isLoading={isLoading}
        />
        <StatCard
          label="Medicines"
          value={stats.totalProducts}
          icon={Package}
          testid="stat-total-products"
          isLoading={isLoading}
        />
      </section>

      {/* INVOICES & LOW STOCK */}
      <section
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        aria-label="Recent activity and alerts"
      >
        <RecentInvoicesSection
          invoices={data?.recent_invoices || []}
          isLoading={isLoading}
        />
        <LowStockSection
          items={data?.low_stock_items || []}
          isLoading={isLoading}
        />
      </section>

      {/* QUICK ACTIONS */}
      <section className="flex flex-wrap gap-3" aria-label="Quick actions">
        <Link to="/inventory">
          <Button
            variant="outline"
            data-testid="quick-inventory"
            className="press transition-all focus:ring-2 focus:ring-accent"
          >
            <Package className="w-4 h-4 mr-2" aria-hidden="true" /> Manage
            Stock
          </Button>
        </Link>
        <Link to="/customers">
          <Button
            variant="outline"
            data-testid="quick-customers"
            className="press transition-all focus:ring-2 focus:ring-accent"
          >
            <Users className="w-4 h-4 mr-2" aria-hidden="true" /> Customers
          </Button>
        </Link>
      </section>
    </main>
  );
}
