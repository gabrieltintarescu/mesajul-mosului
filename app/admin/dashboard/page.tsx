'use client';

import { motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    DollarSign,
    Filter,
    LogOut,
    RefreshCw,
    Search,
    TrendingUp,
    Users,
    Video
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { StatusBadge } from '@/components/ui';
import { useAdminOrders } from '@/hooks';
import { useAdminStore } from '@/store';
import { OrderStatus } from '@/types';

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

export default function AdminDashboardPage() {
    const router = useRouter();
    const { isAuthenticated, logout } = useAdminStore();
    const {
        orders,
        total,
        isLoading,
        page,
        setPage,
        statusFilter,
        setStatusFilter,
        updateStatus,
        mutate
    } = useAdminOrders();

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/admin');
        }
    }, [isAuthenticated, router]);

    const handleLogout = () => {
        logout();
        router.push('/admin');
    };

    const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        await updateStatus(orderId, newStatus);
    };

    const filteredOrders = orders.filter(order =>
        order.childDetails.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Stats
    const stats = {
        totalOrders: total,
        completedOrders: orders.filter(o => o.status === 'completed').length,
        pendingOrders: orders.filter(o => o.status !== 'completed' && o.status !== 'failed').length,
        revenue: orders.filter(o => o.status !== 'pending_payment').length * 19.99,
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                        <p className="text-sm text-gray-500">Total Comenzi</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                <Video className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
                        <p className="text-sm text-gray-500">Videoclipuri Finalizate</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                <RefreshCw className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                        <p className="text-sm text-gray-500">În Procesare</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-christmas-red/10 flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-christmas-red" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.revenue.toFixed(2)} RON</p>
                        <p className="text-sm text-gray-500">Venituri Totale</p>
                    </motion.div>
                </div>

                {/* Orders Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                    {/* Table Header */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h2 className="text-lg font-bold text-gray-900">Comenzi</h2>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Caută comenzi..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-christmas-gold/50 focus:border-christmas-gold"
                                    />
                                </div>

                                {/* Filter */}
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <select
                                        value={statusFilter || ''}
                                        onChange={(e) => setStatusFilter(e.target.value as OrderStatus || undefined)}
                                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-christmas-gold/50"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Refresh */}
                                <button
                                    onClick={() => mutate()}
                                    className="p-2 text-gray-400 hover:text-christmas-red transition-colors"
                                    title="Reîmprospătează"
                                >
                                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-left">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Comandă</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Copil</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Creat</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acțiuni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <code className="text-sm font-mono text-christmas-red">{order.id}</code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{order.childDetails.name}</p>
                                                <p className="text-sm text-gray-500">{order.childDetails.age} ani</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{order.email}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} size="sm" />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                                                className="text-sm px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-christmas-gold/50"
                                            >
                                                {updateStatusOptions.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredOrders.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Nu s-au găsit comenzi</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Se afișează {filteredOrders.length} din {total} comenzi
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 text-sm text-gray-600">Pagina {page}</span>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={filteredOrders.length < 10}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
