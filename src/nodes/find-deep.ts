import type { Node } from '@figma/rest-api-spec';
import { walk } from './walk';

/**
 * Finds the first node deep in the tree that matches the given predicate.
 *
 * @example
 * ```typescript
 * const section = findDeep(document, (node) => node.type === 'FRAME' && node.name === 'docs-section')
 * ```
 */
export function findDeep(
	node: Node,
	predicate: (node: Node, path: Node[], index: number) => boolean,
): Node | undefined {
	let output: Node | undefined = undefined;

	// use walkUntil when implemented.
	walk(node, (node, path, index) => {
		if (predicate(node, path, index) && !output) {
			output = node;
		}
	});

	return output;
}
