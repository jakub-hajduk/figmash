import type { Node, WidgetNode } from '@figma/rest-api-spec';

export const isWidgetNode = (node: Node): node is WidgetNode =>
	node.type === 'WIDGET';
