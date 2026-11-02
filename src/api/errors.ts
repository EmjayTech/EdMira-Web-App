import { currentStrings } from '@/localization/LocalizationContext';

/**
 * Error helpers shared by every screen and service. They turn axios / mock
 * errors into text a student can act on, in the active language.
 */

/** The server's own message, if the response carried one. */
export const serverMessage = (error: any): string | undefined => {
  const data = error?.response?.data;
  const message = data?.message ?? data?.error;
  if (Array.isArray(message)) return message.filter(Boolean).join('\n');
  return typeof message === 'string' && message.trim() ? message : undefined;
};

/** Turns any API / network error into a sentence a student can act on. */
export const friendlyError = (error: any): string => {
  const e = currentStrings().errors;
  const status = error?.response?.status;
  if (!error?.response) {
    return error?.code === 'ECONNABORTED'
      ? e.timeout
      : error?.message && !String(error.message).includes('Network')
      ? error.message
      : e.offline;
  }
  if (status === 401) return e.sessionExpired;
  if (status === 403) return e.forbidden;
  if (status === 404) return e.notFound;
  return serverMessage(error) ?? e.server;
};

/**
 * For forms (login, sign-up, codes): the server's message wins — it says
 * what was wrong with the input — then network problems, then `fallback`.
 */
export const formError = (error: any, fallback: string): string => {
  const fromServer = serverMessage(error);
  if (fromServer) return fromServer;
  return error?.response ? fallback : friendlyError(error);
};

/** Network problem or server error → worth retrying. 4xx → don't. */
export const isRetryable = (error: any) => {
  const status = error?.response?.status;
  return status === undefined || status >= 500 || status === 408 || status === 429;
};
