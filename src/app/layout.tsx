import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LLD Practice Platform — Architect Workbench',
  description: 'Evidence-based Low-Level Design practice platform for software architects and senior engineers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0f141c] text-[#f8fafc] flex flex-col font-sans antialiased selection:bg-[#6366f1]/30 selection:text-[#c0c1ff]">
        {/* Top Workbench Navigation Bar */}
        <header className="h-14 border-b border-[#263244] bg-[#0f141c]/95 backdrop-blur px-4 lg:px-8 flex items-center justify-between z-50 sticky top-0">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-6 h-6 rounded bg-[#6366f1] flex items-center justify-center text-white font-mono font-bold text-xs tracking-wider shadow-sm group-hover:bg-[#4f46e5] transition-colors">
                //
              </div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-extrabold text-sm tracking-tight text-[#f8fafc]">
                  ARCHITECT
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e293b] text-[#38bdf8] border border-[#263244] tracking-wider uppercase font-semibold">
                  LLD WORKBENCH
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 border-l border-[#263244] pl-6 text-xs font-mono">
              <Link
                href="/problems"
                className="px-3 py-1.5 rounded text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#161e2e] transition-colors font-medium"
              >
                PRACTICE
              </Link>
              <Link
                href="/problems/parking-lot/history"
                className="px-3 py-1.5 rounded text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#161e2e] transition-colors font-medium"
              >
                ATTEMPTS
              </Link>
              <Link
                href="/attempts/compare?from=att-parking-lot-01&to=att-parking-lot-02"
                className="px-3 py-1.5 rounded text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#161e2e] transition-colors font-medium"
              >
                INSIGHTS
              </Link>
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#161e2e] transition-colors font-medium"
              >
                DASHBOARD
              </Link>
              <Link
                href="/design-system"
                className="px-3 py-1.5 rounded text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#161e2e] transition-colors font-medium"
              >
                DOCUMENTATION
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded bg-[#161e2e] border border-[#263244] text-[#10b981] text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span>EVALUATION ENGINE: ONLINE</span>
            </div>

            <Link
              href="/problems"
              className="px-3 py-1.5 text-xs font-mono font-medium bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Select Attempt</span>
              <span className="text-[10px] opacity-75">▾</span>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
