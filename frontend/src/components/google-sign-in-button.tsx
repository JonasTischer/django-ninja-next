"use client";

import { Button } from "@/components/ui/button";
import { useSocialAuth } from "@/tanstack/features/auth/mutations";
import { useEffect, useState, useRef } from "react";

declare global {
	interface Window {
		google: any;
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
			console.log("✅ Google script loaded");
			setIsGoogleLoaded(true);
		};
		script.onerror = () => {
			console.error("❌ Failed to load Google script");
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
			console.log("🔧 Initializing Google Sign-In...");
			try {
				// Initialize Google Sign-In
				window.google.accounts.id.initialize({
					client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
					callback: handleCredentialResponse,
					auto_select: false,
					cancel_on_tap_outside: true,
				});

				// Render the Google Sign-In button with custom styling
				window.google.accounts.id.renderButton(
					buttonRef.current,
					{
						theme: "outline",
						size: "large",
						width: "100%",
						text: "continue_with",
						shape: "rectangular",
						logo_alignment: "left",
					}
				);

				console.log("✅ Google Sign-In initialized and button rendered");
			} catch (error) {
				console.error("❌ Error initializing Google Sign-In:", error);
			}
		}
	}, [isGoogleLoaded]);

	const handleCredentialResponse = (response: any) => {
		console.log("🎉 Google credential received:", response);

		// The response.credential is a JWT ID token from Google
		socialAuth.mutate({
			body: {
				credential: response.credential,
				provider: "google",
			},
		});
	};

	const handleFallbackSignIn = () => {
		console.log("🔘 Fallback Google Sign-In button clicked");
		if (window.google) {
			try {
				window.google.accounts.id.prompt((notification: any) => {
					console.log("🔔 Prompt notification:", notification);
					if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
						console.log("⚠️ Prompt not displayed");
					}
				});
			} catch (error) {
				console.error("❌ Error prompting Google Sign-In:", error);
			}
		} else {
			console.error("❌ Google not loaded");
		}
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
				<svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
				</svg>
				Loading Google...
			</Button>
		);
	}

	return (
		<div className="w-full">
			{/* Custom wrapper to style Google's button */}
			<div
				ref={buttonRef}
				className="w-full [&>div]:w-full [&>div]:h-11 [&>div>div]:h-11 [&>div>div]:rounded-md [&>div>div]:border-border/50 [&>div>div]:hover:border-border [&>div>div]:transition-colors [&>div>div]:text-sm [&>div>div]:font-medium [&>div>div]:tracking-wide"
			/>

			{/* Loading overlay when authenticating */}
			{socialAuth.isPending && (
				<div className="mt-2 flex items-center justify-center">
					<svg className="h-4 w-4 animate-spin text-primary" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
					</svg>
					<span className="ml-2 text-sm text-muted-foreground">Signing in...</span>
				</div>
			)}
		</div>
	);
}