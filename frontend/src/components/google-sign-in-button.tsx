"use client";

import { Button } from "@/components/ui/button";
import { useSocialAuth } from "@/tanstack/features/auth/mutations";
import { useEffect, useState, useRef } from "react";

// Google Sign-In API type definitions
interface GoogleCredentialResponse {
	credential: string;
	select_by: string;
}

interface GooglePromptNotification {
	isNotDisplayed(): boolean;
	isSkippedMoment(): boolean;
	getNotDisplayedReason(): string;
	getSkippedReason(): string;
}

interface GoogleAccounts {
	id: {
		initialize(config: {
			client_id: string;
			callback: (response: GoogleCredentialResponse) => void;
			auto_select?: boolean;
			cancel_on_tap_outside?: boolean;
		}): void;
		renderButton(
			element: HTMLElement,
			config: {
				theme?: "outline" | "filled_blue" | "filled_black";
				size?: "large" | "medium" | "small";
				text?: "signin_with" | "signup_with" | "continue_with" | "signin";
				shape?: "rectangular" | "pill" | "circle" | "square";
				logo_alignment?: "left" | "center";
			},
		): void;
		prompt(callback?: (notification: GooglePromptNotification) => void): void;
	};
}

interface GoogleAPI {
	accounts: GoogleAccounts;
}

declare global {
	interface Window {
		google: GoogleAPI;
	}
}

export function GoogleSignInButton() {
	const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
	const socialAuth = useSocialAuth();
	const buttonRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Load Google Sign-In script
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;
		script.onload = () => {
			setIsGoogleLoaded(true);
		};
		script.onerror = () => {
			console.error("Failed to load Google Sign-In script");
		};
		document.head.appendChild(script);

		return () => {
			if (document.head.contains(script)) {
				document.head.removeChild(script);
			}
		};
	}, []);

	useEffect(() => {
		if (isGoogleLoaded && window.google && buttonRef.current) {
			const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

			if (!clientId) {
				console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
				return;
			}

			try {
				// Initialize Google Sign-In
				window.google.accounts.id.initialize({
					client_id: clientId,
					callback: handleCredentialResponse,
					auto_select: false,
					cancel_on_tap_outside: true,
				});

				// Render the Google Sign-In button
				window.google.accounts.id.renderButton(buttonRef.current, {
					theme: "outline",
					size: "large",
					text: "continue_with",
					shape: "rectangular",
					logo_alignment: "left",
				});
			} catch (error) {
				console.error("Error initializing Google Sign-In:", error);
			}
		}
	}, [isGoogleLoaded]);

	const handleCredentialResponse = (response: GoogleCredentialResponse) => {
		socialAuth.mutate({
			body: {
				credential: response.credential,
				provider: "google",
			},
		});
	};

	// Show loading state while Google is loading
	if (!isGoogleLoaded) {
		return (
			<Button
				type="button"
				variant="outline"
				className="w-full h-11 border-border/50 hover:border-border text-muted-foreground"
				disabled
			>
				<svg
					className="mr-2 h-4 w-4 animate-spin"
					viewBox="0 0 24 24"
					aria-label="Loading"
				>
					<title>Loading spinner</title>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
						fill="none"
					/>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
				Loading Google...
			</Button>
		);
	}

	return (
		<div className="w-full">
			{/* Google Sign-In button container */}
			<div
				ref={buttonRef}
				className="w-full [&>div]:w-full [&>div>div]:w-full"
			/>

			{/* Loading overlay when authenticating */}
			{socialAuth.isPending && (
				<div className="mt-2 flex items-center justify-center">
					<svg
						className="h-4 w-4 animate-spin text-primary"
						viewBox="0 0 24 24"
						aria-label="Signing in"
					>
						<title>Authentication spinner</title>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
							fill="none"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
					<span className="ml-2 text-sm text-muted-foreground">
						Signing in...
					</span>
				</div>
			)}
		</div>
	);
}
