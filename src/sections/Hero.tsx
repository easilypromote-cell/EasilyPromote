'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Container } from '@/components/ui';
import MouseTrailLayer from '@/components/MouseTrailLayer';
import { TextEffect } from '@/components/motion-primitives/text-effect';
import { heroContent } from '@/content/hero';
import { trackEvent } from '@/lib/analytics';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const lines = heroContent.headline.split('\n');

const navLinks = [
  { label: 'Features', href: '#benefits' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

const headerButtonStyle = {
  backgroundColor: 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  border: '1px solid rgba(255,255,255,0.2)',
};

const secondaryCtaStyle = {
  backgroundColor: 'rgba(0,0,0,0.35)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  border: '1px solid rgba(255,255,255,0.15)',
};

const secondaryCtaHoverStyle = { backgroundColor: 'rgba(0,0,0,0.5)' };
const secondaryCtaIdleStyle = { backgroundColor: 'rgba(0,0,0,0.35)' };

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const headerBtnRef = useRef<HTMLButtonElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href') || '';
    trackEvent('nav_clicked', { link: href });
    setMobileOpen(false);
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReduced) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from(bgRef.current, { opacity: 0, duration: 1.2 });
        tl.from(logoRef.current, { opacity: 0, y: -8, duration: 0.6 }, 0.2);
        tl.from(headerBtnRef.current, { opacity: 0, y: -8, duration: 0.5 }, 0.4);
        tl.from(subtitleRef.current, { opacity: 0, y: 20, duration: 0.8 }, 0.9);
        tl.from(ctaRef.current, { opacity: 0, y: 16, duration: 0.7 }, 1.3);
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleLaunchCampaign = useCallback(() => {
    trackEvent('hero_launch_campaign_clicked');
  }, []);

  const handleWatchDemo = useCallback(() => {
    trackEvent('hero_watch_demo_clicked');
  }, []);

  const handleSecondaryCtaEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    Object.assign(e.currentTarget.style, secondaryCtaHoverStyle);
  }, []);

  const handleSecondaryCtaLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    Object.assign(e.currentTarget.style, secondaryCtaIdleStyle);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen">
            <img ref={bgRef} src="/images/1.png" alt="" className="w-full h-screen object-cover block" />

      <motion.div
        className="absolute inset-0 z-[1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 25%)',
        }}
      />

      <MouseTrailLayer />

      <div className="absolute inset-0 z-10 flex flex-col">
        <header
          className="relative z-50 bg-transparent py-5"
        >
          <Container>
            <nav className="flex items-center">
              <a href="#">
                <span ref={logoRef}>
                  <Image src="/images/Logo.svg" alt="EasilyPromote" width={40} height={40} priority style={{ filter: 'brightness(0) invert(1)' }} />
                </span>
              </a>

              <ul className="hidden desktop:flex items-center gap-8 ml-auto mr-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={handleNavClick}
                      className="text-[15px] text-white hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-4">
                <button
                  ref={headerBtnRef}
                  onClick={() => trackEvent('signup_clicked')}
                  className="h-9 px-4 text-white text-[15px] font-medium rounded-full hover:-translate-y-0.5 transition-[background-color,transform] duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                  style={headerButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                  }}
                >
                  Get Started
                </button>
                <button
                  className="desktop:hidden text-2xl"
                  onClick={toggleMobile}
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? '✕' : '☰'}
                </button>
              </div>
            </nav>

            {mobileOpen && (
              <ul
                className="tablet:hidden mt-4 space-y-4 bg-white rounded-lg p-4 shadow-lg"
              >
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={handleNavClick}
                      className="block py-2 text-body hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Container>
        </header>

        <div className="flex-1 flex items-end pb-8" data-hero-content>
        <div className="w-full max-w-content mx-auto px-6 tablet:px-12 desktop:px-8">
          <div className="flex flex-col tablet:flex-row justify-between items-center gap-8">
            <div className="space-y-6">
              <h1
                className="text-[44px] leading-[110%] tracking-[-0.05em] text-white text-left"
                style={{ fontWeight: 700 }}
              >
                {lines.map((line, i) => (
                  <TextEffect key={i} per="word" as="span" preset="blur" className="block" delay={0.6 + i * 0.2}>
                    {line}
                  </TextEffect>
                ))}
              </h1>

              <div ref={ctaRef} className="flex flex-col sm:flex-row items-start gap-4">
                <button
                  onClick={handleLaunchCampaign}
                  className="h-14 px-6 text-[15px] bg-primary text-[#111111] font-semibold rounded-full hover:-translate-y-0.5 hover:bg-primary-hover transition-all duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 w-full sm:w-56"
                >
                  {heroContent.ctaPrimary}
                </button>
                <button
                  onClick={handleWatchDemo}
                  className="h-14 px-6 text-[15px] text-white font-semibold rounded-full hover:-translate-y-0.5 transition-all duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 w-full sm:w-56"
                  style={secondaryCtaStyle}
                  onMouseEnter={handleSecondaryCtaEnter}
                  onMouseLeave={handleSecondaryCtaLeave}
                >
                  {heroContent.ctaSecondary}
                </button>
              </div>
            </div>

            <div>
              <p
                ref={subtitleRef}
                className="text-[19px] leading-[160%] tracking-[-0.01em] text-left max-w-[450px]"
                style={{ color: '#ffffff', fontWeight: 500 }}
              >
                {heroContent.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}
