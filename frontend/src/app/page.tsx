import { CallToAction } from "@/components/layout/CallToAction";
import { Faqs } from "@/components/layout/Faqs";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { Pricing } from "@/components/layout/Pricing";
import { PrimaryFeatures } from "@/components/layout/PrimaryFeatures";
import { SecondaryFeatures } from "@/components/layout/SecondaryFeatures";
import { Testimonials } from "@/components/layout/Testimonials";

export default function Home() {
	return (
		<>
			<Header />
			<main>
				<Hero />
				<PrimaryFeatures />
				<SecondaryFeatures />
				<CallToAction />
				<Testimonials />
				<Pricing />
				<Faqs />
			</main>
			<Footer />
		</>
	);
}
