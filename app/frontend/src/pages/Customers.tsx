import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Phone, Mail } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Doe',
      phone: '9876543210',
      email: 'john@example.com',
      address: '123 Main St, City',
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '9876543211',
      email: 'jane@example.com',
      address: '456 Oak Ave, City',
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', address: '' });

  const handleAddCustomer = () => {
    if (!newCustomer.name) return;
    setCustomers([...customers, { id: Date.now().toString(), ...newCustomer }]);
    setNewCustomer({ name: '', phone: '', email: '', address: '' });
    setShowForm(false);
  };

  return (
    <main className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl text-primary">Customers</h1>
          <p className="text-sm text-muted-foreground mt-2">Manage customer information</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Add Customer
        </Button>
      </header>

      {showForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Full Name"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="col-span-2 px-3 py-2 border border-border rounded"
            />
            <input
              placeholder="Phone"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              className="px-3 py-2 border border-border rounded"
            />
            <input
              placeholder="Email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              className="px-3 py-2 border border-border rounded"
            />
            <input
              placeholder="Address"
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
              className="col-span-2 px-3 py-2 border border-border rounded"
            />
            <div className="flex gap-2 col-span-2">
              <Button onClick={handleAddCustomer} className="bg-accent">Add</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <Card key={customer.id} className="p-6">
            <h3 className="text-lg font-semibold mb-3">{customer.name}</h3>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {customer.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {customer.email}
              </div>
              <p className="text-xs">{customer.address}</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded flex items-center justify-center gap-2">
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button className="flex-1 px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
