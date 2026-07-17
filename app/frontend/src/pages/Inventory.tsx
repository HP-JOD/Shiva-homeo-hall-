import React, { useEffect, useState } from 'react';
import { api, inr } from '@/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  potency: string;
  quantity: number;
  min_stock: number;
  price: number;
}

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({ name: '', potency: '', quantity: 0, min_stock: 10, price: 0 });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name) return;
    try {
      await api.post('/products', newProduct);
      fetchProducts();
      setNewProduct({ name: '', potency: '', quantity: 0, min_stock: 10, price: 0 });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const lowStockProducts = products.filter((p) => p.quantity < p.min_stock);

  return (
    <main className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl text-primary">Inventory</h1>
          <p className="text-sm text-muted-foreground mt-2">Manage medicines and stock levels</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </header>

      {lowStockProducts.length > 0 && (
        <Card className="p-4 border-destructive/50 bg-destructive/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">{lowStockProducts.length} items low in stock</h3>
              <p className="text-sm text-destructive/70 mt-1">
                {lowStockProducts.map((p) => p.name).join(', ')}
              </p>
            </div>
          </div>
        </Card>
      )}

      {showForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="col-span-2 px-3 py-2 border border-border rounded"
            />
            <input
              placeholder="Potency"
              value={newProduct.potency}
              onChange={(e) => setNewProduct({ ...newProduct, potency: e.target.value })}
              className="px-3 py-2 border border-border rounded"
            />
            <input
              placeholder="Price"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              className="px-3 py-2 border border-border rounded"
            />
            <input
              placeholder="Quantity"
              type="number"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
              className="px-3 py-2 border border-border rounded"
            />
            <input
              placeholder="Min Stock"
              type="number"
              value={newProduct.min_stock}
              onChange={(e) => setNewProduct({ ...newProduct, min_stock: parseInt(e.target.value) })}
              className="px-3 py-2 border border-border rounded"
            />
            <div className="flex gap-2 col-span-2">
              <Button onClick={handleAddProduct} className="bg-accent">Add</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p>No products. Add your first medicine.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Potency</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Min Stock</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{product.potency || '—'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={product.quantity < product.min_stock ? 'text-destructive font-semibold' : ''}
                      >
                        {product.quantity} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{product.min_stock}</td>
                    <td className="py-3 px-4">{inr(product.price)}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button className="p-2 hover:bg-secondary rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-secondary rounded">
                        <Trash2 className="w-4 h-4 text-destructive" />
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
