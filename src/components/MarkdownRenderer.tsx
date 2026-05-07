import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Mermaid } from "./Mermaid";

interface Props {
  content: string;
}

export const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  const components: Components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";

      if (!inline && language === "mermaid") {
        return <Mermaid chart={String(children).replace(/\n$/, "")} />;
      }
      return !inline ? (
        <div className="bg-slate-900 text-slate-50 p-4 rounded-xl overflow-x-auto my-4 text-sm font-mono">
          <code className={className} {...props}>
            {children}
          </code>
        </div>
      ) : (
        <code
          className="bg-slate-100 text-rose-600 px-1.5 py-0.5 rounded-md text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-10 mb-6 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-semibold tracking-tight text-slate-800 mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-medium tracking-tight text-slate-800 mt-6 mb-3">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-slate-600 leading-relaxed mb-4">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-outside ml-6 text-slate-600 mb-6 space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 text-slate-600 mb-6 space-y-2">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="pl-1 leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-sky-500 pl-4 py-1 italic text-slate-700 bg-sky-50/50 rounded-r-lg my-6">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6 rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse text-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-slate-50 border-b border-slate-200">
        {children}
      </thead>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 font-medium text-slate-900">{children}</th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 border-b border-slate-100 last:border-0 text-slate-600">
        {children}
      </td>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-sky-600 hover:text-sky-700 font-medium underline underline-offset-2 decoration-sky-200 hover:decoration-sky-600 transition-colors"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-slate-900">{children}</strong>
    ),
  };

  return (
    <div className="markdown-body max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};
