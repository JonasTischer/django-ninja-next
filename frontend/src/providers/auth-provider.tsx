"use client";

import Spinner from "@/components/common/spinner";
import { useUser } from "@/tanstack/features/auth/queries";
import { redirect } from "next/navigation";
import { UserProvider } from "./user-provider";

export function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data: user, isLoading, isError } = useUser();

	if (isLoading) {
		return (
			<div className="flex h-screen w-screen items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (isError || !user) {
		redirect("/login");
	}

	return <UserProvider initialUser={user}>{children}</UserProvider>;
}
