type TResult<T, E = Error> = { ok: true; data: T } | { ok: false; error: E };
/** Wraps a promise in a try/catch, returning a structured {@link TResult} object.
 *
 * @remarks
 * It is fully scalable. You can extend the returned object with additional fields, e.g.:
 * - `statusCode`
 * - `meta`
 * - `timestamp`
 * - etc.
 *
 * @template T - Type of resolved data
 * @template E - Type of error (defaults to `Error`)
 * @param promise - The promise to execute safely
 * @returns A promise resolving to
 * - `{ ok: true, data }`, or
 * - `{ ok: false, error }`
 *
 * @example
 * ```typescript
 * const result = await tryCatch(fetchData());
 * if (result.ok) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export const tryCatch = async <T, E = Error>(
  promise: Promise<T>,
): Promise<TResult<T, E>> => {
  try {
    return { ok: true, data: await promise };
  } catch (error: unknown) {
    return {
      ok: false,
      error:
        error instanceof Error ? (error as E) : (new Error(String(error)) as E),
    };
  }
};
