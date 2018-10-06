/**
 * Simple utility type that represents an object with all values of the same type.
 */
export type ObjectOf<T> = {
	[key: string]: T
};