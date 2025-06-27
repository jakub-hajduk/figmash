export const isObject = (value: unknown): value is object =>
	!!value && value.constructor.name === 'Object';
