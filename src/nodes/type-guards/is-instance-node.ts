import type { InstanceNode, Node } from '@figma/rest-api-spec';

export const isInstanceNode = (node: Node): node is InstanceNode =>
	node.type === 'INSTANCE';
