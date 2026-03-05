"use client";
import { MouseEvent, useState } from "react";
import { navLinks } from "@/app/constants";

const HeaderLogo = () => {

    const handleLogoClick = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (window.location.pathname === "/") {
            window.scrollTo(0,0);
        } else {
            window.location.href = "/";
        }
    };

    return (
        <div onClick={handleLogoClick} className="relative group cursor-pointer">
            <span className="text-2xl font-bold absolute bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Jonathan Ginter
            </span>
            <span className="text-2xl font-bold relative bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
                Jonathan Ginter
            </span>
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
            <div className="hidden md:flex gap-6">
                {navLinks.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        {link.label}
                    </a>
                ))}
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative w-10 h-10"
                aria-label="Toggle menu"
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6">
                    {/* Top line */}
                    <span
                    className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                        mobileMenuOpen ? 'rotate-45 top-[11px]' : 'rotate-0 top-1'
                    }`}
                    />
                    {/* Middle line */}
                    <span
                    className={`absolute h-0.5 w-6 bg-current top-[12px] transition-all duration-300 ease-in-out ${
                        mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                    />
                    {/* Bottom line */}
                    <span
                    className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                        mobileMenuOpen ? '-rotate-45 top-[11px]' : 'rotate-0 top-[21px]'
                    }`}
                    />
                </div>
            </button>
            {/* Mobile Navigation Menu */}
            <div
            className={`fixed top-[73px] right-0 h-[calc(100vh-73px)] w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
                mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            >
                <div className="flex flex-col gap-6 p-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={handleNavClick}
                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xl font-medium"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden top-[73px]"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    );
};

const Navigation = () => {
    return (
        <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <HeaderLogo />
                    <HeaderNavigation />
                </div>
            </div>
        </nav>
    );
};

export {
    Navigation,
};