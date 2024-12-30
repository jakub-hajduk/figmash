import type {
	BooleanOperationNode,
	CanvasNode,
	ComponentNode,
	ComponentSetNode,
	DocumentNode,
	FrameNode,
	GroupNode,
	InstanceNode,
	Node,
	SectionNode,
	WidgetNode,
} from '@figma/rest-api-spec';

type NodeWithChildren =
	| BooleanOperationNode
	| ComponentNode
	| ComponentSetNode
	| FrameNode
	| GroupNode
	| InstanceNode
	| SectionNode
	| WidgetNode
	| DocumentNode
	| CanvasNode;

export function hasChildren(node: Node): node is NodeWithChildren {
	return 'children' in node && Array.isArray(node.children);
}
