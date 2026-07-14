import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { TRANSLATIONS } from '../translations';
import { motion } from 'motion/react';
import { 
  TrendingUp, ShoppingBag, CheckCircle, Clock, Truck, ShieldAlert, 
  Search, RefreshCw, X, Shield, FileSpreadsheet, Copy, Code, Check, Trash2 
} from 'lucide-react';

interface AdminDashboardProps {
  lang: 'ar' | 'fr';
  onBackToStore: () => void;
}

export default function AdminDashboard({ lang, onBackToStore }: AdminDashboardProps) {
  const t = TRANSLATIONS[lang];

  // Admin Role Authentication State
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // State Management
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedTab, setSelectedTab] = useState<'orders' | 'analytics' | 'schema'>('orders');

  // Schema State
  const [sqlDdl, setSqlDdl] = useState('');
  const [jsonSchema, setJsonSchema] = useState<any>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Fetch orders and stats
  const fetchData = async () => {
    setLoading(true);
    try {
      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();
      if (ordersData.success) {
        setOrders(ordersData.orders);
      }

      const statsRes = await fetch('/api/stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      const schemaRes = await fetch('/api/schema');
      const schemaData = await schemaRes.json();
      if (schemaData.success) {
        setSqlDdl(schemaData.sqlDdl);
        setJsonSchema(schemaData.jsonSchema);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle status update
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        // Refresh analytics stats
        const statsRes = await fetch('/api/stats');
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.stats);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  // Handle order deletion
  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا الطلب نهائياً؟' : 'Voulez-vous vraiment supprimer cette commande ?')) {
      return;
    }

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        // Refresh analytics stats
        const statsRes = await fetch('/api/stats');
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.stats);
      }
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  // Copy helpers
  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlDdl);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonSchema, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Filter & Search Logic
  const filteredOrders = orders.filter(o => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      o.customerName.toLowerCase().includes(query) ||
      o.phoneNumber.includes(query) ||
      o.id.toLowerCase().includes(query) ||
      o.wilayaNameFr.toLowerCase().includes(query) ||
      o.wilayaNameAr.includes(query);

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === 'admin' || password === 'fakhir2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError(lang === 'ar' ? 'كلمة المرور غير صحيحة!' : 'Mot de passe incorrect !');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d0907] text-[#fff2eb] font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative ambient background glows */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#bf7e5a]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#824b2b]/10 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full bg-[#17120e] rounded-3xl border border-[#302017] p-8 shadow-2xl relative z-10 text-center flex flex-col items-center animate-fade-in"
        >
          {/* Admin Shield Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#bf7e5a]/10 border border-[#bf7e5a]/30 flex items-center justify-center text-[#bf7e5a] mb-6 animate-pulse">
            <Shield className="w-8 h-8 text-[#bf7e5a]" />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-[#fff2eb] mb-2 font-serif uppercase">
            el fakhir artisanal
          </h2>
          <p className="text-[#bf9e8a] text-xs mb-8 leading-relaxed font-sans">
            {lang === 'ar' 
              ? 'بوابة الإدارة المؤمنة - للوصول إلى لوحة التحكم يرجى إدخال كلمة المرور' 
              : 'Espace Administration Sécurisé - Veuillez saisir le mot de passe pour continuer.'}
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div className="space-y-1.5 text-right rtl:text-right ltr:text-left">
              <label className="text-xs text-[#bf9e8a] font-semibold tracking-wide uppercase">
                {lang === 'ar' ? 'كلمة مرور الإدارة' : 'Mot de passe Admin'}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={lang === 'ar' ? 'أدخل كلمة المرور هنا...' : 'Entrez le mot de passe...'}
                className="w-full bg-[#0d0907] border border-[#302017] text-[#fff2eb] font-sans rounded-xl py-3 px-4 focus:ring-1 focus:ring-[#bf7e5a] focus:border-[#bf7e5a] transition-all outline-hidden text-center"
              />
            </div>

            {authError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs font-bold font-sans"
              >
                {authError}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-[#bf7e5a] hover:bg-[#ab6841] text-white hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              {lang === 'ar' ? 'تسجيل الدخول الآمن' : 'Connexion Sécurisée'}
            </button>
          </form>

          {/* Back button to return to store */}
          <button
            onClick={onBackToStore}
            className="mt-6 text-xs text-[#bf9e8a] hover:text-[#fff2eb] hover:underline cursor-pointer font-semibold transition-all"
          >
            {lang === 'ar' ? '← الرجوع لمتجر المشتري' : '← Retourner à la boutique'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0907] text-[#fff2eb] font-sans pb-16">
      {/* Top Admin Header Bar */}
      <div className="bg-[#17120e] border-b border-[#302017] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#bf7e5a]/10 flex items-center justify-center text-[#bf7e5a] border border-[#bf7e5a]/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                {lang === 'ar' ? 'لوحة تحكم البائع - سوار النحاس' : 'Boutique Seller Panel - Copper Bracelet'}
              </h1>
              <p className="text-xs text-[#bf9e8a]">
                Algerian COD E-commerce System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-2 bg-[#211914] hover:bg-[#2c221b] border border-[#302017] rounded-xl text-[#bf9e8a] hover:text-[#fff2eb] transition-all cursor-pointer"
              title={lang === 'ar' ? 'تحديث البيانات' : 'Actualiser'}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onBackToStore}
              className="px-4 py-2 bg-[#bf7e5a] hover:bg-[#ab6841] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              {lang === 'ar' ? 'الرجوع للمتجر' : 'Retour Boutique'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#302017] mb-8 gap-6">
          <button
            onClick={() => setSelectedTab('orders')}
            className={`pb-4 text-sm font-semibold transition-all relative cursor-pointer ${
              selectedTab === 'orders' ? 'text-[#ff8e4d]' : 'text-[#bf9e8a] hover:text-[#fff2eb]'
            }`}
          >
            {lang === 'ar' ? 'الطلبات والتحكم' : 'Commandes COD'}
            {selectedTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff8e4d] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setSelectedTab('analytics')}
            className={`pb-4 text-sm font-semibold transition-all relative cursor-pointer ${
              selectedTab === 'analytics' ? 'text-[#ff8e4d]' : 'text-[#bf9e8a] hover:text-[#fff2eb]'
            }`}
          >
            {lang === 'ar' ? 'التحليلات والمبيعات' : 'Statistiques'}
            {selectedTab === 'analytics' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff8e4d] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setSelectedTab('schema')}
            className={`pb-4 text-sm font-semibold transition-all relative cursor-pointer ${
              selectedTab === 'schema' ? 'text-[#ff8e4d]' : 'text-[#bf9e8a] hover:text-[#fff2eb]'
            }`}
          >
            {lang === 'ar' ? 'قاعدة البيانات (SQL / JSON)' : 'Schéma Base de Données'}
            {selectedTab === 'schema' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff8e4d] rounded-full" />
            )}
          </button>
        </div>

        {/* Loading State */}
        {loading && !stats ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#bf9e8a]">
            <RefreshCw className="w-8 h-8 animate-spin text-[#bf7e5a] mb-4" />
            <span className="font-sans text-sm">{lang === 'ar' ? 'جاري تحميل البيانات البنكية للطلبات...' : 'Chargement des données de vente...'}</span>
          </div>
        ) : (
          <>
            {/* Stats Summary Panel */}
            {stats && (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {/* Total Orders Card */}
                <div className="bg-[#17120e] border border-[#302017] rounded-2xl p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#bf9e8a] block font-sans uppercase tracking-wider">{lang === 'ar' ? 'إجمالي الطلبات' : 'Total Commandes'}</span>
                    <span className="text-xl font-bold font-mono text-[#fff2eb]">{stats.totalOrders}</span>
                  </div>
                </div>

                {/* Confirmed Orders Card */}
                <div className="bg-[#17120e] border border-[#302017] rounded-2xl p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#bf9e8a] block font-sans uppercase tracking-wider">{lang === 'ar' ? 'مؤكدة' : 'Confirmées'}</span>
                    <span className="text-xl font-bold font-mono text-[#fff2eb]">{stats.confirmed}</span>
                  </div>
                </div>

                {/* Pending Orders Card */}
                <div className="bg-[#17120e] border border-[#302017] rounded-2xl p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#bf9e8a] block font-sans uppercase tracking-wider">{lang === 'ar' ? 'قيد الانتظار' : 'En attente'}</span>
                    <span className="text-xl font-bold font-mono text-[#fff2eb]">{stats.pending}</span>
                  </div>
                </div>

                {/* Shipped Orders Card */}
                <div className="bg-[#17120e] border border-[#302017] rounded-2xl p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#bf9e8a] block font-sans uppercase tracking-wider">{lang === 'ar' ? 'تم الشحن' : 'Expédiées'}</span>
                    <span className="text-xl font-bold font-mono text-[#fff2eb]">{stats.shipped}</span>
                  </div>
                </div>

                {/* Total Revenue Card (Confirmed/Shipped only) */}
                <div className="bg-[#17120e] border border-[#3e271a] rounded-2xl p-4 flex items-center gap-3.5 col-span-2 lg:col-span-1">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#bf9e8a] block font-sans uppercase tracking-wider">{lang === 'ar' ? 'الأرباح المؤكدة' : 'Chiffre d\'Affaire'}</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">{stats.totalRevenue} DA</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ORDERS TABLE */}
            {selectedTab === 'orders' && (
              <div className="bg-[#17120e] border border-[#302017] rounded-3xl overflow-hidden shadow-xl">
                {/* Table search & filtering controls */}
                <div className="p-6 border-b border-[#302017] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-[#bf9e8a] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={lang === 'ar' ? 'بحث بالاسم، رقم الهاتف، الولاية...' : 'Rechercher par nom, téléphone, wilaya...'}
                      className="w-full bg-[#0d0907] border border-[#302017] text-[#fff2eb] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-[#bf7e5a] outline-none"
                    />
                  </div>

                  <div className="flex gap-2 self-start md:self-auto">
                    {['All', 'Pending', 'Confirmed', 'Shipped', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border ${
                          statusFilter === status
                            ? 'bg-[#bf7e5a] border-[#bf7e5a] text-white'
                            : 'bg-[#0d0907] border-[#302017] text-[#bf9e8a] hover:bg-[#110e0c]'
                        }`}
                      >
                        {status === 'All' ? (lang === 'ar' ? 'الكل' : 'Tous') : status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table element */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#0d0907] border-b border-[#302017]">
                        <th className="px-6 py-4 text-xs font-bold text-[#bf9e8a] uppercase tracking-wider font-sans">{lang === 'ar' ? 'رقم الطلب' : 'ID'}</th>
                        <th className="px-6 py-4 text-xs font-bold text-[#bf9e8a] uppercase tracking-wider font-sans">{lang === 'ar' ? 'العميل' : 'Client'}</th>
                        <th className="px-6 py-4 text-xs font-bold text-[#bf9e8a] uppercase tracking-wider font-sans">{lang === 'ar' ? 'الولاية والعنوان' : 'Adresse / Wilaya'}</th>
                        <th className="px-6 py-4 text-xs font-bold text-[#bf9e8a] uppercase tracking-wider font-sans">{lang === 'ar' ? 'الشحن والتكلفة' : 'Logistique / Total'}</th>
                        <th className="px-6 py-4 text-xs font-bold text-[#bf9e8a] uppercase tracking-wider font-sans">{lang === 'ar' ? 'حالة الطلب' : 'Statut'}</th>
                        <th className="px-6 py-4 text-xs font-bold text-[#bf9e8a] uppercase tracking-wider font-sans text-center">{lang === 'ar' ? 'خيارات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#302017]">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-[#bf9e8a] font-sans">
                            {lang === 'ar' ? 'لا توجد أي طلبات مطابقة للبحث حالياً.' : 'Aucune commande ne correspond aux filtres.'}
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-[#1c1612] transition-all">
                            {/* ID */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-mono font-bold text-[#ff8e4d] text-xs bg-[#bf7e5a]/10 px-2 py-1 rounded">
                                {order.id}
                              </span>
                              <span className="block text-[10px] text-[#826a5c] mt-1.5 font-mono">
                                {new Date(order.timestamp).toLocaleDateString()}
                              </span>
                            </td>

                            {/* Client Info */}
                            <td className="px-6 py-4">
                              <div className="text-sm font-bold text-[#fff2eb] font-sans">
                                {order.customerName}
                              </div>
                              <div className="text-xs text-[#bf9e8a] font-mono mt-1">
                                {order.phoneNumber}
                              </div>
                            </td>

                            {/* Address & Wilaya */}
                            <td className="px-6 py-4">
                              <div className="text-xs font-bold text-[#fff2eb] font-sans">
                                {order.wilayaCode} - {lang === 'ar' ? order.wilayaNameAr : order.wilayaNameFr}
                              </div>
                              <div className="text-xs text-[#bf9e8a] font-sans truncate max-w-[200px] mt-1" title={order.address}>
                                {order.address}
                              </div>
                            </td>

                            {/* Shipping info */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-xs font-sans text-[#fff2eb] flex items-center gap-1">
                                <span className="bg-[#2a1a12] text-[#bf7e5a] font-bold px-1.5 py-0.5 rounded text-[10px]">
                                  {order.shippingCompany === 'Yalidine Express' ? 'Yalidine' : 'ZR'}
                                </span>
                                <span>{order.shippingType === 'Home' ? (lang === 'ar' ? 'منزل' : 'Home') : (lang === 'ar' ? 'مكتب' : 'Office')}</span>
                              </div>
                              <div className="text-xs font-bold font-mono text-[#ff8e4d] mt-1">
                                {order.totalPrice} DA
                              </div>
                            </td>

                            {/* Status controls */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-none appearance-none cursor-pointer pr-1 ${
                                  order.status === 'Pending'
                                    ? 'bg-yellow-950/40 border-yellow-800 text-yellow-300'
                                    : order.status === 'Confirmed'
                                    ? 'bg-blue-950/40 border-blue-800 text-blue-300'
                                    : order.status === 'Shipped'
                                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                                    : 'bg-red-950/40 border-red-800 text-red-300'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>

                            {/* Delete Option */}
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-2 text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/50 border border-red-900/30 rounded-lg cursor-pointer transition-all"
                                title={lang === 'ar' ? 'حذف الطلب' : 'Supprimer'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: ANALYTICS & CHARTS */}
            {selectedTab === 'analytics' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                {/* Carrier Split Chart */}
                <div className="bg-[#17120e] border border-[#302017] p-6 rounded-3xl">
                  <h3 className="text-base font-bold text-[#fff2eb] mb-6 flex items-center gap-2 font-sans">
                    <Truck className="w-5 h-5 text-[#bf7e5a]" />
                    {lang === 'ar' ? 'توزيع شركات التوصيل المستخدمة' : 'Part de Marché Transporteurs'}
                  </h3>

                  {/* Pure HTML progress-bar split chart */}
                  {stats.totalOrders === 0 ? (
                    <p className="text-xs text-[#bf9e8a] font-sans py-8 text-center">{lang === 'ar' ? 'لا توجد بيانات كافية للتحليل' : 'Aucune donnée disponible.'}</p>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold">Yalidine Express</span>
                        <span className="font-mono text-[#ff8e4d] font-bold">
                          {stats.yalidineCount} {lang === 'ar' ? 'طلب' : 'commandes'} ({Math.round((stats.yalidineCount / stats.totalOrders) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#0d0907] rounded-full h-4 overflow-hidden border border-[#302017]">
                        <div 
                          className="bg-gradient-to-r from-[#824b2b] to-[#bf7e5a] h-full rounded-full transition-all duration-1000"
                          style={{ width: `${(stats.yalidineCount / stats.totalOrders) * 100}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm mt-4">
                        <span className="font-bold">ZR Express</span>
                        <span className="font-mono text-[#ff8e4d] font-bold">
                          {stats.zrCount} {lang === 'ar' ? 'طلب' : 'commandes'} ({Math.round((stats.zrCount / stats.totalOrders) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#0d0907] rounded-full h-4 overflow-hidden border border-[#302017]">
                        <div 
                          className="bg-gradient-to-r from-[#5a3825] to-[#805035] h-full rounded-full transition-all duration-1000"
                          style={{ width: `${(stats.zrCount / stats.totalOrders) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Wilaya Orders distribution */}
                <div className="bg-[#17120e] border border-[#302017] p-6 rounded-3xl">
                  <h3 className="text-base font-bold text-[#fff2eb] mb-6 flex items-center gap-2 font-sans">
                    <CheckCircle className="w-5 h-5 text-[#bf7e5a]" />
                    {lang === 'ar' ? 'الطلب حسب الولايات الجزائريّة الأكثر مبيعاً' : 'Ventes par Wilaya'}
                  </h3>

                  {stats.wilayaStats.length === 0 ? (
                    <p className="text-xs text-[#bf9e8a] font-sans py-8 text-center">{lang === 'ar' ? 'لا توجد بيانات ولايات حالياً' : 'Aucune donnée par wilaya.'}</p>
                  ) : (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {stats.wilayaStats.map((wil: any, i: number) => {
                        const maxCount = Math.max(...stats.wilayaStats.map((w: any) => w.count));
                        return (
                          <div key={wil.name} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-sans">
                              <span className="font-bold text-[#fff2eb]">{wil.name}</span>
                              <span className="text-amber-500 font-bold font-mono">
                                {wil.count} {lang === 'ar' ? 'طلب' : 'ord.'}
                              </span>
                            </div>
                            <div className="w-full bg-[#0d0907] rounded-full h-2 overflow-hidden border border-[#302017]">
                              <div 
                                className="bg-[#bf7e5a] h-full rounded-full transition-all duration-1000"
                                style={{ width: `${(wil.count / maxCount) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: DATABASE SCHEMAS (REQUIRED SPEC #1) */}
            {selectedTab === 'schema' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn font-sans">
                {/* SQL Schema View */}
                <div className="bg-[#17120e] border border-[#302017] p-6 rounded-3xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-[#bf7e5a]" />
                        <h3 className="text-base font-bold text-[#fff2eb]">{lang === 'ar' ? 'مخطط جدول SQL DDL' : 'Schéma Table SQL DDL'}</h3>
                      </div>
                      <button
                        onClick={handleCopySql}
                        className="p-2 bg-[#211914] hover:bg-[#2c221b] border border-[#302017] rounded-lg text-[#bf9e8a] hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold"
                      >
                        {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedSql ? (lang === 'ar' ? 'تم النسخ!' : 'Copié!') : (lang === 'ar' ? 'نسخ الكود' : 'Copier')}</span>
                      </button>
                    </div>
                    <p className="text-xs text-[#bf9e8a] mb-4 leading-relaxed">
                      {lang === 'ar' 
                        ? 'مخطط SQL القياسي لإنشاء جدول الطلبات orders على قواعد البيانات العلائقية مثل PostgreSQL أو PostgreSQL على Cloud SQL.' 
                        : 'Script SQL standard pour générer la table des commandes dans une base relationnelle PostgreSQL ou MySQL.'}
                    </p>
                    <pre className="bg-[#0d0907] border border-[#211914] p-4 rounded-xl text-xs font-mono text-[#ff8e4d] overflow-x-auto max-h-[350px]">
                      {sqlDdl}
                    </pre>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#302017] text-xs text-[#826a5c]">
                    {lang === 'ar' ? 'نوع المفتاح الأساسي: order_id سلسلي فريد بديل.' : 'Clé Primaire : order_id avec formatage personnalisé (ex: DZ-12345).'}
                  </div>
                </div>

                {/* JSON Schema View */}
                <div className="bg-[#17120e] border border-[#302017] p-6 rounded-3xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-[#bf7e5a]" />
                        <h3 className="text-base font-bold text-[#fff2eb]">{lang === 'ar' ? 'مخطط ملف JSON Schema' : 'Schéma de validation JSON'}</h3>
                      </div>
                      <button
                        onClick={handleCopyJson}
                        className="p-2 bg-[#211914] hover:bg-[#2c221b] border border-[#302017] rounded-lg text-[#bf9e8a] hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold"
                      >
                        {copiedJson ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedJson ? (lang === 'ar' ? 'تم النسخ!' : 'Copié!') : (lang === 'ar' ? 'نسخ الكود' : 'Copier')}</span>
                      </button>
                    </div>
                    <p className="text-xs text-[#bf9e8a] mb-4 leading-relaxed">
                      {lang === 'ar' 
                        ? 'مخطط JSON Schema القياسي للتحقق من سلامة البيانات في قواعد بيانات المستندات مثل MongoDB أو Google Cloud Firestore.' 
                        : 'Spécification de validation JSON Schema pour la validation de modèles dans MongoDB ou Firestore.'}
                    </p>
                    <pre className="bg-[#0d0907] border border-[#211914] p-4 rounded-xl text-xs font-mono text-[#bf7e5a] overflow-x-auto max-h-[350px]">
                      {jsonSchema ? JSON.stringify(jsonSchema, null, 2) : ''}
                    </pre>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#302017] text-xs text-[#826a5c]">
                    {lang === 'ar' ? 'يتطابق تماماً مع بيانات الطلب المدخلة من النموذج.' : 'Structure conforme au modèle d\'insertion et de stockage e-commerce.'}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
