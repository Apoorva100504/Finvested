import React, { useEffect, useState, useCallback } from "react";
import { 
  Search, RefreshCw, Eye, X, Copy, 
  TrendingUp, TrendingDown, ChevronLeft, ChevronRight,
  BarChart3, AlertCircle, CheckCircle, XCircle, Clock
} from "lucide-react";

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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const filteredOrders = search ? orders.filter(o => 
    o.stock.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    o.stock.symbol?.toLowerCase().includes(search.toLowerCase()) ||
    o.id?.toLowerCase().includes(search.toLowerCase())
  ) : orders;

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const OrderRow = ({ order }) => {
    const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
    const StatusIcon = statusConfig.icon;
    const isProfitable = order.currentPrice > order.price;
    
    return (
      <div className="grid grid-cols-12 gap-4 px-24 py-4 items-center border-b border-gray-100 hover:bg-emerald-50/30 transition-colors group">
        <div className="col-span-3 flex items-center gap-3">
          <div className={`p-2 rounded-lg ${order.orderType === 'buy' ? 'bg-emerald-100' : 'bg-rose-100'} group-hover:scale-105 transition-transform`}>
            {order.orderType === 'buy' ? <TrendingUp className="h-4 w-4 text-emerald-600" /> : <TrendingDown className="h-4 w-4 text-rose-600" />}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 group-hover:text-emerald-800 transition-colors">{order.stock.companyName}</div>
            <div className="text-xs text-gray-500">{order.stock.symbol}</div>
          </div>
        </div>
        
        <div className="col-span-2">
          <div className={`text-xs font-medium px-2 py-1 rounded ${order.orderType === 'buy' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {order.orderType.toUpperCase()} • {order.orderCategory}
          </div>
        </div>
        
        <div className="col-span-2">
          <div className="text-sm font-medium text-gray-900">{order.quantity}</div>
          <div className="text-xs text-gray-500">Exec: {order.executedQuantity || 0}</div>
        </div>
        
        <div className="col-span-1 text-sm font-medium text-gray-900">{formatCurrency(order.price)}</div>
        
        <div className="col-span-1">
          <div className="flex items-center gap-1">
            <div className={`text-sm font-medium ${isProfitable ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatCurrency(order.currentPrice)}
            </div>
          </div>
        </div>
        
        <div className="col-span-2 flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${statusConfig.color} shadow-sm`}>
            <StatusIcon className="h-3.5 w-3.5" />
            {statusConfig.label}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => openDetails(order.id)} className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
              <Eye className="h-4 w-4" />
            </button>
            {order.status === "pending" && (
              <button onClick={() => cancelOrder(order.id)} disabled={cancellingIds.has(order.id)} className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="col-span-1 text-right text-xs text-gray-500 font-medium">{formatDate(order.createdAt)}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/20 px-5 py-7">
      <div className="max-w-[1400px] mx-auto space-y-7">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-600 rounded-lg shadow-sm">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            </div>
            <p className="text-gray-600 text-sm ml-11">Track and manage your trading orders</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-sm w-52 bg-white"
              />
            </div>
            <button 
              onClick={fetchOrders} 
              className="px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm shadow-sm hover:shadow"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Total Orders */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-emerald-800 mt-2">{total}</p>
              </div>
              <div className="p-2.5 bg-emerald-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">Status</p>
            <select 
              value={status} 
              onChange={(e) => { setPage(1); setStatus(e.target.value); }} 
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
            >
              <option value="">All Status</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          
          {/* Type Filter */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">Type</p>
            <select 
              value={type} 
              onChange={(e) => { setPage(1); setType(e.target.value); }} 
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
            >
              <option value="">All Types</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          
          {/* Per Page Filter */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">Show</p>
            <select 
              value={limit} 
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} 
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
            >
              {[10, 20, 50].map(o => <option key={o} value={o}>{o} per page</option>)}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-4 bg-gradient-to-r from-emerald-50 to-emerald-50/50 border-b border-gray-200">
            <div className="col-span-3 text-xs font-semibold text-emerald-800 uppercase tracking-wide">Stock</div>
            <div className="col-span-2 text-xs font-semibold text-emerald-800 uppercase tracking-wide">Order Details</div>
            <div className="col-span-2 text-xs font-semibold text-emerald-800 uppercase tracking-wide">Quantity</div>
            <div className="col-span-1 text-xs font-semibold text-emerald-800 uppercase tracking-wide">Price</div>
            <div className="col-span-1 text-xs font-semibold text-emerald-800 uppercase tracking-wide">Current</div>
            <div className="col-span-2 text-xs font-semibold text-emerald-800 uppercase tracking-wide">Status & Actions</div>
            <div className="col-span-1 text-xs font-semibold text-emerald-800 uppercase tracking-wide text-right">Time</div>
          </div>

          {/* Table Body */}
          <div>
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="h-8 w-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 text-sm">Loading orders...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
                <p className="text-rose-600 font-medium text-sm">Error: {error}</p>
                <button onClick={fetchOrders} className="mt-4 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors">
                  Retry
                </button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <div className="p-3 bg-emerald-100 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">No Orders Found</h3>
                <p className="text-gray-500 text-xs mb-4">Try adjusting your filters</p>
                <button 
                  onClick={() => { setSearch(""); setStatus(""); setType(""); }} 
                  className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredOrders.map(order => <OrderRow key={order.id} order={order} />)
            )}
          </div>

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-50 to-emerald-50/50 border-t border-gray-200">
              <div className="text-xs text-emerald-700 mb-3 sm:mb-0">
                Page <span className="font-bold">{page}</span> of{" "}
                <span className="font-bold">{totalPages}</span> • {total} orders
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page <= 1} 
                  className="p-2 bg-white border border-emerald-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:hover:bg-white"
                >
                  <ChevronLeft className="h-4 w-4 text-emerald-700" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
                    return (
                      <button 
                        key={pageNum} 
                        onClick={() => setPage(pageNum)} 
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                          page === pageNum 
                            ? "bg-emerald-600 text-white shadow-sm" 
                            : "bg-white border border-emerald-200 text-emerald-700 hover:border-emerald-400"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page >= totalPages} 
                  className="p-2 bg-white border border-emerald-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:hover:bg-white"
                >
                  <ChevronRight className="h-4 w-4 text-emerald-700" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/40 backdrop-blur-sm">
          <div className="fixed inset-0" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-xl w-full max-w-3xl shadow-2xl z-10 overflow-hidden border border-gray-200">
            <div className="p-5 bg-gradient-to-r from-emerald-50 to-emerald-50/70 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
                    <p className="text-xs text-emerald-700 font-medium">ID: {selectedOrder.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openDetails(selectedOrder.id)} 
                    className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <RefreshCw className={`h-4 w-4 ${detailsLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button 
                    onClick={() => setSelectedOrder(null)} 
                    className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-5 max-h-[70vh] overflow-y-auto">
              {detailsLoading ? (
                <div className="py-10 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-200 border-t-emerald-600 mb-3"></div>
                  <p className="text-gray-600 text-sm">Loading details...</p>
                </div>
              ) : selectedOrder.error ? (
                <div className="py-10 text-center">
                  <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
                  <p className="text-rose-600 font-medium text-sm">{selectedOrder.error}</p>
                </div>
              ) : selectedOrder.data ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-5">
                      <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">Stock Information</h4>
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center py-2 border-b border-emerald-100 last:border-b-0">
                            <span className="text-xs text-gray-600">Company</span>
                            <span className="text-sm font-medium text-gray-900">{selectedOrder.data.stock.companyName}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-emerald-100 last:border-b-0">
                            <span className="text-xs text-gray-600">Symbol</span>
                            <span className="text-sm font-medium text-emerald-700">{selectedOrder.data.stock.symbol}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">Order Details</h4>
                        <div className="space-y-2.5">
                          {[
                            ["Order Type", selectedOrder.data.orderType, selectedOrder.data.orderType === 'buy' ? 'text-emerald-700' : 'text-rose-700'],
                            ["Category", selectedOrder.data.orderCategory, "text-gray-900"],
                            ["Quantity", selectedOrder.data.quantity, "text-gray-900"],
                            ["Executed", selectedOrder.data.executedQuantity || 0, "text-gray-900"],
                            ["Price", formatCurrency(selectedOrder.data.price), "text-gray-900"],
                            ["Average", selectedOrder.data.averagePrice || "-", "text-gray-900"],
                            ["Current", formatCurrency(selectedOrder.data.currentPrice), selectedOrder.data.currentPrice > selectedOrder.data.price ? 'text-emerald-700' : 'text-rose-700'],
                            ["Status", STATUS_CONFIG[selectedOrder.data.status]?.label || selectedOrder.data.status, STATUS_CONFIG[selectedOrder.data.status]?.color.replace('bg-', 'text-').split(' ')[0]]
                          ].map(([label, value, color]) => (
                            <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                              <span className="text-xs text-gray-600">{label}</span>
                              <span className={`text-xs font-medium ${color}`}>{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">Timestamps</h4>
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                            <span className="text-xs text-gray-600">Created</span>
                            <span className="text-xs font-medium text-gray-900">{new Date(selectedOrder.data.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                            <span className="text-xs text-gray-600">Updated</span>
                            <span className="text-xs font-medium text-gray-900">{selectedOrder.data.updatedAt ? new Date(selectedOrder.data.updatedAt).toLocaleString() : "-"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">Actions</h4>
                        <div className="space-y-3">
                          {selectedOrder.data.status === "pending" ? (
                            <button 
                              onClick={() => cancelOrder(selectedOrder.id)} 
                              disabled={cancellingIds.has(selectedOrder.id)} 
                              className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-500 text-white text-sm font-semibold rounded-lg hover:from-rose-700 hover:to-rose-600 transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
                            >
                              <X className="h-4 w-4" />
                              <span>{cancellingIds.has(selectedOrder.id) ? "Cancelling..." : "Cancel Order"}</span>
                            </button>
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                              <p className="text-xs">No actions available</p>
                            </div>
                          )}
                          <button 
                            onClick={() => { navigator.clipboard?.writeText(selectedOrder.id); alert("Copied!"); }} 
                            className="w-full py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <Copy className="h-4 w-4" />
                            <span>Copy Order ID</span>
                          </button>
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
          </div>
        </div>
      )}
    </div>
  );
}