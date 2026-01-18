import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import https from 'https';

const UPLOADS_DIR = './static/uploads';
const MANIFEST_PATH = './content/media-manifest.json';

// All unique images from the React site
const images = [
	{
		url: 'https://images.unsplash.com/photo-1759954644836-a57275881ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		name: 'hero_outdoor_ceremony',
		alt: 'Outdoor Ceremony Space'
	},
	{
		url: 'https://images.unsplash.com/photo-1761110787206-2cc164e4913c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		name: 'hero_reception_hall',
		alt: 'Elegant Reception Hall'
	},
	{
		url: 'https://images.unsplash.com/photo-1759519238029-689e99c6d19e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		name: 'hero_ballroom',
		alt: 'Interior Ballroom'
	},
	{
		url: 'https://images.unsplash.com/photo-1634507554990-2043ccc61e61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		name: 'hero_garden',
		alt: 'Garden Venue'
	},
	{
		url: 'https://images.unsplash.com/photo-1763553113332-800519753e40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		name: 'venue_grand_ballroom',
		alt: 'Luxury wedding reception tables'
	},
	{
		url: 'https://images.unsplash.com/photo-1762216444731-802dcf3da009?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		name: 'venue_garden_ceremony',
		alt: 'Wedding ceremony outdoor garden'
	},
	{
		url: 'https://images.unsplash.com/photo-1625755568824-c27ef71d62a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		name: 'venue_architecture',
		alt: 'Romantic wedding venue architecture'
	},
	{
		url: 'https://images.unsplash.com/photo-1760933992847-8289f7181f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		name: 'experience_bride',
		alt: 'Elegant bride outdoor nature'
	},
	{
		url: 'https://images.unsplash.com/photo-1760972594010-e217e2f2845c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		name: 'gallery_outdoor',
		alt: 'Elegant wedding venue outdoor'
	},
	{
		url: 'https://images.unsplash.com/photo-1600879227354-f2809c06f145?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		name: 'gallery_celebration',
		alt: 'Wedding celebration dancing'
	}
];

function downloadImage(url) {
	return new Promise((resolve, reject) => {
		https.get(url, (response) => {
			if (response.statusCode === 301 || response.statusCode === 302) {
				// Follow redirect
				downloadImage(response.headers.location).then(resolve).catch(reject);
				return;
			}

			const chunks = [];
			response.on('data', (chunk) => chunks.push(chunk));
			response.on('end', () => resolve(Buffer.concat(chunks)));
			response.on('error', reject);
		}).on('error', reject);
	});
}

async function processImage(imageData, name) {
	const timestamp = Date.now();
	const filename = `${timestamp}_${name}.webp`;
	const filepath = path.join(UPLOADS_DIR, filename);

	const webpBuffer = await sharp(imageData)
		.webp({ quality: 85, effort: 6 })
		.toBuffer();

	fs.writeFileSync(filepath, webpBuffer);

	const stats = fs.statSync(filepath);

	return {
		filename,
		url: `/uploads/${filename}`,
		size: stats.size,
		createdAt: new Date().toISOString()
	};
}

async function main() {
	// Read existing manifest
	const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

	console.log(`Downloading ${images.length} images...`);

	for (const image of images) {
		try {
			console.log(`  Downloading: ${image.name}...`);
			const imageData = await downloadImage(image.url);

			console.log(`  Converting to WebP...`);
			const fileInfo = await processImage(imageData, image.name);

			manifest.files.push(fileInfo);
			console.log(`  Saved: ${fileInfo.filename} (${Math.round(fileInfo.size / 1024)}KB)`);
		} catch (error) {
			console.error(`  Error processing ${image.name}:`, error.message);
		}

		// Small delay to be nice to Unsplash
		await new Promise(r => setTimeout(r, 500));
	}

	// Save updated manifest
	fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
	console.log('\nManifest updated successfully!');

	// Output the mapping for reference
	console.log('\nImage mapping for CMS content:');
	manifest.files.slice(-images.length).forEach((file, i) => {
		console.log(`  ${images[i].name}: ${file.url}`);
	});
}

main().catch(console.error);
