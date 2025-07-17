import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import clsx from "clsx";
import { Toaster } from "sonner";
import { Providers } from "./providers";

import "./globals.css";
//import '@/styles/tailwind.css'

export const metadata: Metadata = {
	title: {
		template: "%s - Django Next Ninja",
		default: "Django Next Ninja - Your Django Next Ninja Starter Kit",
	},
	description: "Your Django Next Ninja Starter Kit",
};

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

const lexend = Lexend({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-lexend",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={clsx(
				"h-full scroll-smooth bg-white antialiased",
				inter.variable,
				lexend.variable,
			)}
		>
			<body className="flex h-full flex-col">
				<Toaster richColors />
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
