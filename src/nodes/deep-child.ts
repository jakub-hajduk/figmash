import type { Node } from '@figma/rest-api-spec';
import { hasChildren } from './type-guards/has-children';

/**
 * Returns deep child node using indexes of each another node.
 *
 * @example
 * ```typescript
 * const deepText = deepChild(node, 0, 1, 0, 4)
 * // equals to node.children[0].children[1].children[0].children[4]
 * ```
 */
export function deepChild(node: Node, ...indexes: number[]): Node {
	return indexes.reduce((acc, index) => {
		if (!hasChildren(acc)) throw Error(`Node ${acc.name} has no children!`);
		return acc.children[index];
	}, node);
}
