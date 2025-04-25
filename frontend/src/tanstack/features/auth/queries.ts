import { meOptions } from "@/generated/backend-client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
	return useQuery({
		...meOptions(),
	});
}
