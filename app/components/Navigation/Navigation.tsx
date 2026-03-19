"use client";
import { MouseEvent, useState } from "react";
import { navLinks } from "@/app/constants";
import { useTheme } from "@/app/context/ThemeContext";

const HeaderLogo = () => {
    const handleLogoClick = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (window.location.pathname === "/") {
            window.scrollTo(0, 0);
        } else {
            window.location.href = "/";
        }
    };

    return (
        <div onClick={handleLogoClick} className="cursor-pointer flex items-center gap-1" style={{ fontFamily: "var(--font-space-mono)" }}>
            <span className="text-sm font-bold tracking-widest" style={{ color: "var(--foreground)" }}>JG</span>
            <span className="text-sm" style={{ color: "var(--accent)" }}>/_</span>
        </div>
    );
};

const HeaderNavigation = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleNavClick = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8">
                {navLinks.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        className="text-xs uppercase tracking-widest transition-colors text-zinc-500 hover:text-amber-400"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        {link.label}
                    </a>
                ))}
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 relative w-10 h-10 transition-colors text-zinc-500 hover:text-amber-400"
                aria-label="Toggle menu"
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6">
                    <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? "rotate-45 top-[11px]" : "rotate-0 top-1"}`} />
                    <span className={`absolute h-0.5 w-6 bg-current top-[12px] transition-all duration-300 ease-in-out ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
                    <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? "-rotate-45 top-[11px]" : "rotate-0 top-[21px]"}`} />
                </div>
            </button>

            {/* Mobile Navigation Menu */}
            <div
                className={`fixed top-[69px] right-0 h-[calc(100vh-69px)] w-64 border-l z-40 transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
                style={{ background: "var(--background)", borderColor: "var(--border)" }}
            >
                <div className="flex flex-col gap-6 p-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={handleNavClick}
                            className="text-sm uppercase tracking-widest transition-colors text-zinc-500 hover:text-amber-400"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 md:hidden top-[69px]"
                    style={{ background: "rgba(0,0,0,0.6)" }}
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    );
};

const ThemeToggle = () => {
    const { toggleTheme } = useTheme();
    return (
        <button className="win98-theme-btn hidden md:flex" onClick={toggleTheme} title="Switch to Windows 98 theme">
            <span>🖥️</span>
            <span>Win98</span>
        </button>
    );
};

const Navigation = () => {
    return (
        <nav className="fixed top-0 w-full z-50 border-b" style={{ background: "var(--background)", borderColor: "var(--border)" }}>
            <div className="max-w-6xl mx-auto px-6 md:px-12 py-5">
                <div className="flex justify-between items-center">
                    <HeaderLogo />
                    <div className="flex items-center gap-4">
                        <HeaderNavigation />
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export {
    Navigation,
};
