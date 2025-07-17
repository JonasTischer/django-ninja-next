"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "./theme-toggle";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export function SiteHeader() {
	const pathname = usePathname();
	const router = useRouter();
	const segments = pathname.split("/").filter(Boolean);

	return (
		<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						{segments.length > 0 &&
							segments.map((segment, index) => {
								const isLast = index === segments.length - 1;
								const href = `/${segments.slice(0, index + 1).join("/")}`;
								const uniqueKey = segments.slice(0, index + 1).join("-");

								return (
									<BreadcrumbItem key={uniqueKey}>
										{!isLast ? (
											<>
												<BreadcrumbLink href={href}>
													{segment.charAt(0).toUpperCase() + segment.slice(1)}
												</BreadcrumbLink>
												<BreadcrumbSeparator />
											</>
										) : (
											<BreadcrumbPage>
												{segment.charAt(0).toUpperCase() + segment.slice(1)}
											</BreadcrumbPage>
										)}
									</BreadcrumbItem>
								);
							})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className="flex flex-1 items-center justify-end space-x-4 pr-4">
				<>
					<Link href={siteConfig.links.docs} target="_blank" rel="noreferrer">
						<div
							className={buttonVariants({
								size: "icon",
								variant: "ghost",
							})}
						>
							<Icons.docs className="h-5 w-5" />
							<span className="sr-only">Docs</span>
						</div>
					</Link>
					<ThemeToggle />
				</>
			</div>
		</header>
	);
}
