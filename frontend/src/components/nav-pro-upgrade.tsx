"use client";

import { Crown, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { ProModal } from "@/components/pro-modal";

export function NavProUpgrade() {
	const { state } = useSidebar();

	// When collapsed, show just the crown icon as a menu button
	if (state === "collapsed") {
		return (
			<SidebarGroup>
				<SidebarMenu>
					<SidebarMenuItem>
						<ProModal>
							<SidebarMenuButton
								tooltip="Upgrade to Pro"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Crown className="h-4 w-4 text-amber-500" />
							</SidebarMenuButton>
						</ProModal>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroup>
		);
	}

	// When expanded, show the full card
	return (
		<SidebarGroup>
			<div className="p-2">
				<Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-sm">
							<Crown className="h-4 w-4 text-amber-500" />
							Upgrade to Pro
						</CardTitle>
						<CardDescription className="text-xs">
							Unlock premium features and boost your productivity
						</CardDescription>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="space-y-2 mb-3">
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<Zap className="h-3 w-3 text-amber-500" />
								<span>Advanced Analytics</span>
							</div>
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<Sparkles className="h-3 w-3 text-amber-500" />
								<span>Priority Support</span>
							</div>
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<Crown className="h-3 w-3 text-amber-500" />
								<span>Custom Integrations</span>
							</div>
						</div>
						<ProModal>
							<Button
								size="sm"
								className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
							>
								<Crown className="h-4 w-4 mr-2" />
								Upgrade Now
							</Button>
						</ProModal>
					</CardContent>
				</Card>
			</div>
		</SidebarGroup>
	);
}
