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

const formSchema = z.object({
	email: z.string().email({
		message: "Bitte geben Sie eine gültige E-Mail Adresse ein.",
	}),
	password: z.string().min(1, {
		message: "Passwort wird benötigt.",
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
					Willkommen zurück!
				</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					Melden Sie sich mit Ihrer E-Mail Adresse an.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xs font-medium text-muted-foreground">E-Mail</FormLabel>
								<FormControl>
									<Input
										placeholder="ihre@email.de"
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
									<FormLabel className="text-xs font-medium text-muted-foreground">Passwort</FormLabel>
									<Link
										href="/password-reset"
										className="ml-auto inline-block text-xs text-primary hover:underline"
									>
										Passwort vergessen?
									</Link>
								</div>
								<FormControl>
									<Input type="password" {...field} className="mt-1" placeholder="Ihr Passwort"/>
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
						{login.isPending ? 'Anmelden...' : 'Anmelden'}
					</Button>
				</form>
			</Form>

			<p className="text-center text-xs text-muted-foreground">
				Noch kein Account?{" "}
				<Link
					href="/register"
					className="font-medium text-primary hover:underline"
				>
					Registrieren
				</Link>
			</p>
		</div>
	);
}
