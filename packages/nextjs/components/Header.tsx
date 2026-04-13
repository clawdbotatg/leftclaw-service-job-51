"use client";

import React from "react";
import Link from "next/link";

export const Header = () => {
  return (
    <div
      className="sticky top-0 z-20 w-full"
      style={{
        background: "rgba(10, 10, 15, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(139, 26, 26, 0.2)",
      }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <span className="text-2xl animate-lobster-glow" role="img" aria-label="lobster claw">
            <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M32 8C18 8 12 20 12 32C12 44 20 56 32 56C44 56 52 44 52 32C52 20 46 8 32 8Z"
                fill="#8B1A1A"
                opacity="0.3"
              />
              <path
                d="M20 28C16 20 10 18 8 22C6 26 12 34 18 32L20 28Z"
                fill="#C41E3A"
                stroke="#8B1A1A"
                strokeWidth="1"
              />
              <path
                d="M44 28C48 20 54 18 56 22C58 26 52 34 46 32L44 28Z"
                fill="#C41E3A"
                stroke="#8B1A1A"
                strokeWidth="1"
              />
              <path
                d="M24 24C22 18 18 14 16 16C14 18 18 26 24 28L24 24Z"
                fill="#C41E3A"
                stroke="#8B1A1A"
                strokeWidth="0.5"
              />
              <path
                d="M40 24C42 18 46 14 48 16C50 18 46 26 40 28L40 24Z"
                fill="#C41E3A"
                stroke="#8B1A1A"
                strokeWidth="0.5"
              />
              <ellipse cx="32" cy="36" rx="10" ry="12" fill="#8B1A1A" />
              <ellipse cx="32" cy="34" rx="8" ry="9" fill="#C41E3A" opacity="0.6" />
              <circle cx="28" cy="30" r="2" fill="#F5E6E0" opacity="0.8" />
              <circle cx="36" cy="30" r="2" fill="#F5E6E0" opacity="0.8" />
              <circle cx="28" cy="30" r="1" fill="#0a0a0f" />
              <circle cx="36" cy="30" r="1" fill="#0a0a0f" />
            </svg>
          </span>
          <span
            className="text-xl font-bold tracking-wide"
            style={{ color: "#F5E6E0", fontFamily: "var(--font-inter), sans-serif" }}
          >
            CLAWD
          </span>
        </Link>
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: "rgba(245, 230, 224, 0.4)", fontFamily: "var(--font-inter), sans-serif" }}
        >
          Token Dashboard
        </span>
      </div>
    </div>
  );
};
