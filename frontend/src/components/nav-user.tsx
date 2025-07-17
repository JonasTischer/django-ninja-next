"use client";

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useLogout } from "@/tanstack/features/auth/mutations";

export function NavUser({
	user,
}: {
	user: {
		first_name: string;
		last_name: string;
		email: string;
	};
}) {
	const avatar_url = "https://github.com/shadcn.png";
	const account_type = "Premium Account";
	const { isMobile } = useSidebar();
	const userInitials =
		`${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase();

	const logout = useLogout();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							<div className="rounded-lg bg-accent/50 flex items-center gap-3">
								<Avatar className="h-10 w-10 border">
									{/* Add actual image source if available */}
									<AvatarImage
										src={avatar_url}
										alt={user?.first_name ?? "User"}
									/>
									<AvatarFallback className="bg-gradient-to-br from-medical-teal to-medical-blue text-white font-medium">
										{userInitials || "???"} {/* Fallback initials */}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="text-sm font-semibold text-foreground">
										{user?.first_name && user?.last_name
											? `${user.first_name} ${user.last_name}`
											: "Loading..."}{" "}
									</p>
									<p className="text-xs text-muted-foreground">
										{account_type || "Premium Account"}{" "}
										{/* Example dynamic field */}
									</p>
								</div>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-10 w-10 border">
									{/* Add actual image source if available */}
									<AvatarImage
										src={avatar_url}
										alt={user?.first_name ?? "User"}
									/>
									<AvatarFallback className="bg-gradient-to-br from-medical-teal to-medical-blue text-white font-medium">
										{userInitials || "???"} {/* Fallback initials */}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{user.first_name} {user.last_name}
									</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Sparkles />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<BadgeCheck />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
								<CreditCard />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Bell />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />

						<DropdownMenuItem onClick={() => logout.mutate({})}>
							<LogOut />
							Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
