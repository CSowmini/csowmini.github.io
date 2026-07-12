'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, FolderOpen, BriefcaseBusiness, Send } from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/projects', icon: FolderOpen, label: 'Projects' },
  { href: '/about', icon: User, label: 'About' },
  { href: '/', icon: Home, label: 'Home' },
  { href: '/experience', icon: BriefcaseBusiness, label: 'Work Experience' },
  { href: '/contact', icon: Send, label: 'Contact' },
];

export default function SideNav() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);
  const [navHover, setNavHover] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(!document.documentElement.classList.contains('light-mode'));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      onMouseEnter={() => setNavHover(true)}
      onMouseLeave={() => setNavHover(false)}
      style={{
        // translateY(-50%) lives here (not in a class) so it doesn't fight the scale
        transform: `translateY(-50%) scale(${navHover ? 1.12 : 1})`,
        transformOrigin: 'left center',
        transition: 'transform 0.25s ease',
      }}
      className={`fixed left-6 top-1/2 z-40 flex flex-col gap-1 p-1.5 rounded-full border shadow-sm ${
        isDark
          ? 'bg-gray-900/80 border-gray-700/40 backdrop-blur-sm'
          : 'bg-white border-gray-200'
      }`}
    >
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            title={label}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isActive
                ? 'bg-[#D4A59A] text-white'
                : isDark
                ? 'text-gray-300 hover:bg-[#D4A59A]/25 hover:text-white'
                : 'text-gray-700 hover:bg-[#F5E3DF] hover:text-[#8A5C50]'
            }`}
          >
            <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
          </Link>
        );
      })}
    </nav>
  );
}