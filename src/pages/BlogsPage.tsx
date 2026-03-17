import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getBlogPosts, type BlogPost } from '@/lib/contentful';

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

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(120,170,255,0.15)',
        transition: 'border-color 0.4s, box-shadow 0.4s',
      }}
    >
      {/* Cover image */}
      {post.coverImageUrl && (
        <div className="relative overflow-hidden h-48">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070A12] via-[rgba(7,10,18,0.3)] to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Date */}
        {post.date && (
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-3.5 h-3.5 text-[rgba(59,240,255,0.6)]" />
            <span className="font-['Rajdhani',sans-serif] text-xs tracking-wider text-[rgba(255,255,255,0.4)] uppercase">
              {formatDate(post.date)}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="font-['Orbitron',sans-serif] text-base font-bold text-white mb-3 leading-snug group-hover:text-[#3BF0FF] transition-colors">
          {post.title}
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-[rgba(255,255,255,0.6)] leading-relaxed mb-5 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Read more */}
        <Link
          to={`/blogs/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[rgba(59,240,255,0.8)] hover:text-[#3BF0FF] transition-colors"
        >
          <span className="font-['Rajdhani',sans-serif] tracking-wide uppercase text-xs">Read Article</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(59,240,255,0.25), 0 0 30px rgba(59,240,255,0.08)' }}
      />
    </motion.article>
  );
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Blogs | Gspec Technologies';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Insights, updates and deep-dives from the Gspec Technologies team on AI, technology and innovation.');
  }, []);

  useEffect(() => {
    getBlogPosts()
      .then(setPosts)
      .catch(() => setError('Failed to load posts. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen bg-sci scanlines noise">
      <div className="grid-bg" />

      <Header />

      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(59,240,255,0.08)', border: '1px solid rgba(59,240,255,0.2)' }}>
              <BookOpen className="w-3.5 h-3.5 text-[#3BF0FF]" />
              <span className="font-['Rajdhani',sans-serif] text-xs tracking-widest text-[rgba(255,255,255,0.6)] uppercase">
                Knowledge Hub
              </span>
            </div>

            <h1 className="font-['Orbitron',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="block">Our</span>
              <span className="bg-gradient-to-r from-[#3BF0FF] via-[#4B92FF] to-[#B829F7] bg-clip-text text-transparent">
                Insights &amp; Blog
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-[rgba(255,255,255,0.6)] leading-relaxed">
              Deep-dives into AI, technology and innovation from 
              
            </p>
            <p className="max-w-2xl mx-auto text-lg text-[rgba(255,255,255,0.6)] leading-relaxed">
             the Gspec Tech team.
              
            </p>
            {/* Decorative line */}
            <div className="mt-10 h-px max-w-sm mx-auto"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(59,240,255,0.4), transparent)' }} />
          </motion.div>

          {/* Content */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <motion.div
                className="w-12 h-12 rounded-full border-2 border-[rgba(59,240,255,0.3)] border-t-[#3BF0FF]"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="font-['Rajdhani',sans-serif] text-[rgba(255,255,255,0.4)] tracking-widest text-sm uppercase">
                Loading articles...
              </p>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md mx-auto text-center py-24"
            >
              <div className="w-16 h-16 rounded-2xl bg-[rgba(255,45,149,0.1)] border border-[rgba(255,45,149,0.2)] flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠</span>
              </div>
              <p className="text-[rgba(255,255,255,0.6)] mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-xl bg-[rgba(59,240,255,0.1)] border border-[rgba(59,240,255,0.3)] text-[#3BF0FF] text-sm font-['Orbitron',sans-serif] tracking-wider uppercase hover:bg-[rgba(59,240,255,0.15)] transition-all"
              >
                Retry
              </button>
            </motion.div>
          )}

          {!loading && !error && posts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 rounded-2xl bg-[rgba(59,240,255,0.05)] border border-[rgba(59,240,255,0.1)] flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-[rgba(59,240,255,0.4)]" />
              </div>
              <h3 className="font-['Orbitron',sans-serif] text-lg text-white mb-3">No articles yet</h3>
              <p className="text-[rgba(255,255,255,0.4)] text-sm">Check back soon for insights from our team.</p>
            </motion.div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
