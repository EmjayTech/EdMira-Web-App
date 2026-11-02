/** Shared helpers for the mock repositories (local sample data). */

/** Resolves with `value` after a short delay, so loading states are visible. */
export const mockDelay = <T>(value: T, ms = 250) =>
  new Promise<T>(resolve => setTimeout(() => resolve(value), ms));

/** Rejects like the real API would, with `response.data.message` set. */
export const mockApiError = (status: number, message: string) =>
  Object.assign(new Error(message), { response: { status, data: { message } } });
