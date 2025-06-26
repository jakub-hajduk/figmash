import { run } from 'node:test';
import { spec } from 'node:test/reporters';
import { glob } from 'glob';

process.env.NODE_OPTIONS = '--import tsx';

const files = glob.sync('**/*.test.ts', { ignore: 'node_modules/**' });

run({ files, concurrency: true, watch: true })
	.compose(spec)
	.pipe(process.stdout);
