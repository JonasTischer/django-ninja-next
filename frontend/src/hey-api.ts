import type { CreateClientConfig } from "@/generated/backend-client/client.gen";
import { getAccessToken } from "./utils/token";

export const createClientConfig: CreateClientConfig = (config) => ({
	...config,
	baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
	auth: async () => {
		const token = await getAccessToken();
		return token ? `${token}` : undefined;
	},
	headers: {
		"Content-Type": "application/json",
	},
	credentials: "include",
});
