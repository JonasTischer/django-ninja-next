"use client";

import { useEffect, useState } from "react";

export function ModalProvider() {
	// Prevent hydration errors by mounting modals only after the component has mounted
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return <>{/* Add future modals here */}</>;
}
