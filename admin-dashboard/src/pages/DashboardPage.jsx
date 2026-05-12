import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/dashboard/StatCard';
import { Users, ShoppingCart, DollarSign, ListTodo, ArrowRight } from 'lucide-react';
import { orders } from '@/data/dummy';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const statsData = [
    { title: 'Total Users', value: '84,291', change: '+12.5%', changeType: 'success', icon: Users, color: 'indigo' },
    { title: 'Total Orders', value: '12,847', change: '+8.2%', changeType: 'success', icon: ShoppingCart, color: 'emerald' },
    { title: 'Total Revenue', value: '$2.4M', change: '+18.7%', changeType: 'success', icon: DollarSign, color: 'amber' },
    { title: 'Pending Tasks', value: '143', change: '-3.1%', changeType: 'danger', icon: ListTodo, color: 'rose' },
  ];

  const recentOrders = orders.slice(0, 5);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'processing': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
      case 'pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'cancelled': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ animationDuration: '0.4s' }}>
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Good morning, {user?.name || 'Admin'} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Here is what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsData.map((stat, i) => (
          <StatCard key={i} {...stat} loading={loading} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders (takes up 2 cols on lg) */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Recent Orders</h2>
            <button className="text-sm font-medium text-primary hover:text-indigo-400 flex items-center transition-colors">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-[0.7rem] uppercase tracking-wider text-slate-500 bg-white/[0.01]">
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="relative overflow-hidden border-b border-white/[0.02]">
                      <td colSpan="5" className="px-6 py-5">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />
                        <div className="flex items-center justify-between opacity-50">
                          <div className="h-4 bg-white/10 rounded w-20" />
                          <div className="h-4 bg-white/10 rounded w-32" />
                          <div className="h-4 bg-white/10 rounded w-40" />
                          <div className="h-4 bg-white/10 rounded w-16" />
                          <div className="h-5 bg-white/10 rounded-full w-20" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-300">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {order.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                        {order.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize", getStatusColor(order.status))}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats Placeholder */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-medium text-white mb-6">Quick Stats</h2>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/[0.1] rounded-xl">
            <p className="text-sm text-slate-500">Analytics chart placeholder</p>
          </div>
        </div>

      </div>
    </div>
  );
}
