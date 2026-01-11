'use client';

import { useEffect } from 'react';
import { useLocation } from "wouter";
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { Features } from './Features';
import { Technology } from './Technology';
import { Impact } from './Impact';
import { Contact } from './Contact copy';
import { AdvancedDrone } from './AdvancedDrone';

export default function LandingPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--drone-dark)] text-white overflow-x-hidden">
      {/* Custom cursor effect */}
      <div
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background: `radial-gradient(600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 136, 0.05), transparent 40%)`,
        }}
        onMouseMove={(e) => {
          const target = e.currentTarget as HTMLElement;
          target.style.setProperty('--mouse-x', `${e.clientX}px`);
          target.style.setProperty('--mouse-y', `${e.clientY}px`);
        }}
      />

      <AdvancedDrone />

      <Navbar onLoginClick={() => setLocation("/login")} />

      <main className="relative">
        <Hero />
        <Features />
        <Technology />
        <Impact />
        <Contact />
      </main>
    </div>
  );
}
