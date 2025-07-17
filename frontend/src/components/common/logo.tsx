import Image from "next/image";
import type React from "react";

import AppLogo from "@/public/logo.svg";

interface LogoProps {
	width?: number;
	height?: number;
}

const Logo: React.FC<LogoProps> = ({ width = 50, height = 50 }) => {
	return <Image src={AppLogo} alt="App Logo" width={width} height={height} />;
};

export default Logo;
