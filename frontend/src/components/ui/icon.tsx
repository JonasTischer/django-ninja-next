import { icons } from "lucide-react";

interface IconProps {
	name: keyof typeof icons;
	color?: string;
	size?: number;
	className?: string;
}

export const Icon = ({ name, color, size, className }: IconProps) => {
	const LucideIcon = icons[name];

	if (!LucideIcon) {
		return null;
	}

	return <LucideIcon color={color} size={size} className={className} />;
};
