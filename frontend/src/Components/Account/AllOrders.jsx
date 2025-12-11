import React, { useEffect, useState, useCallback } from "react";
import { 
  Search, RefreshCw, Eye, X, Copy, 
  TrendingUp, TrendingDown, ChevronLeft, ChevronRight,
  BarChart3, AlertCircle, CheckCircle, XCircle, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-amber-50 text-amber-700 border-amber-100", icon: Clock },
  executed: { label: "Executed", color: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: CheckCircle },
  partial: { label: "Partial", color: "bg-blue-50 text-blue-700 border-blue-100", icon: AlertCircle },
  cancelled: { label: "Cancelled", color: "bg-rose-50 text-rose-700 border-rose-100", icon: XCircle },
  failed: { label: "Failed", color: "bg-gray-50 text-gray-700 border-gray-100", icon: XCircle },
};

export default function AllOrders({ apiBaseUrl = "", authToken = "" }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [cancellingIds, setCancellingIds] = useState(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Color constants
  const NEON_BLUE = "#5064FF";
  const AQUA_MINT = "#48E1C4";

  const authHeaders = {
    Authorization: authToken ? `Bearer ${authToken}` : "",
    "Content-Type": "application/json",
  };

  const buildUrl = (path, query = {}) => {
    const url = new URL(path, apiBaseUrl || window.location.origin);
    Object.entries(query).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
    return url.toString();
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = buildUrl("/orders", { status, type, page, limit });
      const res = await fetch(url, { headers: authHeaders });
      if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [status, type, page, limit]);

  const openDetails = async (id) => {
    setSelectedOrder(id);
    setDetailsLoading(true);
    try {
      const url = buildUrl(`/orders/${id}`);
      const res = await fetch(url, { headers: authHeaders });
      const data = await res.json();
      setSelectedOrder({ id, data: data.order });
    } catch (err) {
      setSelectedOrder({ id, error: err.message });
    } finally {
      setDetailsLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    setCancellingIds(s => new Set(s).add(id));
    try {
      const url = buildUrl(`/orders/${id}/cancel`);
      const res = await fetch(url, { method: "POST", headers: authHeaders });
      if (!res.ok) throw new Error("Failed to cancel order");
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "cancelled" } : o));
      if (selectedOrder?.id === id) openDetails(id);
    } catch (err) {
      alert(err.message);
    } finally {
      setCancellingIds(s => { const copy = new Set(s); copy.delete(id); return copy; });
    }
  };

  const formatCurrency = (v) => 
    typeof v === "number" ? v.toLocaleString("en-IN", { style: "currency", currency: "INR" }) : "-";

  const formatDate = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const formatFullDate = (date) => new Date(date).toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const filteredOrders = search ? orders.filter(o => 
    o.stock?.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    o.stock?.symbol?.toLowerCase().includes(search.toLowerCase()) ||
    o.id?.toLowerCase().includes(search.toLowerCase())
  ) : orders;

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  useEffect(() => { 
    fetchOrders(); 
  }, [fetchOrders]);

  const OrderRow = ({ order, index }) => {
    const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
    const StatusIcon = statusConfig.icon;
    const isProfitable = order.currentPrice > order.price;
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        className="gradient-hover stock-card-hover grid grid-cols-12 gap-4 px-5 py-4 items-center border-b border-gray-100 cursor-pointer relative overflow-hidden group"
        onClick={() => openDetails(order.id)}
      >
        {/* Company */}
        <div className="col-span-3 flex items-center gap-3">
          <div className={`logo-hover p-2 rounded-lg ${order.orderType === 'buy' ? 'bg-[#48E1C4]/20' : 'bg-[#5064FF]/20'} group-hover:scale-105 transition-transform`}>
            {order.orderType === 'buy' ? (
              <TrendingUp className="h-4 w-4 text-[#48E1C4]" />
            ) : (
              <TrendingDown className="h-4 w-4 text-[#5064FF]" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 group-hover:text-[#5064FF] transition-colors">
              {order.stock?.companyName || order.symbol}
            </div>
            <div className="text-xs text-gray-500">{order.stock?.symbol || order.id?.slice(0, 8)}</div>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="col-span-2">
          <div className={`text-xs font-medium px-3 py-1.5 rounded ${order.orderType === 'buy' ? 'bg-[#48E1C4]/10 text-[#48E1C4]' : 'bg-[#5064FF]/10 text-[#5064FF]'}`}>
            {order.orderType?.toUpperCase()} • {order.orderCategory}
          </div>
        </div>
        
        {/* Quantity */}
        <div className="col-span-2">
          <div className="text-sm font-medium text-gray-900">{order.quantity}</div>
          <div className="text-xs text-gray-500">Exec: {order.executedQuantity || 0}</div>
        </div>
        
        {/* Price */}
        <div className="col-span-1">
          <div className="text-sm font-medium text-gray-900">{formatCurrency(order.price)}</div>
        </div>
        
        {/* Current Price */}
        <div className="col-span-1">
          <motion.div 
            initial={false}
            animate={{ 
              scale: isProfitable ? [1, 1.05, 1] : 1 
            }}
            transition={{ 
              duration: 0.5,
              repeat: isProfitable ? Infinity : 0,
              repeatDelay: 3 
            }}
            className={`text-sm font-medium ${isProfitable ? 'text-[#48E1C4]' : 'text-[#5064FF]'}`}
          >
            {formatCurrency(order.currentPrice)}
          </motion.div>
        </div>
        
        {/* Status & Actions */}
        <div className="col-span-2 flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${statusConfig.color} shadow-sm`}>
            <StatusIcon className="h-3.5 w-3.5" />
            {statusConfig.label}
          </div>
          <div className="flex items-center gap-1">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); openDetails(order.id); }}
              className="p-2 text-gray-500 hover:text-[#5064FF] hover:bg-[#5064FF]/10 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4" />
            </motion.button>
            {order.status === "pending" && (
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); cancelOrder(order.id); }}
                disabled={cancellingIds.has(order.id)}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Time */}
        <div className="col-span-1 text-right text-xs text-gray-500 font-medium">
          {order.createdAt ? formatDate(order.createdAt) : "-"}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 px-16">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#48E1C4]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#5064FF]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-[#48E1C4]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="group animate-fadeInUp">
              <h1 className="text-4xl font-bold bg-gray-600 bg-clip-text text-transparent transition-all duration-300 group-hover:tracking-wide">
                Order History
              </h1>
              <p className="text-gray-700 text-sm mt-1 relative inline-block group-hover:font-medium">
                Track and manage your trading orders
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#48E1C4] rounded-full transition-all duration-300 group-hover:w-full"></span>
              </p>
              <p className="font-semibold text-gray-600 mt-1">
                {formatFullDate(lastUpdated)} • Last updated: {formatDate(lastUpdated)}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gradient-hover p-3 rounded-xl bg-white border border-[#48E1C4]/20 hover:bg-[#48E1C4]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 text-[#48E1C4] ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-[#5064FF] to-[#48E1C4] rounded-full mt-2"></div>
        </motion.header>

        {/* Stats & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Orders */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="gradient-hover bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-[#5064FF] mt-2">{total}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-[#48E1C4]/20 to-[#5064FF]/20 rounded-xl">
                <BarChart3 className="h-6 w-6 text-[#5064FF]" />
              </div>
            </div>
          </motion.div>
          
          {/* Status Filter */}
          <div className="gradient-hover bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">Status</p>
            <select 
              value={status} 
              onChange={(e) => { setPage(1); setStatus(e.target.value); }} 
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-[#5064FF] focus:ring-2 focus:ring-[#5064FF]/20 bg-white"
            >
              <option value="">All Status</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          
          {/* Type Filter */}
          <div className="gradient-hover bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">Type</p>
            <select 
              value={type} 
              onChange={(e) => { setPage(1); setType(e.target.value); }} 
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-[#5064FF] focus:ring-2 focus:ring-[#5064FF]/20 bg-white"
            >
              <option value="">All Types</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          
          {/* Per Page Filter */}
          <div className="gradient-hover bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">Show</p>
            <select 
              value={limit} 
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} 
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-[#5064FF] focus:ring-2 focus:ring-[#5064FF]/20 bg-white"
            >
              {[10, 20, 50].map(o => <option key={o} value={o}>{o} per page</option>)}
            </select>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="gradient-hover bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden"
        >
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="gradient-hover relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search orders by company, symbol, or ID..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5064FF] focus:border-transparent shadow-sm"
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')} 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#5064FF] transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {search && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="gradient-hover bg-gradient-to-r from-[#48E1C4]/10 via-white to-[#5064FF]/10 border border-[#48E1C4]/30 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#5064FF] text-sm font-medium">
                        Found {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} matching "{search}"
                      </p>
                    </div>
                    <button 
                      onClick={() => setSearch('')}
                      className="text-[#48E1C4] text-sm font-medium hover:text-[#5064FF] transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-4 bg-gradient-to-r from-[#5064FF]/10 to-[#48E1C4]/10 border-b border-gray-200">
            <div className="col-span-3 text-xs font-semibold text-[#5064FF] uppercase tracking-wide">Stock</div>
            <div className="col-span-2 text-xs font-semibold text-[#5064FF] uppercase tracking-wide">Order Details</div>
            <div className="col-span-2 text-xs font-semibold text-[#5064FF] uppercase tracking-wide">Quantity</div>
            <div className="col-span-1 text-xs font-semibold text-[#5064FF] uppercase tracking-wide">Price</div>
            <div className="col-span-1 text-xs font-semibold text-[#5064FF] uppercase tracking-wide">Current</div>
            <div className="col-span-2 text-xs font-semibold text-[#5064FF] uppercase tracking-wide">Status & Actions</div>
            <div className="col-span-1 text-xs font-semibold text-[#5064FF] uppercase tracking-wide text-right">Time</div>
          </div>

          {/* Table Body */}
          <div>
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="h-8 w-8 border-2 border-[#48E1C4]/20 border-t-[#5064FF] rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 text-sm">Loading orders...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                <p className="text-red-600 font-medium text-sm">Error: {error}</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchOrders} 
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-[#5064FF] to-[#48E1C4] text-white text-sm rounded-lg hover:opacity-90 transition-all duration-300"
                >
                  Retry
                </motion.button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <div className="p-3 bg-gradient-to-br from-[#48E1C4]/20 to-[#5064FF]/20 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-[#5064FF]" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">No Orders Found</h3>
                <p className="text-gray-500 text-xs mb-4">Try adjusting your filters</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSearch(""); setStatus(""); setType(""); }} 
                  className="px-4 py-2 bg-gradient-to-r from-[#5064FF] to-[#48E1C4] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-300"
                >
                  Clear Filters
                </motion.button>
              </div>
            ) : (
              <AnimatePresence>
                {filteredOrders.map((order, index) => (
                  <OrderRow key={order.id} order={order} index={index} />
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 bg-gradient-to-r from-[#5064FF]/10 to-[#48E1C4]/10 border-t border-gray-200">
              <div className="text-xs text-[#5064FF] mb-3 sm:mb-0">
                Page <span className="font-bold">{page}</span> of{" "}
                <span className="font-bold">{totalPages}</span> • {total} orders
              </div>
              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page <= 1} 
                  className="p-2 bg-white border border-[#5064FF]/20 rounded-lg hover:border-[#5064FF] hover:bg-[#5064FF]/5 transition-colors disabled:opacity-50 disabled:hover:bg-white"
                >
                  <ChevronLeft className="h-4 w-4 text-[#5064FF]" />
                </motion.button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
                    return (
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setPage(pageNum)} 
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                          page === pageNum 
                            ? "bg-gradient-to-r from-[#5064FF] to-[#48E1C4] text-white shadow-sm" 
                            : "bg-white border border-[#5064FF]/20 text-[#5064FF] hover:border-[#5064FF] hover:bg-[#5064FF]/5"
                        }`}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  })}
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page >= totalPages} 
                  className="p-2 bg-white border border-[#5064FF]/20 rounded-lg hover:border-[#5064FF] hover:bg-[#5064FF]/5 transition-colors disabled:opacity-50 disabled:hover:bg-white"
                >
                  <ChevronRight className="h-4 w-4 text-[#5064FF]" />
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-200/50 text-center"
        >
          <p className="text-gray-500 text-sm">
            Data updates on refresh • Last refresh: {formatDate(lastUpdated)}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Order data is for demonstration purposes. Always verify with official sources.
          </p>
        </motion.footer>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/40 backdrop-blur-sm"
            >
              <div className="fixed inset-0" onClick={() => setSelectedOrder(null)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative gradient-hover bg-white/80 backdrop-blur-sm rounded-2xl w-full max-w-3xl shadow-2xl z-10 overflow-hidden border border-gray-100/50"
              >
                {/* Modal Header */}
                <div className="p-6 bg-gradient-to-r from-[#5064FF]/10 to-[#48E1C4]/10 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="logo-hover p-3 bg-gradient-to-br from-[#5064FF] to-[#48E1C4] rounded-xl">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
                        <p className="text-xs text-[#5064FF] font-medium">ID: {selectedOrder.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openDetails(selectedOrder.id)} 
                        className="p-2 text-gray-500 hover:text-[#5064FF] hover:bg-[#5064FF]/10 rounded-lg transition-colors"
                      >
                        <RefreshCw className={`h-4 w-4 ${detailsLoading ? 'animate-spin' : ''}`} />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedOrder(null)} 
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {/* Modal Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  {detailsLoading ? (
                    <div className="py-10 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#48E1C4]/20 border-t-[#5064FF] mb-3"></div>
                      <p className="text-gray-600 text-sm">Loading details...</p>
                    </div>
                  ) : selectedOrder.error ? (
                    <div className="py-10 text-center">
                      <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                      <p className="text-red-600 font-medium text-sm">{selectedOrder.error}</p>
                    </div>
                  ) : selectedOrder.data ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                          <div className="gradient-hover bg-white/50 rounded-2xl p-6 border border-[#5064FF]/20">
                            <h4 className="text-sm font-bold text-gray-900 mb-4">Stock Information</h4>
                            <div className="space-y-3">
                              {[
                                ["Company", selectedOrder.data.stock?.companyName || "-", "text-gray-900"],
                                ["Symbol", selectedOrder.data.stock?.symbol || "-", "text-[#5064FF]"],
                                ["Exchange", selectedOrder.data.stock?.exchange || "-", "text-gray-900"],
                              ].map(([label, value, color]) => (
                                <div key={label} className="flex justify-between items-center py-2 border-b border-[#48E1C4]/10 last:border-b-0">
                                  <span className="text-xs text-gray-600">{label}</span>
                                  <span className={`text-sm font-medium ${color}`}>{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="gradient-hover bg-white/50 rounded-2xl p-6 border border-[#5064FF]/20">
                            <h4 className="text-sm font-bold text-gray-900 mb-4">Order Details</h4>
                            <div className="space-y-3">
                              {[
                                ["Order Type", selectedOrder.data.orderType, selectedOrder.data.orderType === 'buy' ? 'text-[#48E1C4]' : 'text-[#5064FF]'],
                                ["Category", selectedOrder.data.orderCategory, "text-gray-900"],
                                ["Quantity", selectedOrder.data.quantity, "text-gray-900"],
                                ["Executed", selectedOrder.data.executedQuantity || 0, "text-gray-900"],
                                ["Price", formatCurrency(selectedOrder.data.price), "text-gray-900"],
                                ["Average", selectedOrder.data.averagePrice || "-", "text-gray-900"],
                                ["Current", formatCurrency(selectedOrder.data.currentPrice), selectedOrder.data.currentPrice > selectedOrder.data.price ? 'text-[#48E1C4]' : 'text-[#5064FF]'],
                              ].map(([label, value, color]) => (
                                <div key={label} className="flex justify-between items-center py-2 border-b border-[#48E1C4]/10 last:border-b-0">
                                  <span className="text-xs text-gray-600">{label}</span>
                                  <span className={`text-sm font-medium ${color}`}>{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Right Column */}
                        <div className="space-y-6">
                          <div className="gradient-hover bg-white/50 rounded-2xl p-6 border border-[#5064FF]/20">
                            <h4 className="text-sm font-bold text-gray-900 mb-4">Timestamps</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center py-2 border-b border-[#48E1C4]/10 last:border-b-0">
                                <span className="text-xs text-gray-600">Created</span>
                                <span className="text-xs font-medium text-gray-900">
                                  {selectedOrder.data.createdAt ? new Date(selectedOrder.data.createdAt).toLocaleString() : "-"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-[#48E1C4]/10 last:border-b-0">
                                <span className="text-xs text-gray-600">Updated</span>
                                <span className="text-xs font-medium text-gray-900">
                                  {selectedOrder.data.updatedAt ? new Date(selectedOrder.data.updatedAt).toLocaleString() : "-"}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="gradient-hover bg-white/50 rounded-2xl p-6 border border-[#5064FF]/20">
                            <h4 className="text-sm font-bold text-gray-900 mb-4">Actions</h4>
                            <div className="space-y-3">
                              {selectedOrder.data.status === "pending" ? (
                                <motion.button 
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => cancelOrder(selectedOrder.id)} 
                                  disabled={cancellingIds.has(selectedOrder.id)} 
                                  className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
                                >
                                  <X className="h-4 w-4" />
                                  <span>{cancellingIds.has(selectedOrder.id) ? "Cancelling..." : "Cancel Order"}</span>
                                </motion.button>
                              ) : (
                                <div className="text-center py-4 text-gray-500">
                                  <CheckCircle className="h-6 w-6 text-[#48E1C4] mx-auto mb-2" />
                                  <p className="text-xs">No actions available</p>
                                </div>
                              )}
                              <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => { navigator.clipboard?.writeText(selectedOrder.id); alert("Copied!"); }} 
                                className="w-full py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-[#5064FF] hover:bg-[#5064FF]/5 hover:text-[#5064FF] transition-colors flex items-center justify-center gap-2"
                              >
                                <Copy className="h-4 w-4" />
                                <span>Copy Order ID</span>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 text-center">
                      <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm">No details available</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Gradient hover effect */
        .gradient-hover {
          position: relative;
          overflow: hidden;
        }
        
        .gradient-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(72, 225, 196, 0.1) 25%, 
            rgba(80, 100, 255, 0.1) 50%, 
            rgba(72, 225, 196, 0.1) 75%, 
            transparent 100%
          );
          transition: transform 0.8s ease;
          z-index: 0;
        }
        
        .gradient-hover:hover::before {
          transform: translateX(100%);
        }
        
        /* Card hover effects */
        .stock-card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .stock-card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -15px rgba(72, 225, 196, 0.25);
        }
        
        /* Logo hover effect */
        .logo-hover {
          transition: all 0.3s ease;
        }
        
        .logo-hover:hover {
          transform: scale(1.1) rotate(5deg);
        }
        
        /* Ensure text remains visible over gradient */
        .gradient-hover > *:not(:before) {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}