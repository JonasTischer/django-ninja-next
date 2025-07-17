import {
	loginMutation,
	logoutMutation,
	registerMutation,
	socialAuthMutation,
} from "@/generated/backend-client/@tanstack/react-query.gen";
import { handleApiError } from "@/utils/error-handler";
import { clearAccessToken, setAccessToken } from "@/utils/token";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogin() {
	const router = useRouter();
	return useMutation({
		...loginMutation(),
		onSuccess: (data) => {
			setAccessToken(data.access);
			router.push("/dashboard");
			toast.success("Account created and logged in successfully!");
		},
		onError: (error) => {
			handleApiError(error, "Login failed");
		},
	});
}

export function useLogout() {
	const router = useRouter();

	return useMutation({
		...logoutMutation(),
		onSuccess: () => {
			clearAccessToken();
			router.push("/");
		},
	});
}

export function useSignUp() {
	const login = useLogin();

	return useMutation({
		...registerMutation(),
		// biome-ignore lint/suspicious/noExplicitAny: Legacy API requires any type
		onSuccess: (data, variables: any) => {
			if (variables?.body?.email && variables?.body?.password) {
				login.mutate({
					body: {
						email: variables.body.email,
						password: variables.body.password,
					},
				});
			} else {
				toast.error(
					"Account created, but auto-login failed. Please log in manually.",
				);
			}
		},
		onError: (error) => {
			handleApiError(error, "Sign up failed");
		},
	});
}

export function useSocialAuth() {
	const router = useRouter();

	return useMutation({
		...socialAuthMutation(),
		onSuccess: (data) => {
			setAccessToken(data.access);
			router.push("/dashboard");
			toast.success("Successfully signed in with Google!");
		},
		onError: (error) => {
			handleApiError(error, "Social login failed");
		},
	});
}

// activation: (uid: string, token: string) =>
//   apiClient.post('/users/activation/', { uid, token }),

// resetPassword: (email: string) =>
//   apiClient.post('/users/reset_password/', { email }),

// resetPasswordConfirm: (data: {
//   uid: string;
//   token: string;
//   new_password: string;
//   re_new_password: string;
// }) => apiClient.post('/users/reset_password_confirm/', data),
