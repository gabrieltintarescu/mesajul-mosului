'use client';

import { endOfMonth, format, startOfMonth, startOfYear, subDays } from 'date-fns';
import { ro } from 'date-fns/locale';
import { saveAs } from 'file-saver';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowUpDown,
    Calendar,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Clock,
    Copy,
    DollarSign,
    Download,
    Eye,
    FileText,
    Filter,
    LogOut,
    Play,
    RefreshCw,
    Search,
    TrendingUp,
    Users,
    Video,
    X,
    XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { StatusBadge } from '@/components/ui';
import { useAdminOrders } from '@/hooks';
import { useAdminStore } from '@/store';
import { Order, OrderStatus } from '@/types';

const statusOptions = [
    { value: '', label: 'Toate Statusurile' },
    { value: 'pending_payment', label: 'În Așteptarea Plății' },
    { value: 'paid', label: 'Plătit' },
    { value: 'generating_script', label: 'Generare Script' },
    { value: 'generating_voice', label: 'Generare Voce' },
    { value: 'generating_video', label: 'Generare Video' },
    { value: 'merging', label: 'Îmbinare' },
    { value: 'completed', label: 'Finalizat' },
    { value: 'failed', label: 'Eșuat' },
    { value: 'expired', label: 'Expirat' },
];

const updateStatusOptions = [
    { value: 'pending_payment', label: 'În Așteptarea Plății' },
    { value: 'paid', label: 'Plătit' },
    { value: 'generating_script', label: 'Generare Script' },
    { value: 'generating_voice', label: 'Generare Voce' },
    { value: 'generating_video', label: 'Generare Video' },
    { value: 'merging', label: 'Îmbinare' },
    { value: 'completed', label: 'Finalizat' },
    { value: 'failed', label: 'Eșuat' },
];

const datePresets = [
    { label: 'Astăzi', getValue: () => ({ start: format(new Date(), 'yyyy-MM-dd'), end: format(new Date(), 'yyyy-MM-dd') }) },
    { label: 'Ultimele 7 zile', getValue: () => ({ start: format(subDays(new Date(), 7), 'yyyy-MM-dd'), end: format(new Date(), 'yyyy-MM-dd') }) },
    { label: 'Ultimele 30 zile', getValue: () => ({ start: format(subDays(new Date(), 30), 'yyyy-MM-dd'), end: format(new Date(), 'yyyy-MM-dd') }) },
    { label: 'Luna curentă', getValue: () => ({ start: format(startOfMonth(new Date()), 'yyyy-MM-dd'), end: format(endOfMonth(new Date()), 'yyyy-MM-dd') }) },
    { label: 'Anul curent', getValue: () => ({ start: format(startOfYear(new Date()), 'yyyy-MM-dd'), end: format(new Date(), 'yyyy-MM-dd') }) },
];

export default function AdminDashboardPage() {
    const router = useRouter();
    const { isAuthenticated, logout, token } = useAdminStore();
    const {
        orders,
        total,
        stats,
        isLoading,
        page,
        pageSize,
        setPage,
        setPageSize,
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        dateRange,
        setDateRange,
        sortBy,
        sortOrder,
        setSorting,
        updateStatus,
        mutate
    } = useAdminOrders();

    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [localSearch, setLocalSearch] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/admin');
        }
    }, [isAuthenticated, router]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(localSearch);
        }, 300);
        return () => clearTimeout(timer);
    }, [localSearch, setSearchQuery]);

    const handleLogout = () => {
        logout();
        router.push('/admin');
    };

    const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        await updateStatus(orderId, newStatus);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const downloadInvoice = async (orderId: string) => {
        if (!token) return;
        setIsDownloading(orderId);
        try {
            const response = await fetch(`/api/admin/invoices?orderId=${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const blob = await response.blob();
                saveAs(blob, `factura-${orderId.slice(0, 8)}.pdf`);
            }
        } catch (error) {
            console.error('Error downloading invoice:', error);
        } finally {
            setIsDownloading(null);
        }
    };

    const downloadBulkInvoices = async () => {
        if (!token) return;
        setIsDownloading('bulk');
        try {
            const body = selectedOrders.length > 0
                ? { orderIds: selectedOrders }
                : { startDate: dateRange.start, endDate: dateRange.end };

            const response = await fetch('/api/admin/invoices', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                const blob = await response.blob();
                saveAs(blob, `facturi-${format(new Date(), 'yyyy-MM-dd')}.zip`);
            }
        } catch (error) {
            console.error('Error downloading bulk invoices:', error);
        } finally {
            setIsDownloading(null);
        }
    };

    const downloadVideo = async (videoUrl: string, orderId: string) => {
        setIsDownloading(orderId);
        try {
            const response = await fetch(videoUrl);
            const blob = await response.blob();
            saveAs(blob, `video-santa-${orderId.slice(0, 8)}.mp4`);
        } catch (error) {
            console.error('Error downloading video:', error);
        } finally {
            setIsDownloading(null);
        }
    };

    const toggleSelectOrder = (orderId: string) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedOrders.length === orders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(orders.map(o => o.id));
        }
    };

    const clearDateFilter = () => {
        setDateRange({ start: undefined, end: undefined });
        setShowDatePicker(false);
    };

    const formatPrice = (bani: number) => `${(bani / 100).toFixed(2)} RON`;
    const totalPages = Math.ceil(total / pageSize);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🎅</span>
                            <h1 className="font-bold text-xl text-gray-900">
                                Santa<span className="text-christmas-gold">AI</span>
                                <span className="text-gray-400 font-normal ml-2">Admin</span>
                            </h1>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-christmas-red transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Deconectare
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        <p className="text-xs text-gray-500">Total Comenzi</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                        <p className="text-xs text-gray-500">Finalizate</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                        <p className="text-xs text-gray-500">În Procesare</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
                        <p className="text-xs text-gray-500">Eșuate</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-christmas-red/10 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-christmas-red" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.revenue)}</p>
                        <p className="text-xs text-gray-500">Venituri Totale</p>
                    </motion.div>
                </div>

                {/* Orders Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                    {/* Table Header */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h2 className="text-lg font-bold text-gray-900">Comenzi ({total})</h2>

                                <div className="flex items-center gap-2">
                                    {/* Refresh */}
                                    <button
                                        onClick={() => mutate()}
                                        className="p-2 text-gray-400 hover:text-christmas-red transition-colors rounded-lg hover:bg-gray-50"
                                        title="Reîmprospătează"
                                    >
                                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                                    </button>

                                    {/* Bulk Actions */}
                                    {(selectedOrders.length > 0 || (dateRange.start && dateRange.end)) && (
                                        <button
                                            onClick={downloadBulkInvoices}
                                            disabled={isDownloading === 'bulk'}
                                            className="flex items-center gap-2 px-4 py-2 bg-christmas-red text-white rounded-lg hover:bg-christmas-red/90 transition-colors disabled:opacity-50"
                                        >
                                            <Download className={`w-4 h-4 ${isDownloading === 'bulk' ? 'animate-pulse' : ''}`} />
                                            {selectedOrders.length > 0
                                                ? `Descarcă ${selectedOrders.length} facturi`
                                                : 'Descarcă facturi perioadă'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Filters Row */}
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Search */}
                                <div className="relative flex-1 min-w-[250px] max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Caută după ID, nume, email..."
                                        value={localSearch}
                                        onChange={(e) => setLocalSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-christmas-gold/50 focus:border-christmas-gold"
                                    />
                                    {localSearch && (
                                        <button
                                            onClick={() => setLocalSearch('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Status Filter */}
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <select
                                        value={statusFilter || ''}
                                        onChange={(e) => setStatusFilter(e.target.value as OrderStatus || undefined)}
                                        className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-christmas-gold/50 bg-white"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date Range Filter */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowDatePicker(!showDatePicker)}
                                        className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm transition-colors ${dateRange.start || dateRange.end
                                                ? 'border-christmas-gold bg-christmas-gold/5 text-christmas-red'
                                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Calendar className="w-4 h-4" />
                                        {dateRange.start && dateRange.end
                                            ? `${format(new Date(dateRange.start), 'd MMM', { locale: ro })} - ${format(new Date(dateRange.end), 'd MMM', { locale: ro })}`
                                            : 'Perioadă'}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>

                                    {showDatePicker && (
                                        <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 min-w-[280px]">
                                            <div className="space-y-3">
                                                <p className="text-xs font-semibold text-gray-500 uppercase">Presetări</p>
                                                <div className="grid grid-cols-1 gap-1">
                                                    {datePresets.map(preset => (
                                                        <button
                                                            key={preset.label}
                                                            onClick={() => {
                                                                const { start, end } = preset.getValue();
                                                                setDateRange({ start, end });
                                                                setShowDatePicker(false);
                                                            }}
                                                            className="text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                                        >
                                                            {preset.label}
                                                        </button>
                                                    ))}
                                                </div>

                                                <hr className="border-gray-100" />

                                                <p className="text-xs font-semibold text-gray-500 uppercase">Personalizat</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-xs text-gray-500">De la</label>
                                                        <input
                                                            type="date"
                                                            value={dateRange.start || ''}
                                                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value || undefined })}
                                                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500">Până la</label>
                                                        <input
                                                            type="date"
                                                            value={dateRange.end || ''}
                                                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value || undefined })}
                                                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                {(dateRange.start || dateRange.end) && (
                                                    <button
                                                        onClick={clearDateFilter}
                                                        className="w-full px-3 py-2 text-sm text-christmas-red hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        Șterge filtrul
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Page Size */}
                                <select
                                    value={pageSize}
                                    onChange={(e) => setPageSize(Number(e.target.value))}
                                    className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-christmas-gold/50 bg-white"
                                >
                                    <option value={10}>10 / pagină</option>
                                    <option value={20}>20 / pagină</option>
                                    <option value={50}>50 / pagină</option>
                                    <option value={100}>100 / pagină</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-left">
                                <tr>
                                    <th className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedOrders.length === orders.length && orders.length > 0}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-gray-300 text-christmas-red focus:ring-christmas-gold"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => setSorting('created_at', sortOrder === 'asc' ? 'desc' : 'asc')}
                                            className="flex items-center gap-1 hover:text-gray-700"
                                        >
                                            ID Comandă
                                            <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Copil</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Preț</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => setSorting('created_at', sortBy === 'created_at' && sortOrder === 'desc' ? 'asc' : 'desc')}
                                            className="flex items-center gap-1 hover:text-gray-700"
                                        >
                                            Data
                                            <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acțiuni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading && orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center">
                                            <RefreshCw className="w-8 h-8 animate-spin text-christmas-gold mx-auto mb-2" />
                                            <p className="text-gray-500">Se încarcă comenzile...</p>
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center">
                                            <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                            <p className="text-gray-500">Nu s-au găsit comenzi</p>
                                            <p className="text-sm text-gray-400 mt-1">Încearcă să modifici filtrele</p>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <OrderRow
                                            key={order.id}
                                            order={order}
                                            isSelected={selectedOrders.includes(order.id)}
                                            isExpanded={expandedOrder === order.id}
                                            isDownloading={isDownloading === order.id}
                                            copiedId={copiedId}
                                            onToggleSelect={() => toggleSelectOrder(order.id)}
                                            onToggleExpand={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                            onCopy={copyToClipboard}
                                            onDownloadInvoice={() => downloadInvoice(order.id)}
                                            onDownloadVideo={() => order.videoUrl && downloadVideo(order.videoUrl, order.id)}
                                            onStatusUpdate={handleStatusUpdate}
                                            formatPrice={formatPrice}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {total > 0 && (
                        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-gray-500">
                                Se afișează <span className="font-medium">{(page - 1) * pageSize + 1}</span> -{' '}
                                <span className="font-medium">{Math.min(page * pageSize, total)}</span> din{' '}
                                <span className="font-medium">{total}</span> comenzi
                            </p>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setPage(1)}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Prima pagină"
                                >
                                    <ChevronsLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Pagina anterioară"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                <div className="flex items-center gap-1 mx-2">
                                    {/* Page numbers */}
                                    {totalPages > 0 && Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (page <= 3) {
                                            pageNum = i + 1;
                                        } else if (page >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = page - 2 + i;
                                        }
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === pageNum
                                                        ? 'bg-christmas-red text-white'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= totalPages}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Pagina următoare"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setPage(totalPages)}
                                    disabled={page >= totalPages}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Ultima pagină"
                                >
                                    <ChevronsRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </main>

            {/* Click outside to close date picker */}
            {showDatePicker && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDatePicker(false)}
                />
            )}
        </div>
    );
}

// Separate OrderRow component for better performance
interface OrderRowProps {
    order: Order;
    isSelected: boolean;
    isExpanded: boolean;
    isDownloading: boolean;
    copiedId: string | null;
    onToggleSelect: () => void;
    onToggleExpand: () => void;
    onCopy: (text: string) => void;
    onDownloadInvoice: () => void;
    onDownloadVideo: () => void;
    onStatusUpdate: (orderId: string, status: OrderStatus) => void;
    formatPrice: (bani: number) => string;
}

function OrderRow({
    order,
    isSelected,
    isExpanded,
    isDownloading,
    copiedId,
    onToggleSelect,
    onToggleExpand,
    onCopy,
    onDownloadInvoice,
    onDownloadVideo,
    onStatusUpdate,
    formatPrice,
}: OrderRowProps) {
    return (
        <>
            <tr
                className={`hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-blue-50' : ''}`}
            >
                <td className="px-4 py-4">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onToggleSelect}
                        className="w-4 h-4 rounded border-gray-300 text-christmas-red focus:ring-christmas-gold"
                    />
                </td>
                <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onCopy(order.id)}
                            className="group flex items-center gap-1"
                            title="Copiază ID"
                        >
                            <code className="text-sm font-mono text-christmas-red">
                                {order.id.slice(0, 8)}...
                            </code>
                            {copiedId === order.id ? (
                                <Check className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                                <Copy className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100" />
                            )}
                        </button>
                    </div>
                </td>
                <td className="px-4 py-4">
                    <div>
                        <p className="font-medium text-gray-900">{order.childDetails.name}</p>
                        <p className="text-sm text-gray-500">
                            {order.childDetails.age} ani, {order.childDetails.gender === 'boy' ? 'Băiat' : 'Fată'}
                        </p>
                    </div>
                </td>
                <td className="px-4 py-4">
                    <p className="text-sm text-gray-600">{order.email}</p>
                </td>
                <td className="px-4 py-4">
                    <StatusBadge status={order.status} size="sm" />
                </td>
                <td className="px-4 py-4">
                    <div>
                        <p className="text-sm font-medium text-gray-900">{formatPrice(order.finalPrice)}</p>
                        {order.couponCode && (
                            <p className="text-xs text-green-600">-{formatPrice(order.discountAmount || 0)}</p>
                        )}
                    </div>
                </td>
                <td className="px-4 py-4">
                    <div>
                        <p className="text-sm text-gray-600">
                            {format(new Date(order.createdAt), 'd MMM yyyy', { locale: ro })}
                        </p>
                        <p className="text-xs text-gray-400">
                            {format(new Date(order.createdAt), 'HH:mm')}
                        </p>
                    </div>
                </td>
                <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                        {/* View Details */}
                        <button
                            onClick={onToggleExpand}
                            className={`p-2 rounded-lg transition-colors ${isExpanded
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                }`}
                            title="Detalii"
                        >
                            <Eye className="w-4 h-4" />
                        </button>

                        {/* Download Invoice */}
                        {order.status !== 'pending_payment' && (
                            <button
                                onClick={onDownloadInvoice}
                                disabled={isDownloading}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                title="Descarcă Factura"
                            >
                                <FileText className={`w-4 h-4 ${isDownloading ? 'animate-pulse' : ''}`} />
                            </button>
                        )}

                        {/* Download Video */}
                        {order.videoUrl && (
                            <button
                                onClick={onDownloadVideo}
                                disabled={isDownloading}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Descarcă Video"
                            >
                                <Video className={`w-4 h-4 ${isDownloading ? 'animate-pulse' : ''}`} />
                            </button>
                        )}
                    </div>
                </td>
            </tr>

            {/* Expanded Details Row */}
            <AnimatePresence>
                {isExpanded && (
                    <tr>
                        <td colSpan={8} className="px-4 py-0 bg-blue-50/50">
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Child Details */}
                                    <div className="bg-white rounded-xl p-4 shadow-sm">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <span className="text-lg">👶</span> Detalii Copil
                                        </h4>
                                        <dl className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500">Nume:</dt>
                                                <dd className="font-medium">{order.childDetails.name}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500">Vârstă:</dt>
                                                <dd className="font-medium">{order.childDetails.age} ani</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500">Gen:</dt>
                                                <dd className="font-medium">{order.childDetails.gender === 'boy' ? 'Băiat' : 'Fată'}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500">Comportament:</dt>
                                                <dd className="font-medium">
                                                    {order.childDetails.behavior === 'nice' ? 'Cuminte' :
                                                        order.childDetails.behavior === 'naughty' ? 'Obraznic' : 'Mai mult cuminte'}
                                                </dd>
                                            </div>
                                        </dl>
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <p className="text-xs text-gray-500 mb-1">Realizări:</p>
                                            <p className="text-sm text-gray-700">{order.childDetails.achievements}</p>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <p className="text-xs text-gray-500 mb-1">Lucruri preferate:</p>
                                            <p className="text-sm text-gray-700">{order.childDetails.favoriteThings}</p>
                                        </div>
                                    </div>

                                    {/* Invoicing Details */}
                                    <div className="bg-white rounded-xl p-4 shadow-sm">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <span className="text-lg">📄</span> Detalii Facturare
                                        </h4>
                                        {order.invoicingDetails ? (
                                            <dl className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500">Tip:</dt>
                                                    <dd className="font-medium">
                                                        {order.invoicingDetails.invoiceType === 'business' ? 'Persoană Juridică' : 'Persoană Fizică'}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500">Nume:</dt>
                                                    <dd className="font-medium">{order.invoicingDetails.name}</dd>
                                                </div>
                                                {order.invoicingDetails.invoiceType === 'business' && (
                                                    <>
                                                        <div className="flex justify-between">
                                                            <dt className="text-gray-500">Firma:</dt>
                                                            <dd className="font-medium">{order.invoicingDetails.companyName}</dd>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <dt className="text-gray-500">CUI:</dt>
                                                            <dd className="font-medium">{order.invoicingDetails.cui}</dd>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500">Telefon:</dt>
                                                    <dd className="font-medium">{order.invoicingDetails.phone}</dd>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <p className="text-xs text-gray-500 mb-1">Adresa:</p>
                                                    <p className="text-sm text-gray-700">
                                                        {order.invoicingDetails.address}, {order.invoicingDetails.city}, {order.invoicingDetails.county} {order.invoicingDetails.postalCode}
                                                    </p>
                                                </div>
                                            </dl>
                                        ) : (
                                            <p className="text-sm text-gray-500">Nu sunt disponibile detalii de facturare</p>
                                        )}
                                    </div>

                                    {/* Order Management */}
                                    <div className="bg-white rounded-xl p-4 shadow-sm">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <span className="text-lg">⚙️</span> Gestionare Comandă
                                        </h4>
                                        <dl className="space-y-2 text-sm mb-4">
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500">ID Complet:</dt>
                                                <dd className="font-mono text-xs break-all">{order.id}</dd>
                                            </div>
                                            {order.paymentIntentId && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500">Stripe PI:</dt>
                                                    <dd className="font-mono text-xs">{order.paymentIntentId.slice(0, 20)}...</dd>
                                                </div>
                                            )}
                                            {order.couponCode && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500">Cod Cupon:</dt>
                                                    <dd className="font-medium text-green-600">{order.couponCode}</dd>
                                                </div>
                                            )}
                                            {order.errorMessage && (
                                                <div className="mt-3 p-2 bg-red-50 rounded-lg">
                                                    <p className="text-xs text-red-600">{order.errorMessage}</p>
                                                </div>
                                            )}
                                        </dl>

                                        <div className="space-y-3">
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Actualizează Status</label>
                                            <select
                                                value={order.status}
                                                onChange={(e) => onStatusUpdate(order.id, e.target.value as OrderStatus)}
                                                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-christmas-gold/50"
                                            >
                                                {updateStatusOptions.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {order.videoUrl && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <a
                                                    href={order.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm justify-center"
                                                >
                                                    <Play className="w-4 h-4" />
                                                    Vizualizează Video
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </td>
                    </tr>
                )}
            </AnimatePresence>
        </>
    );
}
