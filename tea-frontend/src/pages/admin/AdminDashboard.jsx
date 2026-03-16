import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Spinner } from '../../components/common';

const STATUS_COLORS = {
  pending:   'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped:   'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then(r => setAnalytics(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const stats = [
    { label:'Total Revenue', value:`€${analytics?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { label:'Total Orders',  value: analytics?.totalOrders  || 0,
      icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
    { label:'Total Users',   value: analytics?.totalUsers   || 0,
      icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label:'Total Products',value: analytics?.totalProducts || 0,
      icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/></svg> },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-[#e0ddd8] p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#8a8a8a]">{s.icon}</span>
            </div>
            <p className="font-serif text-[28px] font-light text-[#1a1a1a] mb-1">{s.value}</p>
            <p className="text-[10px] tracking-[2px] uppercase font-sans text-[#8a8a8a]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Orders by Status */}
      {analytics?.ordersByStatus && (
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-[#e0ddd8] p-6">
            <h3 className="font-serif text-[18px] font-light mb-5 text-[#1a1a1a]">Orders by Status</h3>
            <div className="space-y-3">
              {analytics.ordersByStatus.map(({ _id, count }) => (
                <div key={_id} className="flex items-center justify-between">
                  <span className={`text-[10px] tracking-[1px] uppercase font-sans px-2.5 py-1 rounded-sm ${STATUS_COLORS[_id] || 'bg-gray-100 text-gray-700'}`}>
                    {_id}
                  </span>
                  <span className="text-sm font-sans font-medium text-[#1a1a1a]">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-white border border-[#e0ddd8] p-6">
            <h3 className="font-serif text-[18px] font-light mb-5 text-[#1a1a1a]">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-[#f5f5f3]">
                <span className="text-xs font-sans text-[#4a4a4a]">Avg Order Value</span>
                <span className="text-sm font-sans font-medium">
                  €{analytics.totalOrders ? (analytics.totalRevenue / analytics.totalOrders).toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f5f5f3]">
                <span className="text-xs font-sans text-[#4a4a4a]">Pending Orders</span>
                <span className="text-sm font-sans font-medium">
                  {analytics.ordersByStatus?.find(o => o._id === 'pending')?.count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-xs font-sans text-[#4a4a4a]">Delivered Orders</span>
                <span className="text-sm font-sans font-medium">
                  {analytics.ordersByStatus?.find(o => o._id === 'delivered')?.count || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {analytics?.recentOrders?.length > 0 && (
        <div className="bg-white border border-[#e0ddd8]">
          <div className="px-6 py-4 border-b border-[#e0ddd8]">
            <h3 className="font-serif text-[18px] font-light text-[#1a1a1a]">Recent Orders</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f5f5f3]">
                {['Order ID','Customer','Items','Total','Status','Date'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-[10px] tracking-[2px] uppercase font-sans text-[#8a8a8a] font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analytics.recentOrders.map(order => (
                <tr key={order._id} className="border-b border-[#f5f5f3] hover:bg-[#fafaf9] transition-colors">
                  <td className="px-6 py-4 text-[11px] font-mono font-sans text-[#4a4a4a]">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-xs font-sans text-[#1a1a1a]">
                    {order.user?.name || 'Guest'}
                  </td>
                  <td className="px-6 py-4 text-xs font-sans text-[#4a4a4a]">
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 text-xs font-sans font-medium text-[#1a1a1a]">
                    €{order.total?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] tracking-[1px] uppercase font-sans px-2 py-1 rounded-sm ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-sans text-[#8a8a8a]">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
