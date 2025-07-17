import Link from "next/link";

import { Button } from "@/components/layout/Button";
import Logo from "@/components/common/logo";
import { SlimLayout } from "@/components/layout/SlimLayout";

export default function NotFound() {
	return (
		<SlimLayout>
			<div className="flex">
				<Link href="/" aria-label="Home">
					<Logo width={10} />
				</Link>
			</div>
			<p className="mt-20 text-sm font-medium text-gray-700">404</p>
			<h1 className="mt-3 text-lg font-semibold text-gray-900">
				Page not found
			</h1>
			<p className="mt-3 text-sm text-gray-700">
				Sorry, we couldn’t find the page you’re looking for.
			</p>
			<Button href="/" className="mt-10">
				Go back home
			</Button>
		</SlimLayout>
	);
}
