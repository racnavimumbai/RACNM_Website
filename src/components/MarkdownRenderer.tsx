'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div className={cn('markdown-content space-y-4 text-zinc-300 leading-relaxed font-sans', className)}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#d4af37] mt-6 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-serif-heading text-lg sm:text-xl font-semibold text-zinc-100 mt-5 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-4 last:mb-0">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 space-y-2 my-4 text-zinc-300 text-sm sm:text-base">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 space-y-2 my-4 text-zinc-300 text-sm sm:text-base">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#d4af37] pl-4 py-2 my-5 italic text-zinc-400 bg-white/[0.02] rounded-r-xl">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-zinc-200">
              {children}
            </em>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-4 hover:decoration-[#d4af37] hover:text-[#f3e5ab] transition-colors font-medium"
            >
              {children}
            </a>
          ),
          hr: () => (
            <hr className="border-t border-white/10 my-8" />
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-white/10 text-[#d4af37] font-mono text-xs">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 overflow-x-auto text-xs font-mono my-4 text-zinc-300">
              {children}
            </pre>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
