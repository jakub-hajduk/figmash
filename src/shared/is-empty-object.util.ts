export const isEmptyObject = (value: unknown): value is Record<string, never> =>
	!!value &&
	value.constructor.name === 'Object' &&
	Object.keys(value).length === 0;
