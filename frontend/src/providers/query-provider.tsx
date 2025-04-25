"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { client } from "@/generated/backend-client/client.gen";
import { refresh } from "@/generated/backend-client/sdk.gen";
import { setAccessToken } from "@/utils/token";
// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

async function refreshToken() {
	const refreshMutation = await refresh({
		client: client,
	});
	setAccessToken(refreshMutation.data?.access || "");
	return refreshMutation.data;
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30 * 60 * 1000, // 30 minutes
			retry: (failureCount, error: Error) => {
				if (failureCount > 1) return false;

				// Check for token invalid error
				const isTokenError =
					error?.message === "Given token not valid for any token type" ||
					error?.message === "token_not_valid";

				if (isTokenError) {
					refreshToken();
					return true;
				}
				return false;
			},
		},
	},
});

interface QueryProviderProps {
	children: React.ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{process.env.NODE_ENV !== "production" && <ReactQueryDevtools />}
		</QueryClientProvider>
	);
};
