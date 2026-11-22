import { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { AppLink } from './AppLink';
import { navigateTo } from '../utils/navigation';

interface HeaderProps {
  currentPath: string;
  onResetToUpload?: () => void;
}

export function Header({ currentPath, onResetToUpload }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleFreeToolClick = () => {
    setMobileOpen(false);
    if (onResetToUpload) {
      onResetToUpload();
    }
    if (currentPath !== '/') {
      navigateTo('/#cv-upload-zone');
    } else {
      const el = document.getElementById('cv-upload-zone');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const navLinkClass = (active: boolean) =>
    `text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677FF] rounded px-1 py-0.5 ${
      active ? 'text-white' : 'text-zinc-300 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050505]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <AppLink
          to="/"
          onClick={() => {
            setMobileOpen(false);
            onResetToUpload?.();
          }}
          className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677FF] rounded-lg"
          aria-label="FreeCVRater Home"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              d="M7 3.5H16.5L22 9V22.5C22 23.6046 21.1046 24.5 20 24.5H7C5.89543 24.5 5 23.6046 5 22.5V5.5C5 4.39543 5.89543 3.5 7 3.5Z"
              stroke="#FFFFFF"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
            <path
              d="M16 3.5V9.5H22"
              stroke="#FFFFFF"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
            <path
              d="M9 12.5H15"
              stroke="#FFFFFF"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
            <path
              d="M9 16.5H12.5"
              stroke="#FFFFFF"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
            <path
              d="M13 19.5L15.5 22L20.5 16.5"
              stroke="#1677FF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-display text-lg font-bold tracking-tight">
            <span className="text-white">Free</span>
            <span className="text-[#1677FF]">CVRater</span>
          </span>
        </AppLink>

        {/* Zone 2: Desktop Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7"
        >
          <AppLink
            to="/#how-it-works"
            className={navLinkClass(false)}
          >
            How It Works
          </AppLink>
          <AppLink
            to="/about"
            className={navLinkClass(currentPath === '/about')}
          >
            About
          </AppLink>
          <AppLink
            to="/blog"
            className={navLinkClass(currentPath.startsWith('/blog'))}
          >
            Blog
          </AppLink>
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleFreeToolClick}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#1677FF]/60 bg-[#1677FF]/10 text-[#3B82F6] hover:bg-[#1677FF]/20 hover:text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677FF]"
          >
            <Zap className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            <span>Free Tool</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-white/10 bg-[#080A0F] px-4 py-4 space-y-2"
        >
          <AppLink
            to="/#how-it-works"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-200 hover:bg-white/5"
          >
            How It Works
          </AppLink>
          <AppLink
            to="/cv-checker"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-200 hover:bg-white/5"
          >
            CV Checker
          </AppLink>
          <AppLink
            to="/ats-resume-checker"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-200 hover:bg-white/5"
          >
            ATS Resume Checker
          </AppLink>
          <AppLink
            to="/about"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-200 hover:bg-white/5"
          >
            About
          </AppLink>
          <AppLink
            to="/blog"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-200 hover:bg-white/5"
          >
            Blog
          </AppLink>
          <AppLink
            to="/contact"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-200 hover:bg-white/5"
          >
            Contact
          </AppLink>
        </nav>
      )}
    </header>
  );
}
