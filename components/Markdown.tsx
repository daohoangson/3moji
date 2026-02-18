import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";

const components: Components = {
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
