"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/tanstack/features/auth/mutations";
import { GoogleSignInButton } from "./google-sign-in-button";

const formSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	password: z.string().min(1, {
		message: "Password is required.",
	}),
});

export function LoginForm() {
	const login = useLogin();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (credentials: z.infer<typeof formSchema>) => {
		login.mutate({
			body: credentials,
		});
	};

	return (
		<div className="w-full space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold tracking-tight text-foreground">
					Welcome back!
				</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					Sign in to your account to continue
				</p>
			</div>

			{/* Google Sign-In Button */}
			<div className="mb-6">
				<GoogleSignInButton />
			</div>

			{/* Divider */}
			<div className="relative mb-6">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with email
					</span>
				</div>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xs font-medium text-muted-foreground">
									Email
								</FormLabel>
								<FormControl>
									<Input
										placeholder="your@email.com"
										{...field}
										className="mt-1"
									/>
								</FormControl>
								<FormMessage className="text-xs" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between">
									<FormLabel className="text-xs font-medium text-muted-foreground">
										Password
									</FormLabel>
									<Link
										href="/password-reset"
										className="ml-auto inline-block text-xs text-primary hover:underline"
									>
										Forgot password?
									</Link>
								</div>
								<FormControl>
									<Input
										type="password"
										{...field}
										className="mt-1"
										placeholder="Your password"
									/>
								</FormControl>
								<FormMessage className="text-xs" />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						className="w-full medical-button-gradient text-primary-foreground font-semibold tracking-wide uppercase text-sm h-11"
						disabled={login.isPending}
					>
						{login.isPending ? "Signing in..." : "Sign in"}
					</Button>
				</form>
			</Form>

			<p className="text-center text-xs text-muted-foreground">
				Don't have an account?{" "}
				<Link
					href="/register"
					className="font-medium text-primary hover:underline"
				>
					Sign up
				</Link>
			</p>
		</div>
	);
}
