import type {
	LocalVariable,
	LocalVariableCollection,
} from '@figma/rest-api-spec';
import { FigmashError } from '../shared/error.util';
import { FigmaLocalVariableCollection } from './variable-collection';

export class VariablesStore {
	length = 0;
	[i: number]: FigmaLocalVariableCollection;

	constructor(
		variables: Record<string, LocalVariable>,
		collections: Record<string, LocalVariableCollection>,
	) {
		if (!collections) return;
		let length = 0;

		Object.values(collections).map((collection, index) => {
			const collectionInstance = new FigmaLocalVariableCollection(
				collection,
				this,
			);

			for (const id of collection.variableIds) {
				collectionInstance.push(variables[id]);
			}

			this[index] = collectionInstance;
			length++;
		});

		this.length = length;
	}

	/**
	 * Retrieves a collection by its name.
	 */
	getCollectionByName(name: string) {
		return this.findCollection((collection) => collection.raw.name === name);
	}

	/**
	 * Retrieves a variable by its ID from any collection within the set.
	 * Throws an error if no variable with the given ID is found.
	 */
	getVariableById(id: string) {
		for (let i = 0; i <= this.length - 1; i++) {
			const variable = this[i].find((variable) => variable.raw.id === id);
			if (variable) return variable;
		}

		throw new FigmashError(`Couldn't find variable with id: ${id}`);
	}

	/**
	 * Finds the first collection in the set that satisfies the provided testing function.
	 */
	findCollection(
		predicate: (
			item: FigmaLocalVariableCollection,
			index: number,
			collection: VariablesStore,
		) => boolean,
	): FigmaLocalVariableCollection | undefined {
		for (let i = 0; i <= this.length - 1; i++) {
			if (predicate(this[i], i, this)) {
				return this[i];
			}
		}
		return;
	}

	/**
	 * Creates a new array with all collections that pass the test implemented by the provided function.
	 */
	filterCollections(
		predicate: (
			item: FigmaLocalVariableCollection,
			index: number,
			collection: typeof this,
		) => boolean,
	): FigmaLocalVariableCollection[] {
		const out: FigmaLocalVariableCollection[] = [];

		for (let i = 0; i <= this.length - 1; i++) {
			if (predicate(this[i], i, this)) {
				out.push(this[i]);
			}
		}

		return out;
	}

	/**
	 * Creates an array of results by calling a provided function on every collection in the set.
	 */
	map<T>(
		callback: (
			item: FigmaLocalVariableCollection,
			index: number,
			collection: VariablesStore,
		) => T,
	): T[] {
		const out: T[] = [];

		for (let i = 0; i <= this.length - 1; i++) {
			out.push(callback(this[i], i, this));
		}

		return out;
	}

	/**
	 * Retrieves the collection at a specified index, supporting positive and negative indexing.
	 * Throws an error if the index is out of bounds.
	 */
	collectionAt(index: number) {
		if (index > 0 && index > this.length - 1)
			throw new FigmashError(
				`Maximum index for this collection is ${this.length - 1}`,
			);
		if (index < 0 && index < -this.length)
			throw new FigmashError(
				`Minimum index for this collection is ${-this.length}`,
			);

		if (index < 0) {
			return this[this.length + index];
		}

		return this[index];
	}

	/**
	 * Executes a provided function once for each collection in the set.
	 */
	forEachCollection(
		callback: (
			item: FigmaLocalVariableCollection,
			index: number,
			collection: typeof this,
		) => void,
	): void {
		for (let i = 0; i <= this.length - 1; i++) {
			callback(this[i], i, this);
		}
	}

	*[Symbol.iterator]() {
		for (let i = 0; i <= this.length - 1; i++) {
			yield this[i];
		}
	}
}
