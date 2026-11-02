import { STORAGE_KEYS } from './keys';
import { webStorage } from './webStorage';

/**
 * Per-account storage helpers, so two students sharing a browser never see
 * each other's data.
 */
export const scopedKey = async (key: string) => {
  try {
    const user = JSON.parse((await webStorage.getItem(STORAGE_KEYS.user)) ?? 'null');
    return `${key}:${user?.id || user?._id || user?.email || 'guest'}`;
  } catch {
    return `${key}:guest`;
  }
};

export const getScoped = async (key: string) => webStorage.getItem(await scopedKey(key));

export const setScoped = async (key: string, value: string) =>
  webStorage.setItem(await scopedKey(key), value);

export const readList = async <T>(key: string): Promise<T[]> => {
  try {
    const raw = await getScoped(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
};

export const writeList = async <T>(key: string, list: T[]) =>
  setScoped(key, JSON.stringify(list));

export const appendToList = async <T>(key: string, item: T) =>
  writeList(key, [...(await readList<T>(key)), item]);

export const newId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
