import { useEffect, useState } from 'react';
import { getDashboard } from '../api';
import StatCard from '../components/StatCard';
import { Package, Tag, AlertTriangle, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400 py-12 text-center">Loading...</div>;
  if (!data) return null;

  const { stats, topProducts, lowStockList, salesByDay } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard label="Total Products" value={stats.totalProducts} icon={Package} color="indigo" />
        <StatCard label="Categories" value={stats.totalCategories} icon={Tag} color="green" />
        <StatCard label="Low Stock Alerts" value={stats.lowStockProducts} icon={AlertTriangle} color="red" />
        <StatCard
          label="Inventory Value"
          value={`$${stats.inventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="indigo"
        />
        <StatCard
          label="Today's Sales"
          value={`$${stats.todaySales.total.toFixed(2)}`}
          icon={ShoppingCart}
          color="green"
          sub={`${stats.todaySales.units} units`}
        />
        <StatCard
          label="Month Revenue"
          value={`$${stats.monthSales.total.toFixed(2)}`}
          icon={TrendingUp}
          color="yellow"
          sub={`${stats.monthSales.units} units sold`}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Sales chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Sales - Last 30 days</h2>
          {salesByDay.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No sales yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salesByDay}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Revenue']} />
                <Area type="monotone" dataKey="total" stroke="#6366f1" fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top products */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Top Products (this month)</h2>
          {topProducts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No sales this month</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.units_sold} units</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">${p.revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Low stock */}
      {lowStockList.length > 0 && (
        <div className="bg-white rounded-xl border border-red-200 p-5">
          <h2 className="text-base font-semibold text-red-700 mb-4 flex items-center gap-2">
            <AlertTriangle size={18} /> Low Stock Alerts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockList.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-red-50 rounded-lg px-4 py-2">
                <span className="text-sm font-medium text-gray-800 truncate">{p.name}</span>
                <span className="text-sm text-red-600 font-bold ml-2">{p.stock} {p.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
