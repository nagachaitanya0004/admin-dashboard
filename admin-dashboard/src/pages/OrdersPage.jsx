import { useState, useEffect } from 'react';
import { orders } from '@/data/dummy';
import { useTable } from '@/hooks/useTable';
import { useModal } from '@/hooks/useModal';
import DataTable from '@/components/dashboard/DataTable';
import DetailModal from '@/components/dashboard/DetailModal';
import Badge from '@/components/ui/Badge';
import { Search, Eye, Download, FileText, Calendar } from 'lucide-react';

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const modal = useModal();

  const {
    paginatedData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    sortConfig,
    handleSort,
    currentPage,
    totalPages,
    goToPage,
    pageSize,
    setPageSize,
    totalCount,
    filteredCount
  } = useTable(orders, { sort: { key: 'id', direction: 'desc' } });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    { key: 'orderId', label: 'Order ID', sortable: true, render: (row) => <span className="font-medium text-white">{row.orderId}</span> },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'product', label: 'Product', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, render: (row) => <span className="font-medium text-white">{row.amount}</span> },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (row) => <Badge variant={getStatusVariant(row.status)} className="capitalize">{row.status}</Badge>
    },
    { key: 'date', label: 'Date', sortable: true },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <button 
          onClick={(e) => { e.stopPropagation(); modal.open(row); }}
          className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in" style={{ animationDuration: '0.4s' }}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Orders</h1>
          <p className="text-slate-400 text-sm mt-1">Track and process customer orders.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white text-sm font-medium rounded-xl transition-all">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#050508] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          <select 
            value={filters.status || 'All'}
            onChange={(e) => setFilter('status', e.target.value)}
            className="px-3 py-2 bg-[#050508] border border-white/[0.06] rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {Object.keys(filters).length > 0 && (
            <button 
              onClick={() => { setFilter('status', 'All'); }}
              className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="flex items-center text-sm text-slate-500">
          Showing {filteredCount} of {totalCount} orders
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
        <DataTable 
          columns={columns}
          data={paginatedData}
          loading={loading}
          onRowClick={modal.open}
          sortConfig={sortConfig}
          onSort={handleSort}
          onResetFilters={() => { setFilter('status', 'All'); setSearchTerm(''); }}
          showPagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          filteredCount={filteredCount}
        />
      </div>

      {/* Detail Modal */}
      <DetailModal isOpen={modal.isOpen} onClose={modal.close} title="Order Details">
        {modal.data && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{modal.data.orderId}</h3>
                <p className="text-slate-400 text-sm">Customer: {modal.data.customer}</p>
              </div>
              <Badge variant={getStatusVariant(modal.data.status)} className="capitalize text-sm px-3 py-1">{modal.data.status}</Badge>
            </div>

            <hr className="border-white/[0.06]" />

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Product</p>
                <p className="text-sm font-medium text-white">{modal.data.product}</p>
                <p className="text-xs text-slate-400 mt-1">Items: {modal.data.items}</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date</p>
                <p className="text-sm font-medium text-white">{modal.data.date}</p>
                <p className="text-lg font-bold text-indigo-400 mt-1">{modal.data.amount}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button className="flex-1 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl text-sm font-medium text-white transition-colors">
                Download Invoice
              </button>
              <button className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-glass-edge">
                Update Status
              </button>
            </div>
          </div>
        )}
      </DetailModal>

    </div>
  );
}
