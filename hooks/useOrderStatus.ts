import { getOrderStatus } from '@/lib/api';
import { Order } from '@/types';
import useSWR from 'swr';

interface UseOrderStatusReturn {
    order: Order | null;
    isLoading: boolean;
    error: Error | null;
    mutate: () => void;
}

export function useOrderStatus(orderId: string | null, email: string | null): UseOrderStatusReturn {
    const { data, error, isLoading, mutate } = useSWR(
        orderId && email ? ['orderStatus', orderId, email] : null,
        async () => {
            if (!orderId || !email) return null;
            const response = await getOrderStatus(orderId, email);
            if (response.success && response.data) {
                return response.data.order;
            }
            throw new Error(response.error || 'Failed to fetch order status');
        },
        {
            refreshInterval: 3000, // Poll every 3 seconds
            revalidateOnFocus: true,
        }
    );

    return {
        order: data || null,
        isLoading,
        error: error || null,
        mutate,
    };
}
