import type { ComponentNode, Node } from '@figma/rest-api-spec';

export const isComponentNode = (node: Node): node is ComponentNode =>
	node.type === 'COMPONENT';
