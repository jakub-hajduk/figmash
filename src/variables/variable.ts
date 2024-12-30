import type { LocalVariable, RGBA, VariableAlias } from '@figma/rest-api-spec';
import type { FigmaLocalVariableCollection } from './variable-collection';

export const isVariableAlias = (value: unknown): value is VariableAlias =>
	!!value &&
	typeof value === 'object' &&
	'type' in value &&
	value.type === 'VARIABLE_ALIAS';

export class FigmaLocalVariable {
	constructor(
		public raw: LocalVariable,
		public collection: FigmaLocalVariableCollection,
	) {}

	/**
	 * Determines if a specific mode has a defined value for this variable.
	 */
	hasValueForMode(name: string) {
		return !!this.valueByMode(name);
	}

	/**
	 * Retrieves the value of the variable for a specified mode. If no mode is specified, it returns the default value.
	 */
	valueByMode(modeName?: string) {
		if (!modeName) return this.defaultValue();

		const modeId = this.collection.getModeId(modeName);

		if (!modeId) return this.defaultValue();

		return this.raw.valuesByMode[modeId];
	}

	/**
	 * Gets the default value of the variable, which is the value for the collection's default mode.
	 */
	defaultValue() {
		return this.raw.valuesByMode[this.collection.raw.defaultModeId];
	}

	/**
	 * Resolves the final value of an alias for a given mode, recursively resolving nested aliases if necessary.
	 */
	resolveAliasValueForMode(
		alias: VariableAlias,
		name: string,
	): string | number | boolean | RGBA {
		const aliassedVariable = this.collection.setRef.getVariableById(alias.id);

		const value = aliassedVariable.valueByMode(name);

		if (!isVariableAlias(value)) return value;

		return aliassedVariable.resolveAliasValueForMode(
			value as VariableAlias,
			name,
		);
	}

	/**
	 * Resolves the value of the variable for a given mode, taking into account potential aliases.
	 */
	resolveValue(name: string): string | number | boolean | RGBA {
		const value = this.valueByMode(name);

		if (isVariableAlias(value))
			return this.resolveAliasValueForMode(value, name);

		return value;
	}

	/**
	 * Retrieves the value of the variable for a specified mode, formatting it as a reference string if it's an alias.
	 */
	value(name: string): string | number | boolean | RGBA {
		const value = this.valueByMode(name);

		if (isVariableAlias(value)) {
			const aliasedVariable = this.collection.setRef.getVariableById(value.id);

			return `{${aliasedVariable.raw.name.replaceAll('/', '.')}}`;
		}

		return value;
	}
}
