"use client";

import { Check, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { premiumPlans } from "@/constants";
import { cn } from "@/lib/utils";

export const ProModal = () => {
	const [loading, setLoading] = useState(false);

	// const [initiateCheckoutSession] = useInitiateStripeCheckoutSessionMutation();

	const [selectedPlan, setSelectedPlan] = useState(premiumPlans[0]);

	const onCardClick = (plan: (typeof premiumPlans)[number]) => {
		setSelectedPlan(plan);
	};

	const onSubscribe = async () => {
		try {
			setLoading(true);
			if (selectedPlan) {
				// const data = await initiateCheckoutSession({
				//   price_id: 'price_1P7K9SRo3ULNAPp3PDh9mJ6a', // TODO: pass here selectedPlan.price_id API
				// }).unwrap();
				// if (data.url) {
				//   window.location.href = data.url;
				// } else {
				//   toast.error("Failed to initiate Stripe checkout session.");
				// }
			} else {
				toast.error("Please select a plan to upgrade.");
			}
		} catch {
			toast.error("Failed to upgrade.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={true} onOpenChange={() => {}}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
						<div className="flex items-center gap-x-2 font-bold text-xl">
							Upgrade to PraxiBot
							<Badge variant="default" className="uppercase text-sm py-1">
								pro
							</Badge>
						</div>
					</DialogTitle>
					<DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
						{premiumPlans.map((plan) => (
							<Card
								key={plan.href}
								onClick={() => onCardClick(plan)}
								className={cn(
									"p-3 border-black/5 flex items-center justify-between cursor-pointer",
									selectedPlan?.href === plan.href
										? "bg-gray-100 border-primary"
										: "hover:bg-gray-100",
								)}
							>
								<div className="flex items-center gap-x-4">
									<div className={cn("p-2 w-fit rounded-md", plan.bgColor)}>
										<plan.icon className={cn("w-6 h-6", plan.color)} />
									</div>
									<div className="font-semibold text-sm">{plan.name}</div>
									<div className="font-semibold text-sm">
										{plan.price.monthly} / month
									</div>
								</div>
								<Check className="text-primary w-5 h-5" />
							</Card>
						))}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						disabled={loading}
						onClick={onSubscribe}
						size="lg"
						variant="default"
						className="w-full"
					>
						Upgrade
						<Zap className="w-4 h-4 ml-2 fill-white" />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
