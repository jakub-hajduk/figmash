import type { Node } from '@figma/rest-api-spec';
import { walk } from './walk';

export function flatten(
	node: Node,
	level: number = Number.POSITIVE_INFINITY,
): Node[] {
	const out: Node[] = [];

	walk(node, (node, path) => {
		if (path.length <= level) {
			out.push(node);
		}
	});

	return out;
}
