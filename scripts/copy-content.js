import { cpSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const contentSource = join(process.cwd(), 'content');
const buildDest = join(process.cwd(), 'build', 'content');

console.log('Copying content directory to build...');

if (!existsSync(contentSource)) {
	console.error('Content directory not found!');
	process.exit(1);
}

// Create build directory if it doesn't exist
if (!existsSync(join(process.cwd(), 'build'))) {
	mkdirSync(join(process.cwd(), 'build'), { recursive: true });
}

// Copy content directory
cpSync(contentSource, buildDest, { recursive: true });

console.log('Content directory copied successfully!');
