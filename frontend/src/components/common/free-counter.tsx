import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const MAX_FREE_COUNTS = 10;
export const FreeCounter = ({
	isPro = false,
	apiLimitCount = 0,
}: {
	isPro: boolean;
	apiLimitCount: number;
}) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	if (isPro) {
		return null;
	}

	return (
		<div className="px-3">
			<Card className="story-card p-4 bg-gray-200 rounded-lg hover:bg-gray-400 transition-colors duration-300 cursor-pointer">
				<CardContent className="py-6">
					<div className="text-center text-sm  mb-4 space-y-2">
						<p>
							{apiLimitCount} / {MAX_FREE_COUNTS} Free Generations
						</p>
						<Progress
							className="h-3"
							value={(apiLimitCount / MAX_FREE_COUNTS) * 100}
						/>
					</div>
					<Button variant="default" className="w-full">
						Upgrade
						<Zap className="w-4 h-4 ml-2 fill-white" />
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};
