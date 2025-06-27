import type { BooleanOperationNode, Node } from '@figma/rest-api-spec';

export const isBooleanOperationNode = (
	node: Node,
): node is BooleanOperationNode => node.type === 'BOOLEAN_OPERATION';
