/**
 * Retrieves an item from the local storage using the provided key.
 *
 * @param {string} key - The key of the item to retrieve from local storage
 * @return {object} The retrieved item, or null if the item does not exist
 */
export const getFromLocalStorage = <T>(key: string): T | null => {
	const item = localStorage.getItem(key);
	return item ? JSON.parse(item) : null;
};

/**
 * Sets the given value in the local storage under the specified key.
 *
 * @param {string} key - The key under which the value will be stored in local storage
 * @param {T} value - The value to be stored in local storage
 * @return {void}
 */
export const setInLocalStorage = <T>(key: string, value: T): void => {
	localStorage.setItem(key, JSON.stringify(value));
};
