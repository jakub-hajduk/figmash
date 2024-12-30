import type { ComponentSetNode, Node } from '@figma/rest-api-spec';

export const isComponentSetNode = (node: Node): node is ComponentSetNode =>
	node.type === 'COMPONENT_SET';
