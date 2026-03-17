import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS, type Document } from '@contentful/rich-text-types';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getBlogPostBySlug, type BlogPost } from '@/lib/contentful';

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function estimateReadTime(doc: Document | null): number {
  if (!doc) return 1;
  let text = '';
  const walk = (node: unknown): void => {
    if (!node || typeof node !== 'object') return;
    const n = node as Record<string, unknown>;
    if (n.nodeType === 'text') { text += (n.value as string ?? '') + ' '; return; }
    if (Array.isArray(n.content)) n.content.forEach(walk);
  };
  walk(doc);
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Contentful rich text render options styled to match the sci-fi theme
const richTextOptions = {
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => (
      <strong className="text-white font-semibold">{text}</strong>
    ),
    [MARKS.ITALIC]: (text: React.ReactNode) => (
      <em className="text-[rgba(255,255,255,0.8)] italic">{text}</em>
    ),
    [MARKS.CODE]: (text: React.ReactNode) => (
      <code className="px-1.5 py-0.5 rounded bg-[rgba(59,240,255,0.1)] border border-[rgba(59,240,255,0.2)] text-[#3BF0FF] font-mono text-sm">
        {text}
      </code>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node: unknown, children: React.ReactNode) => (
      <p className="text-[rgba(255,255,255,0.72)] leading-relaxed mb-5 text-base">
        {children}
      </p>
    ),
    [BLOCKS.HEADING_1]: (_node: unknown, children: React.ReactNode) => (
      <h1 className="font-['Orbitron',sans-serif] text-3xl font-bold text-white mt-10 mb-4">
        {children}
      </h1>
    ),
    [BLOCKS.HEADING_2]: (_node: unknown, children: React.ReactNode) => (
      <h2 className="font-['Orbitron',sans-serif] text-2xl font-bold text-white mt-8 mb-3">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (_node: unknown, children: React.ReactNode) => (
      <h3 className="font-['Orbitron',sans-serif] text-xl font-bold text-white mt-6 mb-3">
        {children}
      </h3>
    ),
    [BLOCKS.HEADING_4]: (_node: unknown, children: React.ReactNode) => (
      <h4 className="font-['Rajdhani',sans-serif] text-lg font-semibold text-[#3BF0FF] mt-5 mb-2 uppercase tracking-wide">
        {children}
      </h4>
    ),
    [BLOCKS.UL_LIST]: (_node: unknown, children: React.ReactNode) => (
      <ul className="list-none space-y-2 mb-5 pl-4">
        {children}
      </ul>
    ),
    [BLOCKS.OL_LIST]: (_node: unknown, children: React.ReactNode) => (
      <ol className="list-none space-y-2 mb-5 pl-4 counter-reset-[list]">
        {children}
      </ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node: unknown, children: React.ReactNode) => (
      <li className="flex items-start gap-2 text-[rgba(255,255,255,0.7)]">
        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#3BF0FF] flex-shrink-0" />
        <span>{children}</span>
      </li>
    ),
    [BLOCKS.QUOTE]: (_node: unknown, children: React.ReactNode) => (
      <blockquote className="relative pl-5 py-1 my-6 border-l-2 border-[#3BF0FF] text-[rgba(255,255,255,0.6)] italic"
        style={{ background: 'rgba(59,240,255,0.04)' }}>
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => (
      <div className="my-8 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(59,240,255,0.3), transparent)' }} />
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node: unknown) => {
      const n = node as Record<string, unknown>;
      const fields = (n.data as Record<string, unknown>)?.target as Record<string, unknown> | undefined;
      const file = (fields?.fields as Record<string, unknown>)?.file as Record<string, unknown> | undefined;
      const url = file?.url as string | undefined;
      const title = (fields?.fields as Record<string, unknown>)?.title as string | undefined;
      if (!url) return null;
      const src = url.startsWith('//') ? `https:${url}` : url;
      return (
        <figure className="my-8">
          <img src={src} alt={title ?? ''} className="w-full rounded-2xl border border-[rgba(59,240,255,0.1)]" />
          {title && <figcaption className="text-center text-xs text-[rgba(255,255,255,0.35)] mt-2">{title}</figcaption>}
        </figure>
      );
    },
    [INLINES.HYPERLINK]: (node: unknown, children: React.ReactNode) => {
      const n = node as Record<string, unknown>;
      const uri = (n.data as Record<string, unknown>)?.uri as string ?? '#';
      return (
        <a href={uri} target="_blank" rel="noopener noreferrer"
          className="text-[#3BF0FF] underline decoration-[rgba(59,240,255,0.3)] hover:decoration-[#3BF0FF] transition-all">
          {children}
        </a>
      );
    },
  },
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    setError(null);
    getBlogPostBySlug(slug)
      .then((data) => {
        if (!data) { setNotFound(true); return; }
        setPost(data);
      })
      .catch(() => setError('Failed to load this article. Please try again.'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Gspec Technologies`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', post.excerpt || `${post.title} — Gspec Technologies Blog`);
    } else if (notFound) {
      document.title = 'Post Not Found | Gspec Technologies';
    }
  }, [post, notFound]);

  const readTime = post ? estimateReadTime(post.body as Document | null) : 0;

  return (
    <div className="relative min-h-screen bg-sci scanlines noise">
      <div className="grid-bg" />

      <Header />

      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-[rgba(255,255,255,0.5)] hover:text-[#3BF0FF] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-['Rajdhani',sans-serif] text-sm tracking-wide uppercase">Back to Blogs</span>
            </Link>
          </motion.div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <motion.div
                className="w-12 h-12 rounded-full border-2 border-[rgba(59,240,255,0.3)] border-t-[#3BF0FF]"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="font-['Rajdhani',sans-serif] text-[rgba(255,255,255,0.4)] tracking-widest text-sm uppercase">
                Loading article...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="text-[rgba(255,255,255,0.6)] mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-xl bg-[rgba(59,240,255,0.1)] border border-[rgba(59,240,255,0.3)] text-[#3BF0FF] text-sm font-['Orbitron',sans-serif] tracking-wider uppercase hover:bg-[rgba(59,240,255,0.15)] transition-all"
              >
                Retry
              </button>
            </motion.div>
          )}

          {/* 404 */}
          {notFound && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="font-['Orbitron',sans-serif] text-6xl font-bold text-[rgba(59,240,255,0.2)] mb-6">404</div>
              <h2 className="font-['Orbitron',sans-serif] text-2xl text-white mb-4">Article Not Found</h2>
              <p className="text-[rgba(255,255,255,0.5)] mb-8">
                This article doesn't exist or may have been removed.
              </p>
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[rgba(59,240,255,0.1)] border border-[rgba(59,240,255,0.3)] text-[#3BF0FF] text-sm font-['Orbitron',sans-serif] tracking-wider uppercase hover:bg-[rgba(59,240,255,0.15)] transition-all"
              >
                View All Articles
              </Link>
            </motion.div>
          )}

          {/* Post */}
          {!loading && !error && !notFound && post && (
            <article>
              {/* Cover image */}
              {post.coverImageUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-10 rounded-2xl overflow-hidden"
                  style={{ border: '1px solid rgba(59,240,255,0.1)' }}
                >
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full object-cover max-h-[420px]"
                  />
                </motion.div>
              )}

              {/* Meta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap items-center gap-4 mb-6"
              >
                {post.date && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[rgba(59,240,255,0.6)]" />
                    <span className="font-['Rajdhani',sans-serif] text-xs tracking-wider text-[rgba(255,255,255,0.4)] uppercase">
                      {formatDate(post.date)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[rgba(59,240,255,0.6)]" />
                  <span className="font-['Rajdhani',sans-serif] text-xs tracking-wider text-[rgba(255,255,255,0.4)] uppercase">
                    {readTime} min read
                  </span>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="font-['Orbitron',sans-serif] text-3xl sm:text-4xl font-bold text-white leading-tight mb-6"
              >
                {post.title}
              </motion.h1>

              {/* Excerpt */}
              {post.excerpt && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg text-[rgba(255,255,255,0.55)] leading-relaxed mb-8 font-['Space_Grotesk',sans-serif]"
                >
                  {post.excerpt}
                </motion.p>
              )}

              {/* Divider */}
              <div className="mb-10 h-px"
                style={{ background: 'linear-gradient(90deg, rgba(59,240,255,0.4), rgba(75,146,255,0.3), transparent)' }} />

              {/* Body */}
              {post.body && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="prose-sci"
                >
                  {documentToReactComponents(post.body as Document, richTextOptions)}
                </motion.div>
              )}

              {/* Footer */}
              <div className="mt-14 pt-8"
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <Link
                  to="/blogs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all group"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-['Rajdhani',sans-serif] tracking-wide uppercase">All Articles</span>
                </Link>
              </div>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
