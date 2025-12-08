import { functions, inngest } from '@/lib/inngest';
import { serve } from 'inngest/next';

// Create the Inngest API handler
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions,
});
