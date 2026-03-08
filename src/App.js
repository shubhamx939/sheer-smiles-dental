import { useState, useEffect, useRef, useCallback } from "react";

// ── Google Fonts ──────────────────────────────────────────────
if (typeof document !== "undefined") {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&family=Lato:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap";
  document.head.appendChild(link);
}

// ── CSS ───────────────────────────────────────────────────────
const STYLES = `
  :root {
    --navy:   #0A1628;
    --navy2:  #0f1f3d;
    --teal:   #00D4C8;
    --gold:   #FFD166;
    --pink:   #FF6B9D;
    --violet: #7C3AED;
    --white:  #F0F6FF;
    --muted:  rgba(240,246,255,0.45);
    --glass:  rgba(255,255,255,0.07);
    --glassBorder: rgba(255,255,255,0.12);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--navy);
    color: var(--white);
    font-family: 'Lato', sans-serif;
    overflow-x: hidden;
    cursor: none;
  }

  * { cursor: none !important; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--navy); }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(var(--teal), var(--violet));
    border-radius: 2px;
  }

  /* Custom cursor */
  .cursor {
    position: fixed;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: var(--teal);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.08s ease, width 0.2s, height 0.2s, background 0.2s;
    mix-blend-mode: difference;
  }
  .cursor-ring {
    position: fixed;
    width: 40px; height: 40px;
    border-radius: 50%;
    border: 1.5px solid var(--teal);
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease, width 0.2s, height 0.2s;
    opacity: 0.6;
  }

  /* Navbar */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 1000;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 40px;
    transition: padding 0.3s, background 0.3s, backdrop-filter 0.3s, border-bottom 0.3s;
  }
  .navbar.scrolled {
    padding: 12px 40px;
    background: rgba(10,22,40,0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--glassBorder);
  }
  .nav-logo {
    font-family: 'Fredoka One', cursive;
    font-size: 1.5rem;
    background: linear-gradient(90deg, var(--teal), var(--gold), var(--pink), var(--teal));
    background-size: 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmerText 3s linear infinite;
    white-space: nowrap;
  }
  .nav-tabs {
    display: flex; gap: 6px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--glassBorder);
    border-radius: 50px;
    padding: 6px;
  }
  .nav-tab {
    padding: 8px 20px;
    border: none;
    border-radius: 50px;
    font-family: 'Nunito', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--muted);
    background: transparent;
    transition: all 0.25s;
    letter-spacing: 0.5px;
  }
  .nav-tab.active {
    background: linear-gradient(135deg, var(--teal), var(--violet));
    color: #fff;
    box-shadow: 0 0 20px rgba(0,212,200,0.35);
  }
  .nav-phone {
    color: var(--teal);
    text-decoration: none;
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
    transition: color 0.2s;
  }
  .nav-phone:hover { color: var(--gold); }

  /* Mobile bottom bar */
  .mobile-bar {
    display: none;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 1000;
    background: rgba(10,22,40,0.97);
    backdrop-filter: blur(16px);
    border-top: 1px solid var(--glassBorder);
    padding: 10px 0 14px;
    justify-content: space-around;
  }
  .mobile-tab {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    background: none; border: none;
    color: var(--muted);
    font-family: 'Nunito', sans-serif;
    font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.5px;
    transition: color 0.2s;
  }
  .mobile-tab.active { color: var(--teal); }
  .mobile-tab-icon { font-size: 1.2rem; }

  /* Page transitions */
  .page { animation: pageIn 0.4s ease forwards; }
  .page-exit { animation: pageOut 0.25s ease forwards; }

  @keyframes pageIn {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes pageOut {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(0.97); }
  }

  /* Hero */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    padding: 120px 40px 80px;
  }
  .hero-content {
    position: relative; z-index: 10;
    text-align: center;
    max-width: 900px;
  }
  .badge-since {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--glass);
    border: 1px solid var(--glassBorder);
    border-radius: 50px;
    padding: 8px 20px;
    font-family: 'Nunito', sans-serif;
    font-size: 0.8rem; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 24px;
    animation: fadeSlideIn 0.6s ease both;
  }
  .badge-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 8px #22c55e;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%,100% { transform: scale(1); opacity:1; }
    50% { transform: scale(1.4); opacity:0.7; }
  }
  .hero-title {
    font-family: 'Fredoka One', cursive;
    font-size: clamp(3rem, 8vw, 7rem);
    line-height: 1.05;
    margin-bottom: 20px;
    animation: fadeSlideIn 0.7s 0.1s ease both;
  }
  .shimmer-word {
    background: linear-gradient(90deg, var(--teal), var(--gold), var(--pink), var(--teal));
    background-size: 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmerText 2.5s linear infinite;
  }
  @keyframes shimmerText {
    0%   { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  .hero-tagline {
    font-family: 'Lato', sans-serif;
    font-style: italic;
    font-size: clamp(1rem, 2.5vw, 1.4rem);
    color: var(--muted);
    margin-bottom: 40px;
    animation: fadeSlideIn 0.7s 0.2s ease both;
  }
  .hero-btns {
    display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
    animation: fadeSlideIn 0.7s 0.3s ease both;
  }

  /* Orbs */
  .orb {
    position: absolute;
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    filter: blur(60px);
    opacity: 0.25;
    animation: morphOrb 12s ease-in-out infinite;
  }
  .orb1 { width: 600px; height: 600px; background: radial-gradient(var(--teal), transparent); top: -20%; left: -15%; animation-delay: 0s; }
  .orb2 { width: 500px; height: 500px; background: radial-gradient(var(--violet), transparent); top: 30%; right: -10%; animation-delay: -4s; }
  .orb3 { width: 400px; height: 400px; background: radial-gradient(var(--gold), transparent); bottom: -10%; left: 35%; animation-delay: -8s; }
  @keyframes morphOrb {
    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: translate(0,0); }
    25%     { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; transform: translate(20px,-20px); }
    50%     { border-radius: 50% 50% 30% 70% / 50% 70% 30% 50%; transform: translate(-20px,10px); }
    75%     { border-radius: 70% 30% 50% 50% / 40% 60% 40% 60%; transform: translate(10px,20px); }
  }

  /* Floating icons */
  .floating-icon {
    position: absolute; font-size: 2.5rem; opacity: 0.6; z-index: 5;
    animation: floatIcon 6s ease-in-out infinite;
  }
  .fi1 { top: 15%; left: 8%;  animation-delay: 0s; }
  .fi2 { top: 20%; right: 10%; animation-delay: 1.5s; }
  .fi3 { bottom: 25%; left: 5%; animation-delay: 3s; }
  .fi4 { bottom: 30%; right: 8%; animation-delay: 4.5s; }
  @keyframes floatIcon {
    0%,100% { transform: translateY(0) rotate(0deg); }
    33%     { transform: translateY(-18px) rotate(8deg); }
    66%     { transform: translateY(8px) rotate(-5deg); }
  }

  /* Ribbon */
  .ribbon-wrap {
    overflow: hidden;
    padding: 18px 0;
    border-top: 1px solid var(--glassBorder);
    border-bottom: 1px solid var(--glassBorder);
    margin: 60px 0;
  }
  .ribbon-track {
    display: flex; gap: 0; white-space: nowrap;
    animation: ribbonScroll 30s linear infinite;
  }
  .ribbon-item {
    display: inline-flex; align-items: center; gap: 16px;
    padding: 0 32px;
    font-family: 'Nunito', sans-serif;
    font-weight: 800;
    font-size: 0.85rem;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .ribbon-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    display: inline-block;
  }
  @keyframes ribbonScroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* Section */
  .section { padding: 80px 40px; max-width: 1200px; margin: 0 auto; }
  .section-label {
    font-family: 'Nunito', sans-serif;
    font-size: 0.75rem; font-weight: 800;
    letter-spacing: 3px; text-transform: uppercase;
    color: var(--teal);
    margin-bottom: 12px;
    animation: fadeSlideIn 0.6s ease both;
  }
  .section-title {
    font-family: 'Fredoka One', cursive;
    font-size: clamp(2rem, 4vw, 3.2rem);
    margin-bottom: 16px;
    line-height: 1.1;
  }
  .section-sub {
    font-size: 1rem;
    color: var(--muted);
    max-width: 600px;
    line-height: 1.7;
    margin-bottom: 50px;
  }

  /* Tilt card */
  .tilt-card {
    border-radius: 20px;
    border: 1px solid var(--glassBorder);
    overflow: hidden;
    transition: box-shadow 0.3s;
    transform-style: preserve-3d;
    will-change: transform;
  }

  /* Cards grid */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }
  .service-card {
    padding: 32px;
    position: relative;
    overflow: hidden;
  }
  .card-emoji { font-size: 2.5rem; margin-bottom: 16px; display: block; }
  .card-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 50px;
    font-family: 'Nunito', sans-serif;
    font-size: 0.65rem; font-weight: 800;
    letter-spacing: 1.5px; text-transform: uppercase;
    margin-bottom: 14px;
  }
  .card-name {
    font-family: 'Fredoka One', cursive;
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
  .card-cat {
    font-size: 0.75rem; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
  }
  .card-desc { font-size: 0.9rem; line-height: 1.6; color: var(--muted); margin-bottom: 20px; }
  .card-price {
    font-family: 'Nunito', sans-serif;
    font-size: 1.1rem; font-weight: 900;
    margin-bottom: 20px;
  }

  /* Mag button */
  .mag-btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 8px;
    padding: 14px 32px;
    border: none;
    border-radius: 50px;
    font-family: 'Nunito', sans-serif;
    font-size: 0.9rem; font-weight: 800;
    letter-spacing: 0.5px;
    transition: box-shadow 0.2s, transform 0.15s ease;
    position: relative;
    overflow: hidden;
  }
  .mag-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.1);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .mag-btn:hover::before { opacity: 1; }
  .mag-btn-primary {
    background: linear-gradient(135deg, var(--teal), var(--violet));
    color: #fff;
    box-shadow: 0 8px 32px rgba(0,212,200,0.3);
  }
  .mag-btn-secondary {
    background: transparent;
    border: 2px solid var(--glassBorder);
    color: var(--white);
  }
  .mag-btn-secondary:hover { border-color: var(--teal); }
  .mag-btn-gold {
    background: linear-gradient(135deg, var(--gold), var(--pink));
    color: var(--navy);
  }

  /* Testimonial card */
  .test-card {
    padding: 36px;
    background: var(--glass);
  }
  .test-quote {
    font-family: 'Fredoka One', cursive;
    font-size: 5rem;
    line-height: 0.5;
    margin-bottom: 16px;
    opacity: 0.3;
  }
  .test-text {
    font-style: italic;
    font-size: 0.95rem; line-height: 1.7;
    color: var(--muted);
    margin-bottom: 24px;
  }
  .test-name {
    font-family: 'Nunito', sans-serif;
    font-weight: 800; font-size: 0.9rem;
    margin-bottom: 2px;
  }
  .test-meta { font-size: 0.8rem; color: var(--muted); }
  .stars { color: var(--gold); font-size: 0.85rem; letter-spacing: 2px; }

  /* Process strip */
  .process-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 24px;
  }
  .process-step {
    background: var(--glass);
    border: 1px solid var(--glassBorder);
    border-radius: 20px;
    padding: 36px 28px;
    position: relative;
    overflow: hidden;
    animation: fadeSlideIn 0.6s ease both;
  }
  .process-num {
    position: absolute; top: -10px; right: 20px;
    font-family: 'Fredoka One', cursive;
    font-size: 6rem; color: rgba(255,255,255,0.04);
    line-height: 1;
  }
  .process-emoji { font-size: 2rem; margin-bottom: 16px; display: block; }
  .process-title {
    font-family: 'Nunito', sans-serif;
    font-weight: 800; font-size: 1rem;
    margin-bottom: 8px;
  }
  .process-desc { font-size: 0.85rem; line-height: 1.6; color: var(--muted); }

  /* CTA Banner */
  .cta-banner {
    position: relative;
    overflow: hidden;
    padding: 80px 60px;
    background: linear-gradient(135deg, var(--navy2), var(--violet) 100%);
    border-radius: 24px;
    margin: 60px 40px;
    text-align: center;
  }
  .cta-banner::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  .cta-title {
    font-family: 'Fredoka One', cursive;
    font-size: clamp(1.8rem, 4vw, 3rem);
    margin-bottom: 12px;
    position: relative;
  }
  .cta-sub { color: var(--muted); margin-bottom: 36px; font-size: 1rem; position: relative; }
  .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; position: relative; }

  /* Stats */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--glassBorder);
    border: 1px solid var(--glassBorder);
    border-radius: 20px;
    overflow: hidden;
    margin: 60px 0 0;
  }
  .stat-cell {
    background: var(--glass);
    padding: 36px 24px;
    text-align: center;
    backdrop-filter: blur(10px);
  }
  .stat-num {
    font-family: 'Fredoka One', cursive;
    font-size: 2.8rem;
    background: linear-gradient(135deg, var(--teal), var(--gold));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    margin-bottom: 6px;
  }
  .stat-label { font-size: 0.8rem; color: var(--muted); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }

  /* About layout */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }
  .about-left {
    position: relative;
    background: var(--glass);
    border: 1px solid var(--glassBorder);
    border-radius: 24px;
    padding: 48px 36px;
    overflow: hidden;
    min-height: 480px;
    display: flex; flex-direction: column; justify-content: flex-end;
  }
  .about-bg-year {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Fredoka One', cursive;
    font-size: 9rem; color: rgba(255,255,255,0.04);
    white-space: nowrap; pointer-events: none;
  }
  .est-badge {
    display: inline-block;
    background: linear-gradient(135deg, var(--teal), var(--violet));
    padding: 6px 18px; border-radius: 50px;
    font-family: 'Nunito', sans-serif;
    font-size: 0.75rem; font-weight: 800;
    letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 20px;
  }
  .about-left-title {
    font-family: 'Fredoka One', cursive;
    font-size: 2rem; font-style: italic;
    color: var(--gold);
    margin-bottom: 24px;
  }
  .about-left-stats { display: flex; gap: 32px; }
  .about-stat-num {
    font-family: 'Fredoka One', cursive;
    font-size: 2rem; color: var(--teal);
  }
  .about-stat-lbl { font-size: 0.75rem; color: var(--muted); }
  .about-right h2 { font-family: 'Fredoka One', cursive; font-size: 2.5rem; margin-bottom: 20px; }
  .about-para { font-size: 0.95rem; line-height: 1.8; color: var(--muted); margin-bottom: 20px; }
  .features-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
    margin-top: 32px;
  }
  .feature-card {
    background: var(--glass);
    border: 1px solid var(--glassBorder);
    border-radius: 16px;
    padding: 20px;
    backdrop-filter: blur(10px);
  }
  .feature-emoji { font-size: 1.5rem; margin-bottom: 8px; display: block; }
  .feature-title { font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 0.9rem; margin-bottom: 4px; }
  .feature-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.5; }

  /* Values grid */
  .values-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-top: 60px;
  }
  .value-card {
    background: var(--glass);
    border: 1px solid var(--glassBorder);
    border-radius: 20px;
    padding: 32px 24px;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .value-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
  .value-icon { font-size: 2.5rem; margin-bottom: 16px; display: block; }
  .value-name { font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 1rem; margin-bottom: 8px; }
  .value-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.5; }

  /* Gallery masonry */
  .masonry {
    columns: 3;
    column-gap: 16px;
  }
  .masonry-item {
    break-inside: avoid;
    margin-bottom: 16px;
    border-radius: 16px;
    overflow: hidden;
  }
  .gallery-card {
    padding: 32px 24px;
    min-height: 200px;
    display: flex; flex-direction: column; justify-content: flex-end;
    position: relative;
    overflow: hidden;
  }
  .gallery-card-emoji {
    font-size: 3rem;
    position: absolute; top: 20px; right: 20px;
    opacity: 0.5;
  }
  .gallery-card-name {
    font-family: 'Fredoka One', cursive;
    font-size: 1.3rem;
    margin-bottom: 8px;
  }
  .gallery-bar {
    height: 3px;
    border-radius: 3px;
    margin-top: 12px;
  }

  /* Contact layout */
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 40px;
  }
  .contact-left {
    background: var(--glass);
    border: 1px solid var(--glassBorder);
    border-radius: 24px;
    padding: 48px 36px;
    position: relative; overflow: hidden;
  }
  .contact-left-title {
    font-family: 'Fredoka One', cursive;
    font-size: 1.8rem; margin-bottom: 32px;
  }
  .contact-row {
    display: flex; align-items: flex-start; gap: 16px;
    margin-bottom: 24px;
  }
  .contact-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  .contact-detail-title {
    font-family: 'Nunito', sans-serif;
    font-weight: 800; font-size: 0.8rem;
    letter-spacing: 1px; text-transform: uppercase;
    color: var(--muted); margin-bottom: 4px;
  }
  .contact-detail-val {
    font-size: 0.95rem; line-height: 1.5;
  }
  .social-btns { display: flex; gap: 12px; margin-top: 32px; flex-wrap: wrap; }
  .social-btn {
    padding: 10px 20px;
    border-radius: 50px;
    font-family: 'Nunito', sans-serif;
    font-size: 0.8rem; font-weight: 800;
    text-decoration: none;
    display: inline-flex; align-items: center; gap: 6px;
    transition: opacity 0.2s;
  }
  .social-btn:hover { opacity: 0.8; }

  /* Glass form */
  .glass-form {
    background: var(--glass);
    border: 1px solid var(--glassBorder);
    border-radius: 24px;
    padding: 48px 40px;
    backdrop-filter: blur(16px);
  }
  .form-title { font-family: 'Fredoka One', cursive; font-size: 1.8rem; margin-bottom: 8px; }
  .form-sub { font-size: 0.9rem; color: var(--muted); margin-bottom: 32px; }
  .form-group { margin-bottom: 20px; }
  .form-label {
    display: block;
    font-family: 'Nunito', sans-serif;
    font-size: 0.75rem; font-weight: 800;
    letter-spacing: 1px; text-transform: uppercase;
    color: var(--muted); margin-bottom: 8px;
  }
  .form-input, .form-select, .form-textarea {
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--glassBorder);
    border-radius: 12px;
    padding: 14px 18px;
    color: var(--white);
    font-family: 'Lato', sans-serif;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color: var(--teal);
    box-shadow: 0 0 0 3px rgba(0,212,200,0.1);
  }
  .form-select option { background: var(--navy2); }
  .form-textarea { resize: vertical; min-height: 120px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* Map strip */
  .map-strip {
    margin: 0 40px 60px;
    background: var(--glass);
    border: 1px solid var(--glassBorder);
    border-radius: 24px;
    padding: 48px 60px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 40px;
    overflow: hidden;
    position: relative;
  }
  .map-strip::before {
    content: '📍';
    position: absolute; right: 60px; top: 50%;
    transform: translateY(-50%);
    font-size: 10rem; opacity: 0.05;
    pointer-events: none;
  }
  .map-address { font-size: 0.9rem; color: var(--muted); margin-top: 8px; line-height: 1.6; }
  .map-title { font-family: 'Fredoka One', cursive; font-size: 1.8rem; margin-bottom: 8px; }

  /* Footer */
  footer {
    position: relative;
    background: #060e1a;
    padding: 60px 40px 30px;
    border-top: 1px solid transparent;
  }
  footer::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--teal), var(--gold), var(--pink), var(--violet), transparent);
  }
  .footer-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; justify-content: space-between; align-items: flex-start;
    gap: 40px; flex-wrap: wrap;
    margin-bottom: 40px;
  }
  .footer-logo { font-family: 'Fredoka One', cursive; font-size: 1.8rem; }
  .footer-tagline { font-style: italic; color: var(--muted); font-size: 0.9rem; margin-top: 6px; }
  .footer-links { display: flex; flex-direction: column; gap: 10px; }
  .footer-link {
    color: var(--muted); font-family: 'Nunito', sans-serif;
    font-size: 0.85rem; font-weight: 700;
    background: none; border: none; text-align: left;
    transition: color 0.2s;
  }
  .footer-link:hover { color: var(--teal); }
  .footer-bottom {
    text-align: center;
    font-size: 0.8rem; color: var(--muted);
    border-top: 1px solid var(--glassBorder); padding-top: 24px;
  }

  /* Canvas bg */
  .particle-canvas {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    z-index: 1;
  }

  /* Animations */
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .anim-in { animation: fadeSlideIn 0.6s ease both; }
  .anim-left { animation: slideInLeft 0.6s ease both; }
  .anim-right { animation: slideInRight 0.6s ease both; }
  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.3s; }
  .delay-4 { animation-delay: 0.4s; }
  .delay-5 { animation-delay: 0.5s; }
  .delay-6 { animation-delay: 0.6s; }

  /* Success state */
  .success-state {
    text-align: center; padding: 60px 20px;
  }
  .success-emoji { font-size: 4rem; margin-bottom: 16px; display: block; }
  .success-title { font-family: 'Fredoka One', cursive; font-size: 2rem; margin-bottom: 12px; color: var(--teal); }

  @media (max-width: 1024px) {
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .values-grid { grid-template-columns: repeat(2, 1fr); }
    .masonry { columns: 2; }
    .about-grid { grid-template-columns: 1fr; }
    .contact-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .navbar { padding: 16px 20px; }
    .nav-tabs { display: none; }
    .nav-phone { font-size: 0.8rem; }
    .mobile-bar { display: flex; }
    .hero { padding: 100px 20px 100px; }
    .section { padding: 60px 20px; }
    .cta-banner { margin: 40px 20px; padding: 48px 24px; }
    .map-strip { margin: 0 20px 40px; flex-direction: column; padding: 36px 28px; text-align: center; }
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .values-grid { grid-template-columns: repeat(2, 1fr); }
    .masonry { columns: 1; }
    .form-row { grid-template-columns: 1fr; }
    .orb1, .orb2, .orb3 { width: 250px; height: 250px; }
    footer { padding-bottom: 90px; }
  }
`;

// ── Particle Canvas ───────────────────────────────────────────
function ParticleCanvas({ colors = ["#00D4C8", "#FFD166", "#FF6B9D", "#7C3AED"] }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.6 + 0.2,
      oDir: Math.random() > 0.5 ? 1 : -1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        p.opacity += p.oDir * 0.005;
        if (p.opacity > 0.8 || p.opacity < 0.1) p.oDir *= -1;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particles[i].color;
            ctx.globalAlpha = (1 - dist / 100) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" style={{ pointerEvents: "none" }} />;
}

// ── Magnetic Button ───────────────────────────────────────────
function MagBtn({ children, variant = "primary", onClick, href, style = {} }) {
  const ref = useRef(null);
  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    el.style.transform = `translate(${(e.clientX - cx) * 0.2}px, ${(e.clientY - cy) * 0.2}px)`;
  }, []);
  const handleLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }, []);

  const cls = `mag-btn mag-btn-${variant}`;
  const props = { ref, className: cls, onMouseMove: handleMove, onMouseLeave: handleLeave, style };

  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
  return <button onClick={onClick} {...props}>{children}</button>;
}

// ── Tilt Card ─────────────────────────────────────────────────
function TiltCard({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -10;
    const rotY = ((x - cx) / cx) * 10;
    el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    el.style.boxShadow = `${-rotY * 2}px ${rotX * 2}px 40px rgba(0,0,0,0.4)`;
  };
  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    el.style.boxShadow = "none";
  };
  return (
    <div ref={ref} className={`tilt-card ${className}`} style={style} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </div>
  );
}

// ── Counter ───────────────────────────────────────────────────
function Counter({ to, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const duration = 1800;
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * to));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

// ── Ribbon ────────────────────────────────────────────────────
function Ribbon({ items, gradient, speed = 30 }) {
  const doubled = [...items, ...items];
  return (
    <div className="ribbon-wrap">
      <div className="ribbon-track" style={{ animationDuration: `${speed}s` }}>
        {doubled.map((item, i) => (
          <span key={i} className="ribbon-item" style={{ color: gradient[i % gradient.length] }}>
            {item}
            <span className="ribbon-dot" style={{ background: gradient[i % gradient.length] }} />
          </span>
        ))}
      </div>
    </div>
  );
}

// ── DATA ──────────────────────────────────────────────────────
const SERVICES = [
  { emoji: "🪥", name: "Preventive Dentistry", cat: "Prevention", desc: "Regular cleanings, fluoride treatments, sealants and oral hygiene education to build healthy habits from day one.", badge: "RECOMMENDED", badgeColor: "#00D4C8", bg: "linear-gradient(135deg, #0f2a3d, #1a3a4a)", price: "Contact for Pricing" },
  { emoji: "🦷", name: "Restorative Dentistry", cat: "Restoration", desc: "Gentle white crowns and minimally-invasive fillings that restore your child's smile with precision and care.", badge: "POPULAR", badgeColor: "#FFD166", bg: "linear-gradient(135deg, #1a1a0f, #2a2a10)", price: "Contact for Pricing" },
  { emoji: "✨", name: "Cosmetic Dentistry", cat: "Aesthetics", desc: "Natural-looking cosmetic solutions to boost confidence and give every child a beautiful, radiant smile.", badge: "TRENDING", badgeColor: "#FF6B9D", bg: "linear-gradient(135deg, #2a0f1f, #3a1030)", price: "Contact for Pricing" },
  { emoji: "🚨", name: "Emergency Dentistry", cat: "Urgent Care", desc: "Same-day emergency appointments for toothaches, knocked-out teeth, and unexpected dental injuries.", badge: "24HR READY", badgeColor: "#ef4444", bg: "linear-gradient(135deg, #2a0a0a, #3d1010)", price: "Contact for Pricing" },
  { emoji: "🔬", name: "Laser Dentistry", cat: "Advanced Tech", desc: "State-of-the-art laser treatments that are faster, gentler, and more precise — no drills, less anxiety.", badge: "ADVANCED", badgeColor: "#7C3AED", bg: "linear-gradient(135deg, #1a0a2e, #250f40)", price: "Contact for Pricing" },
  { emoji: "😴", name: "Sedation Dentistry", cat: "Comfort Care", desc: "Safe and effective sedation options to make every visit completely stress-free for even the most anxious kids.", badge: "COMFORT+", badgeColor: "#00D4C8", bg: "linear-gradient(135deg, #0a1f2a, #0f2e3a)", price: "Contact for Pricing" },
  { emoji: "💛", name: "Special Needs Dentistry", cat: "Inclusive Care", desc: "Specialized, compassionate care for children with autism, sensory needs, anxiety, and developmental challenges.", badge: "INCLUSIVE", badgeColor: "#FFD166", bg: "linear-gradient(135deg, #1f1a0a, #2e260f)", price: "Contact for Pricing" },
  { emoji: "👅", name: "Lip & Tongue Tie Treatment", cat: "Frenectomy", desc: "Gentle laser-assisted frenectomies that improve feeding, speech, and long-term oral comfort.", badge: "LASER TECH", badgeColor: "#FF6B9D", bg: "linear-gradient(135deg, #2a0a15, #3d1020)", price: "Contact for Pricing" },
  { emoji: "💧", name: "Silver Diamine Fluoride", cat: "Non-Invasive", desc: "A quick, painless liquid treatment that stops cavities in their tracks without any drilling or anesthesia.", badge: "PAIN-FREE", badgeColor: "#7C3AED", bg: "linear-gradient(135deg, #15102a, #1f183e)", price: "Contact for Pricing" },
  { emoji: "📋", name: "Wellness Plans", cat: "Membership", desc: "Customized annual savings plans tailored to each child's unique dental needs and family budget.", badge: "SAVE MORE", badgeColor: "#00D4C8", bg: "linear-gradient(135deg, #0a2018, #0f3025)", price: "From $199/yr" },
];

const RIBBON_ITEMS = ["Preventive Care", "Laser Dentistry", "Sedation", "Tongue Tie", "Emergency Care", "Cosmetic Smiles", "Special Needs", "Silver Diamine", "Restorative", "Wellness Plans"];
const RIBBON_COLORS = ["#00D4C8", "#FFD166", "#FF6B9D", "#7C3AED", "#00D4C8"];

const TESTIMONIALS = [
  { text: "All three of my kids have been coming here since they were babies. Now ages 3, 6, and 10 — they absolutely love it! The staff is incredibly friendly, precise, and they never keep you waiting. I couldn't be happier.", name: "Monica B.", city: "Frisco, TX", stars: 5 },
  { text: "We love Sheer Smiles so much. Every single visit has been excellent without exception. The whole team is warm, welcoming, and so incredibly gentle and sweet with the kids. 100% recommend to every family.", name: "Sarah K.", city: "Frisco, TX", stars: 5 },
  { text: "My two little ones are always excited when it's time for the dentist — and that says everything! The atmosphere is magical, the doctors are brilliant, and they truly make every child feel like a VIP.", name: "Amanda T.", city: "McKinney, TX", stars: 5 },
];

const GALLERY_ITEMS = [
  { emoji: "🦷", name: "Preventive Cleanings", cat: "Prevention", bg: "linear-gradient(135deg, #0f2a3d, #1a3a4a)", bar: "#00D4C8", h: 220 },
  { emoji: "✨", name: "Smile Makeovers", cat: "Cosmetic", bg: "linear-gradient(135deg, #2a0f1f, #3a1030)", bar: "#FF6B9D", h: 280 },
  { emoji: "🔬", name: "Laser Treatments", cat: "Advanced Tech", bg: "linear-gradient(135deg, #1a0a2e, #250f40)", bar: "#7C3AED", h: 200 },
  { emoji: "😴", name: "Sedation Visits", cat: "Comfort", bg: "linear-gradient(135deg, #0a1f2a, #0f2e3a)", bar: "#00D4C8", h: 260 },
  { emoji: "💛", name: "Special Needs Care", cat: "Inclusive", bg: "linear-gradient(135deg, #1f1a0a, #2e260f)", bar: "#FFD166", h: 220 },
  { emoji: "👅", name: "Tongue Tie Releases", cat: "Frenectomy", bg: "linear-gradient(135deg, #2a0a15, #3d1020)", bar: "#FF6B9D", h: 240 },
  { emoji: "🚨", name: "Emergency Care", cat: "Urgent", bg: "linear-gradient(135deg, #2a0a0a, #3d1010)", bar: "#ef4444", h: 200 },
  { emoji: "💧", name: "Silver Diamine", cat: "Non-Invasive", bg: "linear-gradient(135deg, #15102a, #1f183e)", bar: "#7C3AED", h: 280 },
  { emoji: "📋", name: "Wellness Plans", cat: "Membership", bg: "linear-gradient(135deg, #0a2018, #0f3025)", bar: "#00D4C8", h: 220 },
];

const TABS = [
  { id: "home", label: "Welcome", icon: "🏠" },
  { id: "treatments", label: "Treatments", icon: "🦷" },
  { id: "about", label: "Our Story", icon: "💛" },
  { id: "gallery", label: "Smile Gallery", icon: "✨" },
  { id: "contact", label: "Book a Visit", icon: "📅" },
];

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  const [prevTab, setPrevTab] = useState(null);
  const [exiting, setExiting] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [formData, setFormData] = useState({ name: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const switchTab = useCallback((id) => {
    if (id === tab) return;
    setExiting(true);
    setTimeout(() => {
      setPrevTab(tab);
      setTab(id);
      setExiting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 220);
  }, [tab]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Custom cursor */}
      <div className="cursor" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="cursor-ring" style={{ left: cursorPos.x, top: cursorPos.y }} />

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <button onClick={() => switchTab("home")} className="nav-logo" style={{ background: "none", border: "none" }}>
          🦷 Sheer Smiles
        </button>
        <div className="nav-tabs">
          {TABS.map((t) => (
            <button key={t.id} className={`nav-tab ${tab === t.id ? "active" : ""}`} onClick={() => switchTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <a className="nav-phone" href="tel:9729870787">(972) 987-0787</a>
      </nav>

      {/* Page content */}
      <div className={exiting ? "page-exit" : "page"}>
        {tab === "home" && <HomePage switchTab={switchTab} />}
        {tab === "treatments" && <TreatmentsPage switchTab={switchTab} />}
        {tab === "about" && <AboutPage />}
        {tab === "gallery" && <GalleryPage />}
        {tab === "contact" && (
          <ContactPage
            formData={formData}
            setFormData={setFormData}
            submitted={submitted}
            handleSubmit={handleSubmit}
          />
        )}
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-inner">
          <div>
            <div className="footer-logo nav-logo">🦷 Sheer Smiles</div>
            <div className="footer-tagline">Where Kids Fall in Love with Their Smile</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.75rem", letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>Navigate</div>
            <div className="footer-links">
              {TABS.map((t) => (
                <button key={t.id} className="footer-link" onClick={() => switchTab(t.id)}>{t.label}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.75rem", letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>Contact</div>
            <div style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.8 }}>
              2626 Stonebrook Pkwy, Suite 200<br />
              Frisco, TX 75034<br />
              <a href="tel:9729870787" style={{ color: "var(--teal)", textDecoration: "none" }}>(972) 987-0787</a><br />
              <a href="mailto:info@sheersmileskids.com" style={{ color: "var(--teal)", textDecoration: "none" }}>info@sheersmileskids.com</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © 2024 Sheer Smiles Pediatric Dentistry · Frisco, TX · All rights reserved.
        </div>
      </footer>

      {/* Mobile bottom bar */}
      <div className="mobile-bar">
        {TABS.map((t) => (
          <button key={t.id} className={`mobile-tab ${tab === t.id ? "active" : ""}`} onClick={() => switchTab(t.id)}>
            <span className="mobile-tab-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
    </>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────
function HomePage({ switchTab }) {
  return (
    <>
      <div className="hero">
        <ParticleCanvas />
        <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
        <span className="floating-icon fi1">🦷</span>
        <span className="floating-icon fi2">✨</span>
        <span className="floating-icon fi3">😁</span>
        <span className="floating-icon fi4">🪥</span>

        <div className="hero-content">
          <div className="badge-since">
            <span className="badge-dot" /> Since 2010 · Frisco, TX · Board-Certified Specialists
          </div>
          <h1 className="hero-title">
            Where Kids Love<br />
            <span className="shimmer-word">Their Dentist</span>
          </h1>
          <p className="hero-tagline">
            Fun, gentle, and expert pediatric dental care — because every smile is worth celebrating.
          </p>
          <div className="hero-btns">
            <MagBtn variant="primary" onClick={() => switchTab("treatments")}>🦷 Explore Treatments</MagBtn>
            <MagBtn variant="secondary" href="https://maps.google.com/?q=2626+Stonebrook+Pkwy+Suite+200+Frisco+TX+75034">📍 Visit Us</MagBtn>
          </div>

          <div className="stats-row">
            {[
              { num: 4, suffix: ".9★", label: "Google Rating" },
              { num: 10, suffix: "+", label: "Services Offered" },
              { num: 100, suffix: "%", label: "Recommend Us" },
              { num: 3, suffix: " Docs", label: "Board-Certified" },
            ].map((s, i) => (
              <div className="stat-cell" key={i}>
                <div className="stat-num"><Counter to={s.num} suffix={s.suffix} /></div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Ribbon items={RIBBON_ITEMS} gradient={RIBBON_COLORS} />

      {/* Featured Treatments */}
      <div className="section">
        <div className="section-label">Featured Treatments</div>
        <h2 className="section-title">Care Designed for Every Child</h2>
        <p className="section-sub">From routine check-ups to advanced laser procedures, we offer a complete range of pediatric dental services in a fun, safe environment.</p>
        <div className="cards-grid">
          {SERVICES.slice(0, 3).map((s, i) => (
            <TiltCard key={i} className="service-card anim-in" style={{ background: s.bg, animationDelay: `${i * 0.12}s` }}>
              <span className="card-emoji">{s.emoji}</span>
              <span className="card-badge" style={{ background: `${s.badgeColor}22`, color: s.badgeColor }}>{s.badge}</span>
              <div className="card-name">{s.name}</div>
              <div className="card-cat">{s.cat}</div>
              <p className="card-desc">{s.desc}</p>
              <div className="card-price" style={{ color: s.badgeColor }}>{s.price}</div>
              <MagBtn variant="secondary" onClick={() => switchTab("treatments")}>Learn More →</MagBtn>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="section">
        <div className="section-label">Happy Families</div>
        <h2 className="section-title">What Parents Are Saying</h2>
        <p className="section-sub">Real stories from real Frisco families who trust Sheer Smiles with their children's smiles.</p>
        <div className="cards-grid">
          {TESTIMONIALS.map((t, i) => (
            <TiltCard key={i} className={`test-card anim-in delay-${i + 1}`}>
              <div className="test-quote" style={{ color: ["#00D4C8", "#FFD166", "#FF6B9D"][i] }}>"</div>
              <div className="stars">{"★".repeat(t.stars)}</div>
              <p className="test-text">{t.text}</p>
              <div className="test-name" style={{ color: ["#00D4C8", "#FFD166", "#FF6B9D"][i] }}>{t.name}</div>
              <div className="test-meta">{t.city}</div>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="section">
        <div className="section-label">How It Works</div>
        <h2 className="section-title">Your Child's Journey to a Healthy Smile</h2>
        <div className="process-grid">
          {[
            { n: "01", emoji: "📞", title: "Book an Appointment", desc: "Call us, email, or walk in. We'll find a time that works perfectly for your family's schedule." },
            { n: "02", emoji: "🎉", title: "Fun First Visit", desc: "Your child is welcomed into our colorful, child-friendly clinic designed to turn nerves into excitement." },
            { n: "03", emoji: "🔬", title: "Expert Exam & Care", desc: "Dr. Justin or Dr. Sage performs a thorough, gentle exam using the latest technology." },
            { n: "04", emoji: "😁", title: "Leave With a Bigger Smile", desc: "Your child leaves confident, educated, and actually looking forward to their next visit." },
          ].map((step, i) => (
            <div key={i} className={`process-step anim-in delay-${i + 1}`}>
              <div className="process-num">{step.n}</div>
              <span className="process-emoji">{step.emoji}</span>
              <div className="process-title">{step.title}</div>
              <p className="process-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="cta-banner">
        <h2 className="cta-title">Ready to Transform Your Child's Smile? 🦷</h2>
        <p className="cta-sub">
          2626 Stonebrook Pkwy, Suite 200, Frisco TX · (972) 987-0787
        </p>
        <div className="cta-btns">
          <MagBtn variant="gold" onClick={() => switchTab("contact")}>📅 Book a Visit Today</MagBtn>
          <MagBtn variant="secondary" href="tel:9729870787">📞 Call Now</MagBtn>
        </div>
      </div>
    </>
  );
}

// ── TREATMENTS PAGE ───────────────────────────────────────────
function TreatmentsPage({ switchTab }) {
  return (
    <>
      <div className="hero" style={{ minHeight: "50vh" }}>
        <ParticleCanvas colors={["#7C3AED", "#00D4C8", "#FF6B9D"]} />
        <div className="orb orb1" /><div className="orb orb2" />
        <div className="hero-content">
          <div className="badge-since"><span className="badge-dot" /> 10 Specialized Services</div>
          <h1 className="hero-title"><span className="shimmer-word">Treatments</span><br />Built for Kids</h1>
          <p className="hero-tagline">Comprehensive pediatric dental care — preventive, restorative, cosmetic, and beyond.</p>
        </div>
      </div>

      <Ribbon items={RIBBON_ITEMS} gradient={["#7C3AED", "#FF6B9D", "#00D4C8", "#FFD166"]} speed={25} />

      <div className="section">
        <div className="section-label">All Services</div>
        <h2 className="section-title">Everything Your Child Needs</h2>
        <p className="section-sub">Board-certified specialists offering the full spectrum of pediatric dentistry — always with a smile.</p>
        <div className="cards-grid">
          {SERVICES.map((s, i) => (
            <TiltCard key={i} className={`service-card anim-in`} style={{ background: s.bg, animationDelay: `${(i % 3) * 0.12}s` }}>
              <span className="card-emoji">{s.emoji}</span>
              <span className="card-badge" style={{ background: `${s.badgeColor}22`, color: s.badgeColor }}>{s.badge}</span>
              <div className="card-name">{s.name}</div>
              <div className="card-cat">{s.cat}</div>
              <p className="card-desc">{s.desc}</p>
              <div className="card-price" style={{ color: s.badgeColor }}>{s.price}</div>
              <MagBtn variant="secondary" onClick={() => switchTab("contact")}>Book Now →</MagBtn>
            </TiltCard>
          ))}
        </div>
      </div>

      <div className="cta-banner" style={{ background: "linear-gradient(135deg, #0f1f3d, #00D4C844 100%)" }}>
        <h2 className="cta-title">Not Sure Which Treatment? We'll Guide You 💛</h2>
        <p className="cta-sub">Our specialists will evaluate your child and create a personalized care plan. No pressure, just honest guidance.</p>
        <div className="cta-btns">
          <MagBtn variant="primary" onClick={() => switchTab("contact")}>📅 Free Consultation</MagBtn>
        </div>
      </div>
    </>
  );
}

// ── ABOUT PAGE ────────────────────────────────────────────────
function AboutPage() {
  return (
    <>
      <div className="hero" style={{ minHeight: "50vh" }}>
        <ParticleCanvas colors={["#FFD166", "#00D4C8", "#7C3AED"]} />
        <div className="orb orb2" /><div className="orb orb3" />
        <div className="hero-content">
          <div className="badge-since"><span className="badge-dot" /> Serving Frisco Families Since 2010</div>
          <h1 className="hero-title">Our <span className="shimmer-word">Story</span></h1>
          <p className="hero-tagline">A clinic built on one belief: every child deserves to love going to the dentist.</p>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 40 }}>
        <div className="about-grid">
          <div className="about-left anim-left">
            <ParticleCanvas colors={["#00D4C8", "#7C3AED"]} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div className="about-bg-year">2010</div>
              <div className="est-badge">EST. 2010</div>
              <div className="about-left-title">Where Smiles Are Born ✨</div>
              <div className="about-left-stats">
                {[
                  { n: 14, s: "+", l: "Years Serving" },
                  { n: 4, s: ".9★", l: "Google Rating" },
                  { n: 100, s: "%", l: "Recommend" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="about-stat-num"><Counter to={s.n} suffix={s.s} /></div>
                    <div className="about-stat-lbl">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="about-right anim-right">
            <h2>Dedicated to <span className="shimmer-word">Kids</span> Above All Else</h2>
            <p className="about-para">
              Sheer Smiles Pediatric Dentistry was founded with a single mission: to transform the way children experience dental care. We believe that a positive early experience at the dentist shapes a lifetime of healthy oral habits. That's why every element of our clinic — from the friendly faces at the front desk to the ceiling-mounted TVs in every bay — is designed with your child's comfort in mind.
            </p>
            <p className="about-para">
              Led by Dr. Justin Chan and Dr. Sage Yoo, our board-certified pediatric dental specialists bring years of post-graduate training focused specifically on children, including those with anxiety, autism, and special needs. We've made it our goal to ensure that children of all backgrounds and abilities receive the highest quality dental care in Frisco, TX.
            </p>
            <div className="features-grid">
              {[
                { emoji: "🏆", title: "Board-Certified Specialists", desc: "Dr. Justin & Dr. Sage hold the highest pediatric dental certifications." },
                { emoji: "🔬", title: "Latest Technology", desc: "Laser dentistry, digital X-rays, and minimally-invasive techniques." },
                { emoji: "💛", title: "Special Needs Expertise", desc: "Trained to care for children with anxiety, autism, and sensory challenges." },
                { emoji: "💰", title: "Affordable Wellness Plans", desc: "Customized membership plans that work within any family's budget." },
              ].map((f, i) => (
                <div key={i} className="feature-card">
                  <span className="feature-emoji">{f.emoji}</span>
                  <div className="feature-title" style={{ color: ["#00D4C8","#FFD166","#FF6B9D","#7C3AED"][i] }}>{f.title}</div>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 80 }}>
          <div className="section-label">Our Values</div>
          <h2 className="section-title">What We Stand For</h2>
          <div className="values-grid">
            {[
              { icon: "🛡️", name: "Safety First", desc: "Every procedure follows the strictest sterilization and safety protocols for complete peace of mind.", color: "#00D4C8" },
              { icon: "😂", name: "Make It Fun", desc: "We transform dental visits into adventures — because a child who laughs at the dentist comes back.", color: "#FFD166" },
              { icon: "🤝", name: "Honest Care", desc: "We give you clear, unbiased treatment plans — no upselling, just what your child truly needs.", color: "#FF6B9D" },
              { icon: "🌟", name: "Excellence Always", desc: "We commit to the highest standard of clinical quality in every cleaning, filling, and crown we place.", color: "#7C3AED" },
            ].map((v, i) => (
              <div key={i} className="value-card" style={{ borderTop: `3px solid ${v.color}` }}>
                <span className="value-icon">{v.icon}</span>
                <div className="value-name" style={{ color: v.color }}>{v.name}</div>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── GALLERY PAGE ──────────────────────────────────────────────
function GalleryPage() {
  return (
    <>
      <div className="hero" style={{ minHeight: "50vh" }}>
        <ParticleCanvas colors={["#FF6B9D", "#FFD166", "#00D4C8"]} />
        <div className="orb orb1" /><div className="orb orb3" />
        <div className="hero-content">
          <div className="badge-since"><span className="badge-dot" /> Every Smile Tells a Story</div>
          <h1 className="hero-title"><span className="shimmer-word">Smile</span> Gallery</h1>
          <p className="hero-tagline">A showcase of the services, procedures, and moments that make Sheer Smiles special.</p>
        </div>
      </div>

      <Ribbon items={RIBBON_ITEMS} gradient={["#FF6B9D", "#FFD166", "#7C3AED", "#00D4C8"]} speed={20} />

      <div className="section">
        <div className="section-label">Our Work</div>
        <h2 className="section-title">Services We're Proud Of</h2>
        <p className="section-sub">A visual showcase of the treatments and care that define the Sheer Smiles experience.</p>
        <div className="masonry">
          {GALLERY_ITEMS.map((g, i) => (
            <div key={i} className="masonry-item">
              <TiltCard>
                <div className="gallery-card" style={{ background: g.bg, minHeight: g.h }}>
                  <span className="gallery-card-emoji">{g.emoji}</span>
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ fontSize: "0.7rem", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 6, fontFamily: "'Nunito',sans-serif", fontWeight: 700 }}>{g.cat}</div>
                    <div className="gallery-card-name">{g.name}</div>
                    <div className="gallery-bar" style={{ background: `linear-gradient(90deg, ${g.bar}, transparent)` }} />
                  </div>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-banner" style={{ background: "linear-gradient(135deg, #1a0a2e, #0f2a3d)" }}>
        <h2 className="cta-title">Follow Our Journey 📸</h2>
        <p className="cta-sub">See the smiles we create every day on our social media pages.</p>
        <div className="cta-btns">
          <MagBtn variant="primary" href="https://www.instagram.com/sheersmileskids/">📷 Instagram @sheersmileskids</MagBtn>
          <MagBtn variant="secondary" href="https://www.facebook.com/sheersmileskids/">👍 Facebook Page</MagBtn>
        </div>
      </div>
    </>
  );
}

// ── CONTACT PAGE ──────────────────────────────────────────────
function ContactPage({ formData, setFormData, submitted, handleSubmit }) {
  return (
    <>
      <div className="hero" style={{ minHeight: "50vh" }}>
        <ParticleCanvas colors={["#00D4C8", "#7C3AED", "#FFD166"]} />
        <div className="orb orb1" /><div className="orb orb2" />
        <div className="hero-content">
          <div className="badge-since"><span className="badge-dot" /> Mon–Fri Open · Sat by Appointment</div>
          <h1 className="hero-title">Book a <span className="shimmer-word">Visit</span></h1>
          <p className="hero-tagline">Get in touch and let's schedule the best dental experience your child has ever had.</p>
        </div>
      </div>

      <div className="section">
        <div className="contact-grid">
          <div className="contact-left anim-left">
            <ParticleCanvas colors={["#00D4C8", "#7C3AED"]} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div className="contact-left-title">🦷 Sheer Smiles Dental</div>
              {[
                { icon: "📍", color: "#00D4C8", bg: "#00D4C822", title: "Address", val: "2626 Stonebrook Pkwy, Suite 200\nFrisco, TX 75034" },
                { icon: "📞", color: "#FFD166", bg: "#FFD16622", title: "Phone", val: "(972) 987-0787" },
                { icon: "⏰", color: "#FF6B9D", bg: "#FF6B9D22", title: "Hours", val: "Mon–Thu: 8:30am–5pm\nFri: 8am–3pm · Sat: 9am–2pm" },
                { icon: "✉️", color: "#7C3AED", bg: "#7C3AED22", title: "Email", val: "info@sheersmileskids.com" },
              ].map((r, i) => (
                <div key={i} className="contact-row">
                  <div className="contact-icon" style={{ background: r.bg, color: r.color }}>{r.icon}</div>
                  <div>
                    <div className="contact-detail-title">{r.title}</div>
                    <div className="contact-detail-val" style={{ whiteSpace: "pre-line" }}>{r.val}</div>
                  </div>
                </div>
              ))}
              <div className="social-btns">
                <a className="social-btn" href="https://www.instagram.com/sheersmileskids/" target="_blank" rel="noopener noreferrer" style={{ background: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)", color: "#fff" }}>📷 Instagram</a>
                <a className="social-btn" href="https://www.facebook.com/sheersmileskids/" target="_blank" rel="noopener noreferrer" style={{ background: "#1877f2", color: "#fff" }}>👍 Facebook</a>
              </div>
            </div>
          </div>

          <div className="glass-form anim-right">
            {submitted ? (
              <div className="success-state">
                <span className="success-emoji">🎉</span>
                <div className="success-title">Message Sent!</div>
                <p style={{ color: "var(--muted)", marginBottom: 24, lineHeight: 1.7 }}>
                  Thank you! Our team will be in touch shortly. You can also call us directly at{" "}
                  <a href="tel:9729870787" style={{ color: "var(--teal)", fontWeight: 700 }}>(972) 987-0787</a>.
                </p>
                <MagBtn variant="primary" onClick={() => window.location.reload()}>Send Another Message</MagBtn>
              </div>
            ) : (
              <>
                <div className="form-title">Request an Appointment</div>
                <p className="form-sub">Fill in your details and we'll reach out to confirm your child's visit.</p>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Parent/Guardian Name</label>
                    <input className="form-input" placeholder="Jane Smith" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" placeholder="(972) 000-0000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Service of Interest</label>
                  <select className="form-select" value={formData.service} onChange={e => setFormData({ ...formData, service: e.target.value })}>
                    <option value="">Select a treatment...</option>
                    {SERVICES.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-textarea" placeholder="Tell us about your child and any concerns..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                </div>
                <MagBtn variant="primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleSubmit}>
                  ✨ Send Request
                </MagBtn>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map strip */}
      <div className="map-strip">
        <div>
          <div className="map-title">Find Us in Frisco 📍</div>
          <p className="map-address">
            2626 Stonebrook Pkwy, Suite 200<br />
            Frisco, TX 75034<br />
            Mon–Thu 8:30am–5pm · Fri 8am–3pm · Sat 9am–2pm
          </p>
        </div>
        <MagBtn variant="gold" href="https://maps.google.com/?q=2626+Stonebrook+Pkwy+Suite+200+Frisco+TX+75034">
          🗺️ Open Google Maps
        </MagBtn>
      </div>
    </>
  );
}