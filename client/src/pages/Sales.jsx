import { useEffect, useState } from 'react';
import { getSales, createSale, getProducts } from '../api';
import Modal from '../components/Modal';
import { Plus, ShoppingCart } from 'lucide-react';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ product_id: '', quantity: 1 });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    getSales({ limit: 100 }).then(r => setSales(r.data));
    getProducts().then(r => setProducts(r.data));
  };

  useEffect(() => { load(); }, []);

  const selectedProduct = products.find(p => p.id === Number(form.product_id));

  const handleSell = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createSale({ product_id: Number(form.product_id), quantity: Number(form.quantity) });
      setModal(false);
      setForm({ product_id: '', quantity: 1 });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Error recording sale');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <button
          onClick={() => { setModal(true); setError(''); setForm({ product_id: '', quantity: 1 }); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} /> Record Sale
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['#', 'Product', 'Qty', 'Unit Price', 'Total', 'Date'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sales.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <ShoppingCart size={32} className="mx-auto mb-2 opacity-40" />
                    No sales recorded yet
                  </td>
                </tr>
              )}
              {sales.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">#{s.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{s.product_name}</td>
                  <td className="px-4 py-3 text-gray-700">{s.quantity}</td>
                  <td className="px-4 py-3 text-gray-700">${Number(s.unit_price).toFixed(2)}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">${Number(s.total).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(s.sold_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title="Record Sale" onClose={() => setModal(false)}>
          <form onSubmit={handleSell} className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
              <select
                required
                value={form.product_id}
                onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — Stock: {p.stock} — ${Number(p.price).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                required
                type="number"
                min="1"
                max={selectedProduct?.stock}
                value={form.quantity}
                onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {selectedProduct && (
              <div className="bg-indigo-50 rounded-lg px-4 py-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit price:</span>
                  <span className="font-medium">${Number(selectedProduct.price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-700">Total:</span>
                  <span className="text-indigo-700">${(selectedProduct.price * Number(form.quantity)).toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                {saving ? 'Recording...' : 'Confirm Sale'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
