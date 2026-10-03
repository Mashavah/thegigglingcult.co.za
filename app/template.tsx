/* Remounts on every navigation so the page content plays a short enter transition
   while the nav, footer and drawer stay put. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page">{children}</div>;
}
