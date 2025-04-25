const TOKEN_KEY = "access_token";

export function setAccessToken(token: string) {
	localStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
	return localStorage.getItem(TOKEN_KEY);
}

export function clearAccessToken() {
	localStorage.removeItem(TOKEN_KEY);
}
