import { Octokit } from '@octokit/rest';
import type { RestEndpointMethodTypes } from '@octokit/rest';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH?.trim() || 'main';

let cachedOctokit: Octokit | null = null;

function getOctokit(): Octokit {
	if (!cachedOctokit) {
		if (!GITHUB_TOKEN) {
			throw new Error('GitHub token is not configured. Set GITHUB_TOKEN to enable git integration.');
		}

		cachedOctokit = new Octokit({
			auth: GITHUB_TOKEN
		});
	}

	return cachedOctokit;
}

function getRepoDetails(): { owner: string; repo: string } {
	if (!GITHUB_REPO) {
		throw new Error('GitHub repository is not configured. Set GITHUB_REPO to enable git integration.');
	}

	const [owner, repo] = GITHUB_REPO.split('/');

	if (!owner || !repo) {
		throw new Error(
			`Invalid GITHUB_REPO value "${GITHUB_REPO}". Expected format "owner/repository".`
		);
	}

	return { owner, repo };
}

export interface GitAuthor {
	name?: string;
	email?: string;
}

export type GitChange =
	| {
			type: 'upsert';
			path: string;
			content: string | Buffer;
			encoding?: BufferEncoding;
	  }
	| {
			type: 'delete';
			path: string;
	  };

export interface CommitOptions {
	message?: string;
	author?: GitAuthor;
	branch?: string;
}

type CreateTreeParams = RestEndpointMethodTypes['git']['createTree']['parameters'];
type GitTreeItem = CreateTreeParams['tree'][number];
type CreateCommitParams = RestEndpointMethodTypes['git']['createCommit']['parameters'];

function normaliseGitPath(path: string): string {
	return path.replace(/\\/g, '/').replace(/^\.?\//, '');
}

function toBase64(content: string | Buffer, encoding: BufferEncoding = 'utf-8'): string {
	if (Buffer.isBuffer(content)) {
		return content.toString('base64');
	}

	return Buffer.from(content, encoding).toString('base64');
}

export function isGitIntegrationEnabled(): boolean {
	return Boolean(GITHUB_TOKEN && GITHUB_REPO);
}

export function buildGitAuthor(name?: string, email?: string): GitAuthor | undefined {
	if (!name?.trim() || !email?.trim()) {
		return undefined;
	}

	return {
		name: name.trim(),
		email: email.trim()
	};
}

export async function commitChanges(changes: GitChange[], options: CommitOptions = {}): Promise<void> {
	if (!isGitIntegrationEnabled()) {
		return;
	}

	if (!changes.length) {
		return;
	}

	const octokit = getOctokit();
	const { owner, repo } = getRepoDetails();
	const branch = options.branch?.trim() || GITHUB_BRANCH;

	const ref = await octokit.git.getRef({
		owner,
		repo,
		ref: `heads/${branch}`
	});

	const latestCommitSha = ref.data.object.sha;

	const baseCommit = await octokit.git.getCommit({
		owner,
		repo,
		commit_sha: latestCommitSha
	});

	const baseTreeSha = baseCommit.data.tree.sha;

	const tree: GitTreeItem[] = [];

	for (const change of changes) {
		const path = normaliseGitPath(change.path);

		if (change.type === 'delete') {
			tree.push({
				path,
				mode: '100644',
				type: 'blob',
				sha: null
			});
			continue;
		}

		const blob = await octokit.git.createBlob({
			owner,
			repo,
			content: toBase64(change.content, change.encoding),
			encoding: 'base64'
		});

		tree.push({
			path,
			mode: '100644',
			type: 'blob',
			sha: blob.data.sha
		});
	}

	if (!tree.length) {
		return;
	}

	const newTree = await octokit.git.createTree({
		owner,
		repo,
		base_tree: baseTreeSha,
		tree
	});

	const commitPayload: CreateCommitParams = {
		owner,
		repo,
		message: (options.message && options.message.trim()) || 'Update content via CMS',
		tree: newTree.data.sha,
		parents: [latestCommitSha]
	};

	if (options.author?.name && options.author?.email) {
		commitPayload.author = {
			name: options.author.name,
			email: options.author.email
		};
	}

	const commit = await octokit.git.createCommit(commitPayload);

	await octokit.git.updateRef({
		owner,
		repo,
		ref: `heads/${branch}`,
		sha: commit.data.sha
	});
}

export interface CommitInfo {
	sha: string;
	message: string;
	author: {
		name: string;
		email: string;
		date: string;
	};
	url: string;
}

export interface CommitStats {
	total: number;
	recent: CommitInfo[];
}

export async function getCommitStats(limit: number = 10): Promise<CommitStats> {
	if (!isGitIntegrationEnabled()) {
		return {
			total: 0,
			recent: []
		};
	}

	const octokit = getOctokit();
	const { owner, repo } = getRepoDetails();
	const branch = GITHUB_BRANCH;

	try {
		// Get commits from the branch
		const { data: commits } = await octokit.repos.listCommits({
			owner,
			repo,
			sha: branch,
			per_page: limit
		});

		const recent: CommitInfo[] = commits.map((commit) => ({
			sha: commit.sha,
			message: commit.commit.message,
			author: {
				name: commit.commit.author?.name || 'Unknown',
				email: commit.commit.author?.email || '',
				date: commit.commit.author?.date || new Date().toISOString()
			},
			url: commit.html_url
		}));

		// Try to get a more accurate total count by fetching all commits with pagination
		let totalCount = commits.length;

		// If we got the full limit, there might be more commits
		if (commits.length === limit) {
			try {
				// Get just the first page with per_page=1 to check headers
				const { headers } = await octokit.repos.listCommits({
					owner,
					repo,
					sha: branch,
					per_page: 1
				});

				// GitHub provides link header with pagination info, but for simplicity
				// we'll just use a large per_page to get an approximate count
				const { data: allCommits } = await octokit.repos.listCommits({
					owner,
					repo,
					sha: branch,
					per_page: 100 // Max allowed by GitHub
				});

				totalCount = allCommits.length;
			} catch (countError) {
				// If we can't get the total, just use what we have
				console.log('Could not fetch total commit count, using fetched count');
			}
		}

		return {
			total: totalCount,
			recent
		};
	} catch (error) {
		console.error('Error fetching commit stats:', error);
		return {
			total: 0,
			recent: []
		};
	}
}
