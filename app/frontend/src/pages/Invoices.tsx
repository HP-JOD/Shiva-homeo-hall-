import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, inr } from '@/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Download } from 'lucide-react';

interface Invoice {
  id: string;
  invoice_no: string;
  customer_name: string;
  date: string;
  status: string;
  grand_total: number;
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl text-primary">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-2">Manage and track all invoices</p>
        </div>
        <Link to="/billing">
          <Button className="bg-accent hover:bg-accent/90">
            <Plus className="w-4 h-4 mr-2" /> New Invoice
          </Button>
        </Link>
      </header>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p>No invoices found. Create your first invoice.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="py-3 px-4 font-medium">{invoice.invoice_no}</td>
                    <td className="py-3 px-4 text-muted-foreground">{invoice.customer_name}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">{inr(invoice.grand_total)}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link to={`/invoices/${invoice.id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                      <button className="p-2 hover:bg-secondary rounded">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </main>
  );
}
