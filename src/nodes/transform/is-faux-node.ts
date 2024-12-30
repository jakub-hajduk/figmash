import type { GetterNode } from './types';

export const isFauxNode = (
	node: GetterNode,
): node is GetterNode & { children: [GetterNode] } => {
	return (
		Object.keys(node).length === 1 &&
		'children' in node &&
		Array.isArray(node.children) &&
		node.children?.length === 1
	);
};
