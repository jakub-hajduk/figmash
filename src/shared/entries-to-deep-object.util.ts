export const entriesToDeepObject = (
	input: [string, object][],
	separator = '.',
) => {
	const output = {};

	for (const [name, value] of input) {
		const path = name.split(separator);

		path.reduce((acc: Record<string, object>, key: string, i: number) => {
			if (acc[key] === undefined) acc[key] = {};

			if (i === path.length - 1) {
				acc[key] = {
					...acc[key],
					...value,
				};
			}

			return acc[key];
		}, output);
	}

	return output;
};
