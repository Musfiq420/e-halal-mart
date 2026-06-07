'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Map Markdown elements to Tailwind-styled tags (avoids a typography plugin).
// `node` is stripped so react-markdown's internal prop doesn't leak to the DOM.
const components = {
  h1: ({ node, ...p }) => <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3" {...p} />,
  h2: ({ node, ...p }) => <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3" {...p} />,
  h3: ({ node, ...p }) => <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2" {...p} />,
  p: ({ node, ...p }) => <p className="mb-3 last:mb-0" {...p} />,
  ul: ({ node, ...p }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...p} />,
  ol: ({ node, ...p }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...p} />,
  strong: ({ node, ...p }) => <strong className="font-semibold text-gray-900" {...p} />,
  em: ({ node, ...p }) => <em className="italic" {...p} />,
  a: ({ node, ...p }) => <a className="text-primary underline" target="_blank" rel="noopener noreferrer" {...p} />,
  blockquote: ({ node, ...p }) => (
    <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-500 my-3" {...p} />
  ),
  code: ({ node, ...p }) => <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 text-sm" {...p} />,
  hr: ({ node, ...p }) => <hr className="my-6 border-gray-200" {...p} />,
  // Inline article images wrapped in <figure>, with the Markdown title (set as
  // the caption in the editor) shown as a <figcaption> below. Plain <img> since
  // the src is arbitrary Markdown content.
  img: ({ node, alt, title, ...p }) => {
    const caption = title || alt;
    return (
      <figure className="my-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={alt || ""} className="rounded-lg max-w-full h-auto mx-auto" {...p} />
        {caption && (
          <figcaption className="text-center text-sm text-gray-500 mt-2">{caption}</figcaption>
        )}
      </figure>
    );
  },
};

export default function Markdown({ children, className = '' }) {
  if (!children) return null;
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
