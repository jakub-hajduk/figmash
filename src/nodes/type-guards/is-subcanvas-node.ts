import type { Node, SubcanvasNode } from '@figma/rest-api-spec';

export const isSubcanvasNode = (node: Node): node is SubcanvasNode =>
	node.type === 'BOOLEAN_OPERATION' ||
	node.type === 'COMPONENT' ||
	node.type === 'COMPONENT_SET' ||
	node.type === 'CONNECTOR' ||
	node.type === 'ELLIPSE' ||
	node.type === 'EMBED' ||
	node.type === 'FRAME' ||
	node.type === 'GROUP' ||
	node.type === 'INSTANCE' ||
	node.type === 'LINE' ||
	node.type === 'LINK_UNFURL' ||
	node.type === 'RECTANGLE' ||
	node.type === 'REGULAR_POLYGON' ||
	node.type === 'SECTION' ||
	node.type === 'SHAPE_WITH_TEXT' ||
	node.type === 'SLICE' ||
	node.type === 'STAR' ||
	node.type === 'STICKY' ||
	node.type === 'TABLE' ||
	node.type === 'TABLE_CELL' ||
	node.type === 'TEXT' ||
	node.type === 'VECTOR' ||
	node.type === 'WASHI_TAPE' ||
	node.type === 'WIDGET';
