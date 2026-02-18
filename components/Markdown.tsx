import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import { remark } from "remark";
import stripMarkdownPlugin from "strip-markdown";

const components: Components = {
  p: ({ children }) => <span>{children}</span>,
  a: ({ href, children }) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className="text-sky-600 underline hover:text-sky-800">
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        className="text-sky-600 underline hover:text-sky-800"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  },
};

const processor = remark().use(stripMarkdownPlugin);

export function stripMarkdown(text: string): string {
  return String(processor.processSync(text)).trim();
}

export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span className={className}>
      <ReactMarkdown
        components={components}
        allowedElements={["a", "p", "strong", "em"]}
        unwrapDisallowed
      >
        {children}
      </ReactMarkdown>
    </span>
  );
}
