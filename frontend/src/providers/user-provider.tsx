"use client";

import type { UserSchema } from "@/generated/backend-client/types.gen";
import { createContext, useContext, useState } from "react";

interface UserContextType {
	user: UserSchema;
	updateUser: (newUser: Partial<UserSchema>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
	children,
	initialUser,
}: {
	children: React.ReactNode;
	initialUser: UserSchema;
}) {
	const [user, setUser] = useState<UserSchema>(initialUser);

	const updateUser = (newUser: Partial<UserSchema>) => {
		setUser((prev) => ({ ...prev, ...newUser }));
	};

	return (
		<UserContext.Provider value={{ user, updateUser }}>
			{children}
		</UserContext.Provider>
	);
}

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUserContext must be used within a UserProvider");
	}
	return context;
};
