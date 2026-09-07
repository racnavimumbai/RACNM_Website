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
    <div className={cn('markdown-content space-y-4 text-[var(--text-secondary)] leading-relaxed font-sans', className)}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-8 mb-4 border-b border-[var(--border-secondary)] pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#d4af37] mt-6 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-serif-heading text-lg sm:text-xl font-semibold text-[var(--text-primary)] mt-5 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-4 last:mb-0">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 space-y-2 my-4 text-[var(--text-secondary)] text-sm sm:text-base">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 space-y-2 my-4 text-[var(--text-secondary)] text-sm sm:text-base">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#d4af37] pl-4 py-2 my-5 italic text-[var(--text-muted)] bg-[var(--gold-subtle)] rounded-r-xl">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-[var(--text-primary)]">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[var(--text-secondary)]">
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
            <hr className="border-t border-[var(--border-secondary)] my-8" />
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-secondary)] text-[#d4af37] font-mono text-xs">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-secondary)] overflow-x-auto text-xs font-mono my-4 text-[var(--text-primary)]">
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
