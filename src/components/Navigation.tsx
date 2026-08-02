"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;

const sectionIds = navLinks.map((link) => link.href.slice(1));

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track scroll position for nav opacity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver for active section highlighting
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            // Prefer sections closer to the top of the viewport
            return (
              a.boundingClientRect.top - b.boundingClientRect.top
            );
          });

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    // Observe sections once they exist in the DOM
    const timer = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          observerRef.current?.observe(el);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, []);

  // Smooth scroll to section
  const scrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id);

      if (el) {
        const navHeight = 72; // var(--nav-height) in px
        const top = el.offsetTop - navHeight;
        window.scrollTo({ top, behavior: "smooth" });
      }

      setIsMobileOpen(false);
    },
    []
  );

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/85 dark:bg-black/85 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] shadow-sm"
            : "bg-white/70 dark:bg-black/60 backdrop-blur-xl border-b border-white/20 dark:border-white/10"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[4.5rem] items-center justify-between">
            {/* Logo */}
            <Link
              href="#home"
              onClick={(e) => scrollToSection(e, "#home")}
              className="flex items-center gap-2 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-dark.svg"
                alt="Yene Visuals"
                className="h-9 w-auto"
              />
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    activeSection === link.href.slice(1)
                      ? "text-accent dark:text-white"
                      : "text-muted hover:text-accent dark:hover:text-white"
                  )}
                >
                  {link.label}
                  {activeSection === link.href.slice(1) && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg bg-black/[0.05] dark:bg-white/[0.08]"
                      style={{ zIndex: -1 }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* CTA + Admin + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <a
                href="/admin"
                className={cn(
                  "hidden sm:inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-full",
                  "bg-black/[0.04] dark:bg-white/[0.08] text-accent/60 dark:text-white/50",
                  "hover:bg-black/[0.08] dark:hover:bg-white/[0.12] hover:text-accent dark:hover:text-white transition-all duration-200"
                )}
              >
                Admin
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className={cn(
                  "hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-full",
                  "bg-accent text-white dark:bg-white dark:text-accent",
                  "hover:opacity-90 transition-opacity duration-200",
                  "shadow-sm hover:shadow-md"
                )}
              >
                Book Session
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] transition-colors hover:bg-black/[0.08] dark:hover:bg-white/[0.12]"
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileOpen}
              >
                {isMobileOpen ? (
                  <X className="h-5 w-5 text-accent dark:text-light-gray" />
                ) : (
                  <Menu className="h-5 w-5 text-accent dark:text-light-gray" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Slide-in Panel */}
            <motion.div
              key="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className={cn(
                "fixed top-0 right-0 bottom-0 z-50 w-[80%] max-w-sm md:hidden",
                "bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-2xl",
                "border-l border-black/[0.06] dark:border-white/[0.08]",
                "shadow-2xl"
              )}
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-6 h-[4.5rem] border-b border-black/[0.06] dark:border-white/[0.08]">
                <span
                  className="text-lg font-semibold text-accent dark:text-light-gray"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center justify-center h-9 w-9 rounded-xl bg-black/[0.04] dark:bg-white/[0.08]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5 text-accent dark:text-light-gray" />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="flex flex-col px-4 py-6 gap-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                    className={cn(
                      "flex items-center px-4 py-3.5 text-base font-medium rounded-xl transition-colors duration-200",
                      activeSection === link.href.slice(1)
                        ? "text-accent dark:text-white bg-black/[0.04] dark:bg-white/[0.08]"
                        : "text-muted hover:text-accent dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.04]"
                    )}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-black/[0.06] dark:border-white/[0.08] space-y-3">
                <a
                  href="/admin"
                  className={cn(
                    "flex items-center justify-center w-full px-6 py-3 text-sm font-medium rounded-full",
                    "bg-black/[0.04] dark:bg-white/[0.08] text-accent/60 dark:text-white/50",
                    "hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-all"
                  )}
                >
                  Admin Dashboard
                </a>
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, "#contact")}
                  className={cn(
                    "flex items-center justify-center w-full px-6 py-3.5 text-base font-medium rounded-full",
                    "bg-accent text-white dark:bg-white dark:text-accent",
                    "hover:opacity-90 transition-opacity duration-200",
                    "shadow-sm"
                  )}
                >
                  Book Session
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
