/**
 * Robust URL query-param utilities for server-driven search/filter/pagination.
 *
 * Handles all PHP-compatible array formats in query strings:
 *  - `key=value`         (single value)
 *  - `key[]=value`       (bracket notation)
 *  - `key[0]=value`      (indexed notation)
 */

/**
 * Parse filter values from URLSearchParams supporting all array notations.
 */
export function parseFilterValues(
    queryParams: URLSearchParams,
    filterKey: string,
): string[] {
    // 1. Bracket notation: key[]=value
    const bracketValues = queryParams.getAll(`${filterKey}[]`);
    if (bracketValues.length > 0) return bracketValues;

    // 2. Indexed notation: key[0]=value, key[1]=value, ...
    const indexedValues: string[] = [];
    for (let i = 0; ; i++) {
        const value = queryParams.get(`${filterKey}[${i}]`);
        if (value === null) break;
        indexedValues.push(value);
    }
    if (indexedValues.length > 0) return indexedValues;

    // 3. Plain key: key=value (treat as single-element array)
    const singleValue = queryParams.get(filterKey);
    if (singleValue) return [singleValue];

    return [];
}

/**
 * Remove every form of a key from URLSearchParams (`key`, `key[]`, `key[0]`…).
 */
function removeAllKeyForms(params: URLSearchParams, key: string): void {
    params.delete(key);
    params.delete(`${key}[]`);

    const indexed = new RegExp(
        `^${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[\\d+\\]$`,
    );
    for (const paramKey of [...params.keys()]) {
        if (indexed.test(paramKey)) {
            params.delete(paramKey);
        }
    }
}

/**
 * Build a new URL by patching query params onto the current search string.
 *
 * - Values of `string[]` are written as `key[]=v1&key[]=v2`.
 * - `null` removes the key entirely (all forms).
 * - The `page` param is always removed (server resets to page 1).
 */
export function buildUrlWithQueryPatch(
    basePath: string,
    currentSearch: string,
    patch: Record<string, string[] | null>,
): string {
    const params = new URLSearchParams(currentSearch);

    for (const [key, values] of Object.entries(patch)) {
        removeAllKeyForms(params, key);

        if (values && values.length > 0) {
            for (const value of values) {
                params.append(`${key}[]`, value);
            }
        }
    }

    // Reset pagination whenever filters change
    params.delete('page');

    const queryString = params.toString();
    return `${basePath}${queryString ? `?${queryString}` : ''}`;
}

export function buildUrlWithRemovedQueryKeys(
    basePath: string,
    currentSearch: string,
    keys: string[],
): string {
    const params = new URLSearchParams(currentSearch);

    for (const key of keys) {
        removeAllKeyForms(params, key);
    }

    params.delete('page');

    const queryString = params.toString();
    return `${basePath}${queryString ? `?${queryString}` : ''}`;
}

export function splitPageUrl(pageUrl: string): {
    basePath: string;
    currentSearch: string;
} {
    const questionIndex = pageUrl.indexOf('?');

    return {
        basePath:
            questionIndex >= 0 ? pageUrl.slice(0, questionIndex) : pageUrl,
        currentSearch:
            questionIndex >= 0 ? pageUrl.slice(questionIndex + 1) : '',
    };
}
