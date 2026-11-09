/**
 * Vietnamese layout — wraps all /vi/* pages with lang="vi"
 * for correct language identification by search engines.
 */

export default function ViLayout({ children }: { children: React.ReactNode }) {
  return <div lang="vi">{children}</div>;
}
