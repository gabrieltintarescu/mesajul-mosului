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
            keepPreviousData: true, // Keep showing previous data on error
            errorRetryCount: 5, // Retry up to 5 times on error
            errorRetryInterval: 2000, // Wait 2 seconds between retries
            shouldRetryOnError: true, // Enable automatic retry
            dedupingInterval: 1000, // Dedupe requests within 1 second
        }
    );

    // Only report error if we don't have any data
    // This prevents showing error screen when we have valid cached data
    const effectiveError = data ? null : error;

    return {
        order: data || null,
        isLoading,
        error: effectiveError || null,
        mutate,
    };
}
