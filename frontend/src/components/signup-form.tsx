"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@/tanstack/features/auth/mutations";
import { CheckCircle } from "lucide-react";
import { GoogleSignInButton } from "./google-sign-in-button";

const formSchema = z
	.object({
		email: z.string().email({
			message: "Please enter a valid email address.",
		}),
		first_name: z.string().min(2, {
			message: "First name must be at least 2 characters.",
		}),
		last_name: z.string().min(2, {
			message: "Last name must be at least 2 characters.",
		}),
		password: z.string().min(8, {
			message: "Password must be at least 8 characters.",
		}),
		re_password: z.string().min(8, {
			message: "Password must be at least 8 characters.",
		}),
		terms: z.boolean().refine((val) => val === true, {
			message: "You must agree to the Terms of Service and Privacy Policy.",
		}),
	})
	.refine((data) => data.password === data.re_password, {
		message: "Passwords do not match.",
		path: ["re_password"],
	});

export function SignUpForm() {
	const signUp = useSignUp();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			first_name: "",
			last_name: "",
			password: "",
			re_password: "",
			terms: false,
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await signUp.mutate({
			body: {
				email: values.email,
				password: values.password,
				re_password: values.re_password,
				first_name: values.first_name,
				last_name: values.last_name,
			},
		});
	}

	return (
		<Card className="w-full max-w-lg">
			<CardHeader className="text-center lg:text-left">
				<CardTitle className="text-2xl font-bold tracking-tight">
					Django Next Ninja Account
				</CardTitle>
				<CardDescription className="mt-1 text-sm">
					Create your Django Next Ninja account
				</CardDescription>
			</CardHeader>
			<CardContent>
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
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<FormField
								control={form.control}
								name="first_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-medium text-muted-foreground">
											First Name
										</FormLabel>
										<FormControl>
											<Input placeholder="John" {...field} className="mt-1" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="last_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-medium text-muted-foreground">
											Last Name
										</FormLabel>
										<FormControl>
											<Input placeholder="Doe" {...field} className="mt-1" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

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
											type="email"
											placeholder="john.doe@example.com"
											{...field}
											className="mt-1"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-xs font-medium text-muted-foreground">
										Create Password
									</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="At least 8 characters"
											{...field}
											className="mt-1"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="re_password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-xs font-medium text-muted-foreground">
										Confirm Password
									</FormLabel>
									<FormControl>
										<Input type="password" {...field} className="mt-1" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="terms"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel className="text-xs font-normal leading-snug text-muted-foreground">
											I agree to the{" "}
											<Link
												href="/agb"
												className="underline hover:text-primary"
											>
												Terms of Service
											</Link>{" "}
											and the{" "}
											<Link
												href="/datenschutz"
												className="underline hover:text-primary"
											>
												Data Privacy Policy
											</Link>{" "}
											of Django Next Ninja.
										</FormLabel>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="w-full medical-button-gradient text-primary-foreground font-semibold tracking-wide uppercase text-sm h-11"
							disabled={signUp.isPending}
						>
							{signUp.isPending ? "Create Account..." : "Create Account"}
						</Button>
					</form>
				</Form>

				<div className="mt-6 space-y-3 text-center">
					<p className="text-xs text-muted-foreground">
						Already have an account?{" "}
						<Link
							href="/login"
							className="font-medium text-primary hover:underline"
						>
							Login
						</Link>
					</p>
					<p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
						<CheckCircle className="h-3.5 w-3.5 text-green-600" />
						GDPR-compliant
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
