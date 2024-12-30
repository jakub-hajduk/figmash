import type { Node } from '@figma/rest-api-spec';
import { hasChildren } from './type-guards/has-children';

export function walk(
	root: Node,
	callback: (node: Node, path: Node[], index: number) => void,
) {
	function walker(node: Node, path: Node[] = [], index = 0) {
		if (!node) return;

		callback(node, [...path, node], index);

		if (hasChildren(node)) {
			node.children.forEach((childNode: Node, childIndex: number) => {
				walker(childNode, [...path, node], childIndex);
			});
		}
	}

	walker(root);
}
