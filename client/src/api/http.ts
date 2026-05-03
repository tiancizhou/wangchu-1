export async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    headers: options.body instanceof FormData ? undefined : { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '请求失败' }));
    throw new Error(error.message || '请求失败');
  }

  return response.json() as Promise<T>;
}
