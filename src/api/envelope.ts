/**
 * Response envelope helpers shared by every API repository.
 *
 * Accepts both `{ ...payload }` and `{ data: payload }` (and
 * `{ success, data }`) response styles, so the mappers don't care which one
 * the backend settles on.
 */
export const unwrap = <T>(body: any): T =>
  (body && typeof body === 'object' && 'data' in body ? body.data : body) as T;

/** Lists may come back bare or paginated as `{ items: [...] }` / `{ results: [...] }`. */
export const unwrapList = <T>(body: any): T[] => {
  const payload = unwrap<any>(body);
  if (Array.isArray(payload)) return payload;
  return payload?.items ?? payload?.results ?? [];
};

/** Normalises `id` / `_id` (string or number) to a string. */
export const idOf = (dto: { id?: string | number; _id?: string | number }) =>
  String(dto.id ?? dto._id ?? '');
