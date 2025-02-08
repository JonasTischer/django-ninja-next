export function setAccessToken(token: string) {
  sessionStorage.setItem('accessToken', token);
}

export function getAccessToken(): string | null {
  return sessionStorage.getItem('accessToken');
}

export function clearAccessToken() {
  sessionStorage.removeItem('accessToken');
}
