import { adminGetOrders, adminUpdateOrderStatus } from '@/lib/api';
import { Order, OrderStatus } from '@/types';
import { useState } from 'react';
import useSWR from 'swr';

interface UseAdminOrdersReturn {
    orders: Order[];
    total: number;
    isLoading: boolean;
    error: Error | null;
    page: number;
    setPage: (page: number) => void;
    statusFilter: OrderStatus | undefined;
    setStatusFilter: (status: OrderStatus | undefined) => void;
    updateStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
    mutate: () => void;
}

export function useAdminOrders(): UseAdminOrdersReturn {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();

    const { data, error, isLoading, mutate } = useSWR(
        ['adminOrders', page, statusFilter],
        async () => {
            const response = await adminGetOrders(page, 10, statusFilter);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.error || 'Failed to fetch orders');
        },
        {
            revalidateOnFocus: true,
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

    return {
        orders: data?.orders || [],
        total: data?.total || 0,
        isLoading,
        error: error || null,
        page,
        setPage,
        statusFilter,
        setStatusFilter,
        updateStatus,
        mutate,
    };
}
