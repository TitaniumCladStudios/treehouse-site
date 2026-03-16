#!/usr/bin/env node
/**
 * Utility script to generate a base64-encoded bcrypt password hash.
 * Base64 encoding avoids shell escaping issues with bcrypt's $ characters.
 * Usage: node scripts/hash-password.js <password>
 */

import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
	console.error('Usage: node scripts/hash-password.js <password>');
	process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
const base64Hash = Buffer.from(hash).toString('base64');

// Verify the hash works before outputting
const decoded = Buffer.from(base64Hash, 'base64').toString('utf-8');
const valid = await bcrypt.compare(password, decoded);

if (!valid) {
	console.error('ERROR: Hash verification failed. Please try again.');
	process.exit(1);
}

console.log('\nPassword hash generated and verified!');
console.log('\nAdd this to your .env file:');
console.log(`ADMIN_PASSWORD_HASH=${base64Hash}`);
console.log('\nNo quotes or escaping needed — safe for .env files and Netlify.\n');
