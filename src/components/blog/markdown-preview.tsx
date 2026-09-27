'use client'

import ReactMarkdown from "react-markdown";
import { memo } from "react";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

function MarkdownPreviewBase({ content, className = "" }: MarkdownPreviewProps) {
  if (!content?.trim()) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-8">
        ابدأ الكتابة لرؤية المعاينة هنا...
      </div>
    );
  }

  return (
    <div className={`prose-article ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h1 {...props} />,
          h2: ({ node, ...props }) => <h2 {...props} />,
          h3: ({ node, ...props }) => <h3 {...props} />,
          h4: ({ node, ...props }) => <h4 {...props} />,
          p: ({ node, ...props }) => <p {...props} />,
          ul: ({ node, ...props }) => <ul {...props} />,
          ol: ({ node, ...props }) => <ol {...props} />,
          li: ({ node, ...props }) => <li {...props} />,
          blockquote: ({ node, ...props }) => <blockquote {...props} />,
          strong: ({ node, ...props }) => <strong {...props} />,
          em: ({ node, ...props }) => <em {...props} />,
          a: ({ node, ...props }) => <a {...props} />,
          code: ({ node, className, children, ...props }: any) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-muted text-accent text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre
              className="bg-muted p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono"
              {...props}
            />
          ),
          hr: () => <hr className="border-border my-8" />,
          img: ({ node, alt, ...props }) => (
            <img
              alt={alt || ""}
              className="rounded-lg my-4 max-w-full h-auto"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export const MarkdownPreview = memo(MarkdownPreviewBase);
