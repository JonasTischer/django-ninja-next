import { cn } from "@/lib/utils";
import { ImSpinner3 } from "react-icons/im";

interface Props {
	size?: "sm" | "md" | "lg";
	sm?: boolean;
	md?: boolean;
	lg?: boolean;
	color?: string;
	className?: string;
}

export default function Spinner({
	size,
	sm,
	md,
	lg,
	color = "white",
	className,
}: Props) {
	let finalSize = size || "md";
	if (sm) finalSize = "sm";
	if (md) finalSize = "md";
	if (lg) finalSize = "lg";

	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-6 h-6",
		lg: "w-8 h-8",
	};

	const spinnerClassName = cn(
		"animate-spin",
		sizeClasses[finalSize],
		`text-${color}-300 fill-${color}-300`,
		className,
	);

	return (
		<div>
			<ImSpinner3 className={spinnerClassName} />
			<span className="sr-only">Loading...</span>
		</div>
	);
}
