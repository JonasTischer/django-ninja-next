import Logo from "@/components/common/logo"; // Assuming you have a Logo component
import { Star } from "lucide-react"; // For testimonial stars
import { SignUpForm } from "@/components/signup-form";
export default function SignUpPage() {
	return (
		<main className="flex min-h-screen items-stretch bg-linear-to-b from-cyan-50/50 to-teal-50/50 dark:from-transparent dark:to-transparent">
			{/* Left Branding Column */}
			<div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-white dark:bg-background">
				{/* Logo */}
				<div className="flex items-center gap-2">
					<Logo width={32} height={32} />
					<div className="flex flex-col">
						<h1 className="text-lg font-semibold tracking-tight medical-text-gradient">
							Django Next Ninja
						</h1>
						<p className="text-xs text-muted-foreground">
							Your Django Next Ninja Starter Kit
						</p>
					</div>
				</div>

				{/* Hero Text */}
				<div className="my-auto max-w-md">
					<h2 className="text-4xl font-bold tracking-tight mb-4">
						Your Django Next Ninja Starter Kit
					</h2>
					<p className="text-lg text-muted-foreground">
						Your Django Next Ninja Starter Kit
					</p>

					{/* Testimonial */}
					<div className="mt-12 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
						<div className="flex mb-3">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className="h-5 w-5 text-yellow-400 fill-yellow-400"
								/>
							))}
						</div>
						<blockquote className="text-sm text-muted-foreground mb-4">
							"Django Next Ninja Starter Kit has revolutionized my workday. I
							now have more time for my patients and less documentation effort.
							The transcriptions are precise and the anamneses are structured."
						</blockquote>
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-medium">
								DM
							</span>
							<div>
								<p className="text-sm font-semibold text-foreground">
									John Doe
								</p>
								<p className="text-xs text-muted-foreground">
									Software Engineer
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Footer or empty div for spacing */}
				<div />
			</div>

			{/* Right Form Column */}
			<div className="flex flex-1 items-center justify-center p-6 lg:p-12 ">
				<SignUpForm />
			</div>
		</main>
	);
}
