"use client";

import { useState } from "react";
import { Check, Crown, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface Plan {
	id: number;
	name: string;
	price: number;
	currency: string;
	description: string;
	features: string[];
	is_active: boolean;
}

interface ProModalProps {
	children: React.ReactNode;
}

export function ProModal({ children }: ProModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [plans, setPlans] = useState<Plan[]>([]);

	// Mock data for now - you'll replace this with actual API calls
	const mockPlans: Plan[] = [
		{
			id: 1,
			name: "free",
			price: 0,
			currency: "USD",
			description: "Free plan with basic features",
			features: ["Basic features", "Limited usage", "Community support"],
			is_active: true,
		},
		{
			id: 2,
			name: "pro",
			price: 9.99,
			currency: "USD",
			description: "Pro plan with advanced features",
			features: [
				"All basic features",
				"Advanced analytics",
				"Priority support",
				"Custom integrations",
				"API access",
			],
			is_active: true,
		},
		{
			id: 3,
			name: "enterprise",
			price: 29.99,
			currency: "USD",
			description: "Enterprise plan with premium features",
			features: [
				"All pro features",
				"White-label options",
				"Dedicated support",
				"Custom development",
				"SLA guarantee",
				"Team collaboration",
			],
			is_active: true,
		},
	];

	const handleUpgrade = async (planId: number) => {
		setLoading(true);
		try {
			// Here you would make the API call to create a checkout session
			// const response = await createCheckoutSession({
			//   plan_id: planId,
			//   success_url: `${window.location.origin}/dashboard?payment=success`,
			//   cancel_url: `${window.location.origin}/dashboard?payment=canceled`,
			// });
			// redirectToCheckout(response.session_id);

			// For now, just show a toast
			toast.success("Upgrade feature coming soon!");
		} catch (error) {
			toast.error("Failed to start upgrade process");
		} finally {
			setLoading(false);
		}
	};

	const getPlanIcon = (planName: string) => {
		switch (planName) {
			case "pro":
				return <Crown className="h-5 w-5 text-amber-500" />;
			case "enterprise":
				return <Sparkles className="h-5 w-5 text-purple-500" />;
			default:
				return null;
		}
	};

	const getPlanColor = (planName: string) => {
		switch (planName) {
			case "pro":
				return "bg-gradient-to-r from-amber-500 to-orange-500";
			case "enterprise":
				return "bg-gradient-to-r from-purple-500 to-pink-500";
			default:
				return "bg-gray-500";
		}
	};

	const isPro = (planName: string) => planName === "pro";
	const isEnterprise = (planName: string) => planName === "enterprise";

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-2xl">
						<Crown className="h-6 w-6 text-amber-500" />
						Upgrade to Pro
					</DialogTitle>
					<DialogDescription>
						Choose the perfect plan for your needs and unlock premium features
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6 py-6 md:grid-cols-3">
					{mockPlans.map((plan) => (
						<Card
							key={plan.id}
							className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
								isPro(plan.name)
									? "border-amber-200 shadow-amber-100"
									: isEnterprise(plan.name)
										? "border-purple-200 shadow-purple-100"
										: "border-gray-200"
							}`}
						>
							{isPro(plan.name) && (
								<div className="absolute top-0 right-0">
									<Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-none rounded-bl-lg">
										Most Popular
									</Badge>
								</div>
							)}

							<CardHeader className="pb-4">
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2 capitalize">
										{getPlanIcon(plan.name)}
										{plan.name}
									</CardTitle>
								</div>
								<CardDescription>{plan.description}</CardDescription>

								<div className="flex items-end gap-1 mt-4">
									<span className="text-3xl font-bold">${plan.price}</span>
									<span className="text-muted-foreground mb-1">
										/{plan.currency.toLowerCase()}
									</span>
									{plan.name !== "free" && (
										<span className="text-sm text-muted-foreground mb-1">
											per month
										</span>
									)}
								</div>
							</CardHeader>

							<CardContent>
								<ul className="space-y-3 mb-6">
									{plan.features.map((feature, index) => (
										<li key={index} className="flex items-start gap-2">
											<Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
											<span className="text-sm">{feature}</span>
										</li>
									))}
								</ul>

								<Button
									onClick={() => handleUpgrade(plan.id)}
									disabled={loading || plan.name === "free"}
									className={`w-full ${
										isPro(plan.name)
											? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
											: isEnterprise(plan.name)
												? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
												: ""
									}`}
									variant={plan.name === "free" ? "outline" : "default"}
								>
									{loading
										? "Loading..."
										: plan.name === "free"
											? "Current Plan"
											: `Upgrade to ${plan.name}`}
								</Button>
							</CardContent>
						</Card>
					))}
				</div>

				<div className="border-t pt-6">
					<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
						<span>🔒 Secure payment powered by Stripe</span>
						<span>•</span>
						<span>Cancel anytime</span>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
