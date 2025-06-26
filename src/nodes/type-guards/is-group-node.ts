import type { GroupNode, Node } from '@figma/rest-api-spec';

export const isGroupNode = (node: Node): node is GroupNode =>
	node.type === 'GROUP';
