import type { ConnectorNode, Node } from '@figma/rest-api-spec';

export const isConnectorNode = (node: Node): node is ConnectorNode =>
	node.type === 'CONNECTOR';
