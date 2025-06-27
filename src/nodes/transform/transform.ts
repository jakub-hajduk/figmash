import type { Node } from '@figma/rest-api-spec';
import { isEmptyObject } from '../../shared/is-empty-object.util';
import { isObject } from '../../shared/is-object.util';
import { hasChildren } from '../type-guards/has-children';
import { isFauxNode } from './is-faux-node';
import type { Getter, GetterNode, ParseTreeOptions } from './types';

const defaultGetters: Getter[] = [
	{
		test: () => true,
		get: () => ({}),
	},
];

export async function transform(
	node: Node,
	options?: Partial<ParseTreeOptions>,
): Promise<GetterNode>;
export async function transform(
	node: Node,
	getters?: Getter[],
): Promise<GetterNode>;
export async function transform(
	node: Node,
	getters?: Getter[],
	options?: Partial<ParseTreeOptions>,
): Promise<GetterNode>;
export async function transform(
	node: Node,
	getters?: Getter[],
	options?: Partial<ParseTreeOptions>,
): Promise<GetterNode>;
export async function transform(
	node: Node,
	gettersOrOptions?: Getter[] | Partial<ParseTreeOptions>,
	userOptions?: Partial<ParseTreeOptions>,
): Promise<GetterNode>;
export async function transform(
	node: Node,
	gettersOrOptions?: Getter[] | Partial<ParseTreeOptions>,
	userOptions: Partial<ParseTreeOptions> = {},
): Promise<GetterNode> {
	const getters = Array.isArray(gettersOrOptions)
		? gettersOrOptions
		: defaultGetters;
	const options = isObject(gettersOrOptions)
		? (gettersOrOptions as ParseTreeOptions)
		: userOptions;

	const parseOptions: ParseTreeOptions = {
		omitEmpty: true,
		omitFauxNodes: true,
		...options,
	};

	const getter = getters.find((getter) => getter.test(node));

	let out = (await Promise.resolve(getter?.get(node))) || {};

	if (out && out.children === false) {
		// biome-ignore lint/performance/noDelete: property needs to be removed entirely, not set to undefined.
		delete out.children;
		return out;
	}

	if (out.children && out.children.length > 0) return out;

	if (hasChildren(node)) {
		out.children = await Promise.all(
			node.children.map(
				async (childNode) => await transform(childNode, getters, options),
			),
		);

		if (parseOptions.omitEmpty) {
			out.children = out.children.filter(
				(node: GetterNode) => !isEmptyObject(node),
			);
		}
	}

	if (parseOptions.omitEmpty && out.children && out.children.length === 0) {
		// biome-ignore lint/performance/noDelete: property needs to be removed entirely, not set to undefined.
		delete out.children;
		const { children, ...rest } = out
		out = rest
	}

	if (isFauxNode(out)) {
		return out.children[0];
	}

	return out;
}
