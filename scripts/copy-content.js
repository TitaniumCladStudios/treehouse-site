import { cpSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const contentSource = join(process.cwd(), 'content');
const buildDest = join(process.cwd(), 'build', 'content');

const uploadsSource = join(process.cwd(), 'static', 'uploads');
const uploadsDest = join(process.cwd(), 'build', 'client', 'uploads');

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

// Copy uploads directory if it exists
if (existsSync(uploadsSource)) {
	console.log('Copying uploads directory to build...');
	if (!existsSync(join(process.cwd(), 'build', 'client'))) {
		mkdirSync(join(process.cwd(), 'build', 'client'), { recursive: true });
	}
	cpSync(uploadsSource, uploadsDest, { recursive: true });
	console.log('Uploads directory copied successfully!');
} else {
	console.log('No uploads directory found (skipping)');
}
