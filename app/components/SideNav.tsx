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
      className={`fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 p-2 rounded-2xl border shadow-sm ${
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
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              isActive
                ? 'bg-[#5c4a3a] text-white'
                : isDark
                ? 'text-gray-300 hover:bg-gray-800'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={2} />
          </Link>
        );
      })}
    </nav>
  );
}