const SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID as string;
const ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN as string;
const ENVIRONMENT = (import.meta.env.VITE_CONTENTFUL_ENVIRONMENT as string) || 'master';

const BASE = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

console.log('[Contentful] Init — SPACE_ID:', SPACE_ID || '⚠️ MISSING', '| ACCESS_TOKEN:', ACCESS_TOKEN ? '✓ set' : '⚠️ MISSING');

async function contentfulFetch(path: string) {
  const url = `${BASE}${path}&access_token=${ACCESS_TOKEN}`;
  console.log('[Contentful] Fetching:', `${BASE}${path}&access_token=***`);
  const res = await fetch(url);
  console.log('[Contentful] Response status:', res.status, res.statusText);
  if (!res.ok) {
    const body = await res.text();
    console.error('[Contentful] Error body:', body);
    throw new Error(`Contentful error: ${res.status} — ${body}`);
  }
  const data = await res.json();
  console.log('[Contentful] Raw response:', JSON.stringify(data, null, 2));
  return data;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImageUrl: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any | null; // Contentful rich text Document
}

// Resolve an asset URL from the includes array
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveAssetUrl(assetLink: any, includes: any): string | null {
  const id = assetLink?.sys?.id;
  if (!id || !includes?.Asset) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const asset = includes.Asset.find((a: any) => a.sys.id === id);
  const url = asset?.fields?.file?.url;
  return url ? (url.startsWith('//') ? `https:${url}` : url) : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEntry(entry: any, includes: any): BlogPost {
  const f = entry.fields;
  console.log('[Contentful] Entry fields:', JSON.stringify(f, null, 2));

  // Support both old field names (title/body/coverImage/slug) and new ones
  // (heading/content/blogPreview) based on the "Blog Post for Gspec" content model
  const title = f.title ?? f.heading ?? '';
  const body = f.body ?? f.content ?? null;
  const coverImageLink = f.coverImage ?? f.blogPreview ?? null;

  // Derive slug: prefer explicit slug field, fall back to entry ID, then heading as slug
  const slug = f.slug
    ?? entry.sys?.id
    ?? String(title).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return {
    slug,
    title,
    excerpt: f.excerpt ?? f.description ?? '',
    date: f.date ?? f.publishedDate ?? entry.sys?.createdAt ?? '',
    coverImageUrl: coverImageLink ? resolveAssetUrl(coverImageLink, includes) : null,
    body,
  };
}

const BLOG_CONTENT_TYPE = 'blogPostForGspec';

export async function getBlogPosts(): Promise<BlogPost[]> {
  console.log('[Contentful] getBlogPosts() called, content_type:', BLOG_CONTENT_TYPE);
  const data = await contentfulFetch(
    `/entries?content_type=${BLOG_CONTENT_TYPE}&include=2`
  );
  console.log('[Contentful] Total items found:', data.total, '| items in page:', data.items?.length ?? 0);
  if (!data.items?.length) {
    console.warn('[Contentful] No items returned. Check content_type ID and that entries are published.');
  }
  const includes = data.includes ?? {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.items ?? []).map((e: any) => mapEntry(e, includes));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log('[Contentful] getBlogPostBySlug() called, slug:', slug);

  // No slug field in this content model — the URL "slug" is the entry sys.id
  const data = await contentfulFetch(
    `/entries?content_type=${BLOG_CONTENT_TYPE}&sys.id=${encodeURIComponent(slug)}&include=2&limit=1`
  );
  if (data.items?.length) {
    console.log('[Contentful] Found entry by sys.id');
    return mapEntry(data.items[0], data.includes ?? {});
  }

  console.warn('[Contentful] No entry found for id:', slug);
  return null;
}
