import { adminGetOrders, adminUpdateOrderStatus } from '@/lib/api';
import { Order, OrderStatus } from '@/types';
import { useCallback, useState } from 'react';
import useSWR from 'swr';

interface OrderStats {
    total: number;
    completed: number;
    pending: number;
    failed: number;
    revenue: number;
}

interface UseAdminOrdersReturn {
    orders: Order[];
    total: number;
    stats: OrderStats;
    isLoading: boolean;
    error: Error | null;
    page: number;
    pageSize: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    statusFilter: OrderStatus | undefined;
    setStatusFilter: (status: OrderStatus | undefined) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    dateRange: { start: string | undefined; end: string | undefined };
    setDateRange: (range: { start: string | undefined; end: string | undefined }) => void;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    updateStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
    mutate: () => void;
}

export function useAdminOrders(): UseAdminOrdersReturn {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState<{ start: string | undefined; end: string | undefined }>({
        start: undefined,
        end: undefined,
    });
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const { data, error, isLoading, mutate } = useSWR(
        ['adminOrders', page, pageSize, statusFilter, searchQuery, dateRange, sortBy, sortOrder],
        async () => {
            const response = await adminGetOrders(
                page,
                pageSize,
                statusFilter,
                searchQuery,
                dateRange.start,
                dateRange.end,
                sortBy,
                sortOrder
            );
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.error || 'Failed to fetch orders');
        },
        {
            revalidateOnFocus: true,
            keepPreviousData: true,
        }
    );

    const updateStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
        const response = await adminUpdateOrderStatus({ orderId, status });
        if (response.success) {
            mutate();
            return true;
        }
        return false;
    };

    const setSorting = useCallback((newSortBy: string, newSortOrder: 'asc' | 'desc') => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    }, []);

    const handleSetSearchQuery = useCallback((query: string) => {
        setSearchQuery(query);
        setPage(1); // Reset to first page when searching
    }, []);

    const handleSetStatusFilter = useCallback((status: OrderStatus | undefined) => {
        setStatusFilter(status);
        setPage(1); // Reset to first page when filtering
    }, []);

    const handleSetDateRange = useCallback((range: { start: string | undefined; end: string | undefined }) => {
        setDateRange(range);
        setPage(1); // Reset to first page when filtering
    }, []);

    return {
        orders: data?.orders || [],
        total: data?.total || 0,
        stats: data?.stats || { total: 0, completed: 0, pending: 0, failed: 0, revenue: 0 },
        isLoading,
        error: error || null,
        page,
        pageSize,
        setPage,
        setPageSize,
        statusFilter,
        setStatusFilter: handleSetStatusFilter,
        searchQuery,
        setSearchQuery: handleSetSearchQuery,
        dateRange,
        setDateRange: handleSetDateRange,
        sortBy,
        sortOrder,
        setSorting,
        updateStatus,
        mutate,
    };
}
