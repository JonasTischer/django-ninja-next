import { toast } from "sonner";

export const handleApiError = (error: unknown, defaultMessage: string) => {
	const message = error instanceof Error ? error.message : defaultMessage;
	toast.error(message);
	// Add Sentry/Bugsnag logging here
};
