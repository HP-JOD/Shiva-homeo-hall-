
Action: file_editor view /app/frontend/src/pages/Dashboard.jsx
Observation: [Showing lines 1-123 of 123 total] /app/frontend/src/pages/Dashboard.jsx:
1|import React, { useEffect, useState } from "react";
2|import { Link } from "react-router-dom";
3|import { api, inr } from "@/api";
4|import { Card } from "@/components/ui/card";
5|import { Button } from "@/components/ui/button";
6|import { Receipt, Package, Users, TrendingUp, AlertTriangle, Plus } from "lucide-react";
7|
8|function Stat({ label, value, icon: Icon, testid }) {
9|  return (
10|    <Card className="p-5 border-border bg-card" data-testid={testid}>
11|      <div className="flex items-start justify-between">
12|        <div>
13|          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
14|          <div className="mt-2 text-3xl font-serif text-primary tabular">{value}</div>
15|        </div>
16|        <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center">
17|          <Icon className="w-4 h-4 text-primary" strokeWidth={1.75} />
18|        </div>
19|      </div>
20|    </Card>
21|  );
22|}
23|
24|export default function Dashboard() {
25|  const [s, setS] = useState(null);
26|  useEffect(() => {
27|    api.get("/stats").then((r) => setS(r.data)).catch(() => {});
28|  }, []);
29|
30|  return (
31|    <div className="space-y-8" data-testid="dashboard-page">
32|      <header className="flex items-end justify-between flex-wrap gap-4">
33|        <div>
34|          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Overview</div>
35|          <h1 className="font-serif text-5xl text-primary mt-1">Good day at the counter.</h1>
36|        </div>
37|        <Link to="/billing">
38|          <Button data-testid="new-invoice-btn" className="bg-accent hover:bg-accent/90 text-accent-foreground press">
39|            <Plus className="w-4 h-4 mr-1" /> New Invoice
40|          </Button>
41|        </Link>
42|      </header>
43|
44|      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
45|        <Stat label="Today's Sales" value={inr(s?.today_sales || 0)} icon={TrendingUp} testid="stat-today-sales" />
46|        <Stat label="Total Sales" value={inr(s?.total_sales || 0)} icon={Receipt} testid="stat-total-sales" />
47|        <Stat label="Invoices" value={s?.total_invoices ?? 0} icon={Receipt} testid="stat-total-invoices" />
48|        <Stat label="Medicines" value={s?.total_products ?? 0} icon={Package} testid="stat-total-products" />
49|      </section>
50|
51|      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
52|        <Card className="lg:col-span-2 p-6 border-border bg-card">
53|          <div className="flex items-center justify-between mb-4">
54|            <h2 className="font-serif text-2xl text-primary">Recent Invoices</h2>
55|            <Link to="/invoices" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-accent">
56|              View all
57|            </Link>
58|          </div>
59|          <div className="overflow-x-auto">
60|            <table className="w-full text-sm">
61|              <thead>
62|                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
63|                  <th className="py-2 pr-2">Invoice #</th>
64|                  <th className="py-2 px-2">Customer</th>
65|                  <th className="py-2 px-2">Date</th>
66|                  <th className="py-2 pl-2 text-right">Amount</th>
67|                </tr>
68|              </thead>
69|              <tbody>
70|                {(s?.recent_invoices || []).map((r) => (
71|                  <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/40">
72|                    <td className="py-3 pr-2 font-medium">
73|                      <Link to={`/invoices/${r.id}`} className="hover:text-accent">{r.invoice_no}</Link>
74|                    </td>
75|                    <td className="py-3 px-2 text-muted-foreground">{r.customer_name || "Walk-in"}</td>
76|                    <td className="py-3 px-2 text-muted-foreground">{r.date?.slice(0, 10)}</td>
77|                    <td className="py-3 pl-2 text-right tabular">{inr(r.grand_total)}</td>
78|                  </tr>
79|                ))}
80|                {(!s?.recent_invoices || s.recent_invoices.length === 0) && (
81|                  <tr><td colSpan={4} className="py-10 text-center text-muted-foreground text-sm">
82|                    No invoices yet. Create your first bill.
83|                  </td></tr>
84|                )}
85|              </tbody>
86|            </table>
87|          </div>
88|        </Card>
89|
90|        <Card className="p-6 border-border bg-card">
91|          <div className="flex items-center gap-2 mb-4">
92|            <AlertTriangle className="w-4 h-4 text-destructive" />
93|            <h2 className="font-serif text-2xl text-primary">Low Stock</h2>
94|          </div>
95|          <ul className="divide-y divide-border">
96|            {(s?.low_stock_items || []).map((p) => (
97|              <li key={p.id} className="py-3 flex items-center justify-between">
98|                <div>
99|                  <div className="text-sm font-medium">{p.name}</div>
100|                  <div className="text-xs text-muted-foreground">{p.potency || "—"}</div>
101|                </div>
102|                <div className="text-sm tabular text-destructive">{p.quantity}</div>
103|              </li>
104|            ))}
105|            {(!s?.low_stock_items || s.low_stock_items.length === 0) && (
106|              <li className="py-6 text-sm text-muted-foreground">All medicines are well stocked.</li>
107|            )}
108|          </ul>
109|        </Card>
110|      </section>
111|
112|      <section className="flex flex-wrap gap-3">
113|        <Link to="/inventory"><Button variant="outline" data-testid="quick-inventory" className="press">
114|          <Package className="w-4 h-4 mr-2" /> Manage Stock
115|        </Button></Link>
116|        <Link to="/customers"><Button variant="outline" data-testid="quick-customers" className="press">
117|          <Users className="w-4 h-4 mr-2" /> Customers
118|        </Button></Link>
119|      </section>
120|    </div>
121|  );
122|}
123|
[End of file]
