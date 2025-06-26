import type { Node, TypeStyle } from '@figma/rest-api-spec';

export interface TypeStyleTable {
	[p: string]: TypeStyle;
}

// biome-ignore lint: base object can be anything
export interface GetterNode extends Record<string, any> {
	children?: GetterNode[] | false;
}

export type GetterTestFn = (node: Node) => boolean | Promise<boolean>;

export type GetterGetFn = (
	node: Node,
) => GetterNode | Promise<GetterNode> | undefined;

export type Getter = {
	/**
	 * Test function that determines if get method should be executed on current node.
	 * You can use it to perform the getter only on nodes that match certain rules.
	 *
	 *
	 * @example
	 *
	 * @example
	 * ```typescript
	 * const getter: Getter = {
	 *  test: (node) => node.raw.type === 'INSTANCE' && node.raw.name === 'heading 1'
	 *  [...]
	 * }
	 * ```
	 */
	test: GetterTestFn;
	/**
	 * Getter function specifies what kind of data needs to be fetched from node and how to get it. It is executed only if node passed getter's `test` predicate.
	 *
	 *
	 * @example
	 *
	 * @example
	 * ```typescript
	 * const getter: Getter = {
	 *   [...]
	 *   get: (node) => ({
	 *     type: 'table-row'
	 *   })
	 * }
	 *
	 * @example
	 * ```typescript
	 *
	 * If you wish to parse the children on your own, you can return your own `children`, and parser will not overwrite it.
	 *
	 *
	 * @example
	 *
	 * @example
	 * ```typescript
	 * const getter: Getter = {
	 *   [...]
	 *   get: (node) => {
	 *     const listItems: TreeNode[] = getListItems(node)
	 *
	 *     return {
	 *       type: 'unordered-list',
	 *       children: listItems
	 *     }
	 *   }
	 * }
	 *
	 * @example
	 * ```typescript
	 *
	 * If you don't want to provide any children for the TreeNode, return `children: false`. This property will be removed from final tree.
	 *
	 * @example
	 *
	 * @example
	 * ```typescript
	 * const getter: Getter = {
	 *   [...]
	 *   get: (node) => {
	 *     const listItems: TreeNode[] = getListItems(node)
	 *
	 *     return {
	 *       type: 'paragraph',
	 *       data: node.getFormattedContent(),
	 *       children: false
	 *     }
	 *   }
	 * }
	 * ```
	 */
	get: GetterGetFn;
};

export interface ParseTreeOptions {
	/**
	 * Whether omit the nodes that returned an empty object, or not.
	 * Use this option if you want to have clean tree of nodes without additional rubish.
	 * Remember, that when getting the value, the first Getter that passed the test is
	 * taken. Therefore if any of the geters removes something, it needs to be defined
	 * sooner than the rest
	 *
	 * @default true
	 */
	omitEmpty: boolean;
	/**
	 * Whether nodes that's only property is `children` should be skipped, or not.
	 */
	omitFauxNodes: boolean;
}
