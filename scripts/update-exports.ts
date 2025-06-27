import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { sync } from 'glob';

const files = sync('src/**/*.ts', {
	ignore: ['**/*.test.ts', '**/*.util.ts', 'scripts/**', '**/index.ts'],
});

const typescriptExports = [];
const exports: Record<string, Export> = {};

interface Export {
	import: {
		default: string;
		types: string;
	};
	require: {
		default: string;
		types: string;
	};
}

exports['.'] = {
	import: {
		default: './dist/index.js',
		types: './dist/index.d.ts',
	},
	require: {
		default: './dist/index.cjs',
		types: './dist/index.d.cts',
	},
};

console.log(`Found ${files.length} files to be exported.`);

for (const file of files) {
	typescriptExports.push(
		`export * from '${file.replace('src/', './').replace('.ts', '')}';`,
	);

	const fileName = basename(file).replace('.ts', '').replace('.', '-');

	exports[`./${fileName}`] = {
		import: {
			default: file.replace('src', './dist').replace('.ts', '.js'),
			types: file.replace('src', './dist').replace('.ts', '.d.ts'),
		},
		require: {
			default: file.replace('src', './dist').replace('.ts', '.cjs'),
			types: file.replace('src', './dist').replace('.ts', '.d.cts'),
		},
	};
}

writeFileSync('./src/index.ts', typescriptExports.join('\n'), 'utf-8');

const originalContents = readFileSync('./package.json', 'utf-8');
const originalJson = JSON.parse(originalContents);
originalJson.exports = exports;

writeFileSync('./package.json', JSON.stringify(originalJson, null, 2), 'utf-8');
