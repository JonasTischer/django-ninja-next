import { LoginForm } from "@/components/login-form";
import Logo from "@/components/common/logo"; // Assuming you have a Logo component
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Login | Django Next Ninja",
	description: "Register or login to your account",
};

export default function LoginPage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-6 bg-linear-to-b from-cyan-50/50 to-teal-50/50 dark:from-transparent dark:to-transparent">
			{/* Logo and Branding */}
			<div className="mb-8 flex flex-col items-center gap-2">
				<Logo width={48} height={56} /> {/* Adjust size as needed */}
				<div className="flex flex-col items-center">
					<h1 className="text-xl font-semibold tracking-tight medical-text-gradient">
						Django Next Ninja
					</h1>
					<p className="text-sm text-muted-foreground">
						Your Django Next Ninja Starter Kit
					</p>
				</div>
			</div>

			{/* Login Form Container */}
			<div className="w-full max-w-sm">
				<LoginForm />
			</div>
		</main>
	);
}
