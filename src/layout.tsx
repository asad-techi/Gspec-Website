import './index.css';

// Since this is a Vite project (not Next.js), we'll use Google Fonts via CSS import
// Fonts are loaded in index.css via @import

export const metadata = {
  title: 'Gspec Technologies — AI-Driven Innovation for Business Transformation',
  description: 'Gspec Technologies combines deep AI expertise with industry know-how to deliver solutions that drive measurable impact. AI-powered transformation, enterprise-grade expertise and end-to-end innovation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=Exo+2:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Syncopate:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
