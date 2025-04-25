"use client";

import { ModalProvider } from "@/providers/modal-provider";
import { QueryProvider } from "@/providers/query-provider";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const NextThemesProvider = dynamic(
	() => import("next-themes").then((mod) => mod.ThemeProvider),
	{ ssr: false },
);

export function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryProvider>
			<NextThemesProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				{children}
				<ModalProvider />
			</NextThemesProvider>
		</QueryProvider>
	);
}
