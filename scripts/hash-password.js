#!/usr/bin/env node
/**
 * Utility script to generate bcrypt password hash
 * Usage: node scripts/hash-password.js <password>
 */

import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
	console.error('Usage: node scripts/hash-password.js <password>');
	process.exit(1);
}

const hash = await bcrypt.hash(password, 10);

console.log('\nPassword hash generated successfully!');
console.log('\nAdd this to your .env file (note the single quotes):');
console.log(`ADMIN_PASSWORD_HASH='${hash}'`);
console.log('\nOr set it as an environment variable in your deployment platform.\n');
