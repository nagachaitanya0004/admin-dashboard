import { useState, useEffect } from 'react';
import { products } from '@/data/dummy';
import { useTable } from '@/hooks/useTable';
import { useModal } from '@/hooks/useModal';
import DataTable from '@/components/dashboard/DataTable';
import DetailModal from '@/components/dashboard/DetailModal';
import Badge from '@/components/ui/Badge';
import { Search, Eye, Plus, Package, Star, TrendingUp } from 'lucide-react';

export default function ProductsPage() {
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
  } = useTable(products, { sort: { key: 'sales', direction: 'desc' } });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'In Stock': return 'success';
      case 'Low Stock': return 'warning';
      case 'Out of Stock': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    { key: 'name', label: 'Product Name', sortable: true, render: (row) => <span className="font-medium text-white">{row.name}</span> },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'price', label: 'Price', sortable: true, render: (row) => <span className="font-medium text-white">{row.price}</span> },
    { key: 'stock', label: 'Stock', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (row) => <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
    },
    { 
      key: 'rating', 
      label: 'Rating', 
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{row.rating}</span>
        </div>
      )
    },
    { key: 'sales', label: 'Sales', sortable: true },
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
          <h1 className="text-2xl font-semibold text-white tracking-tight">Products</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your inventory and catalog.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl shadow-glass-edge transition-all hover:scale-[1.02] hover:shadow-premium-glow">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#050508] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          <select 
            value={filters.category || 'All'}
            onChange={(e) => setFilter('category', e.target.value)}
            className="px-3 py-2 bg-[#050508] border border-white/[0.06] rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Home">Home</option>
            <option value="Sports">Sports</option>
          </select>

          <select 
            value={filters.status || 'All'}
            onChange={(e) => setFilter('status', e.target.value)}
            className="px-3 py-2 bg-[#050508] border border-white/[0.06] rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          {Object.keys(filters).length > 0 && (
            <button 
              onClick={() => { setFilter('category', 'All'); setFilter('status', 'All'); }}
              className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="flex items-center text-sm text-slate-500">
          Showing {filteredCount} of {totalCount} products
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
          onResetFilters={() => { setFilter('category', 'All'); setFilter('status', 'All'); setSearchTerm(''); }}
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
      <DetailModal isOpen={modal.isOpen} onClose={modal.close} title="Product Details">
        {modal.data && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                <Package className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{modal.data.name}</h3>
                <p className="text-slate-400 text-sm">{modal.data.category}</p>
              </div>
            </div>

            <hr className="border-white/[0.06]" />

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5">Price / Stock</p>
                <div className="flex items-end justify-between">
                  <p className="text-lg font-bold text-white">{modal.data.price}</p>
                  <p className="text-sm font-medium text-slate-400">{modal.data.stock} left</p>
                </div>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Total Sales</p>
                <div className="flex items-end justify-between">
                  <p className="text-lg font-bold text-indigo-400">{modal.data.sales}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-slate-300">{modal.data.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button className="flex-1 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl text-sm font-medium text-white transition-colors">
                Edit Details
              </button>
            </div>
          </div>
        )}
      </DetailModal>

    </div>
  );
}
