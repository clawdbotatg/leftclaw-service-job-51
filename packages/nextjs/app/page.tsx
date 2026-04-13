"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NextPage } from "next";

const CLAWD_ADDRESS = "0x9f86dB9fc6f7c9408e8Fda3Ff8ce4e78ac7a6b07";
const BASESCAN_URL = `https://basescan.org/token/${CLAWD_ADDRESS}`;
const DEXSCREENER_API = `https://api.dexscreener.com/latest/dex/tokens/${CLAWD_ADDRESS}`;

type PriceData = {
  priceUsd: string;
  priceChange24h: number;
  pairAddress: string;
} | null;

const formatPrice = (priceStr: string): string => {
  const price = parseFloat(priceStr);
  if (price === 0) return "$0.00";
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  if (price >= 0.0001) return `$${price.toFixed(6)}`;
  // For very small prices, show significant digits
  const str = price.toFixed(20);
  const match = str.match(/^0\.(0*)/);
  if (match) {
    const leadingZeros = match[1].length;
    const sigDigits = 4;
    return `$${price.toFixed(leadingZeros + sigDigits)}`;
  }
  return `$${price.toFixed(8)}`;
};

const Home: NextPage = () => {
  const [priceData, setPriceData] = useState<PriceData>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPrice = useCallback(async () => {
    try {
      const res = await fetch(DEXSCREENER_API);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const pairs = data.pairs;
      if (!pairs || pairs.length === 0) {
        setError(true);
        setPriceData(null);
        return;
      }
      // Filter to Base pairs only, pick highest liquidity
      const basePairs = pairs.filter((p: { chainId: string }) => p.chainId === "base");
      if (basePairs.length === 0) {
        setError(true);
        setPriceData(null);
        return;
      }
      const best = basePairs.reduce((a: { liquidity?: { usd?: number } }, b: { liquidity?: { usd?: number } }) =>
        (b.liquidity?.usd || 0) > (a.liquidity?.usd || 0) ? b : a,
      );
      setPriceData({
        priceUsd: best.priceUsd || "0",
        priceChange24h: best.priceChange?.h24 || 0,
        pairAddress: best.pairAddress || "",
      });
      setError(false);
    } catch {
      setError(true);
      setPriceData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrice();
    intervalRef.current = setInterval(fetchPrice, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchPrice]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CLAWD_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = CLAWD_ADDRESS;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isPositive = priceData ? priceData.priceChange24h >= 0 : false;

  return (
    <div
      className="flex flex-col items-center flex-1 px-4 py-8 md:py-16"
      style={{
        background: "radial-gradient(ellipse at 50% 20%, rgba(139, 26, 26, 0.08) 0%, transparent 60%), #0a0a0f",
        minHeight: "calc(100vh - 120px)",
      }}
    >
      {/* Main card */}
      <div
        className="w-full max-w-lg mx-auto mt-8 p-6 md:p-8 rounded-2xl"
        style={{
          background: "rgba(20, 8, 10, 0.6)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(139, 26, 26, 0.15)",
          boxShadow: "0 0 40px rgba(196, 30, 58, 0.08), 0 0 80px rgba(139, 26, 26, 0.04)",
        }}
      >
        {/* Lobster icon + title */}
        <div className="flex flex-col items-center mb-8">
          <div className="animate-lobster-glow mb-4">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M32 8C18 8 12 20 12 32C12 44 20 56 32 56C44 56 52 44 52 32C52 20 46 8 32 8Z"
                fill="#8B1A1A"
                opacity="0.3"
              />
              <path
                d="M20 28C16 20 10 18 8 22C6 26 12 34 18 32L20 28Z"
                fill="#C41E3A"
                stroke="#8B1A1A"
                strokeWidth="1.5"
              />
              <path
                d="M44 28C48 20 54 18 56 22C58 26 52 34 46 32L44 28Z"
                fill="#C41E3A"
                stroke="#8B1A1A"
                strokeWidth="1.5"
              />
              <path
                d="M24 24C22 18 18 14 16 16C14 18 18 26 24 28L24 24Z"
                fill="#C41E3A"
                stroke="#8B1A1A"
                strokeWidth="0.75"
              />
              <path
                d="M40 24C42 18 46 14 48 16C50 18 46 26 40 28L40 24Z"
                fill="#C41E3A"
                stroke="#8B1A1A"
                strokeWidth="0.75"
              />
              <ellipse cx="32" cy="36" rx="12" ry="14" fill="#8B1A1A" />
              <ellipse cx="32" cy="34" rx="9" ry="10" fill="#C41E3A" opacity="0.5" />
              <circle cx="27" cy="30" r="2.5" fill="#F5E6E0" opacity="0.8" />
              <circle cx="37" cy="30" r="2.5" fill="#F5E6E0" opacity="0.8" />
              <circle cx="27" cy="30" r="1.2" fill="#0a0a0f" />
              <circle cx="37" cy="30" r="1.2" fill="#0a0a0f" />
              <path d="M28 40C30 42 34 42 36 40" stroke="#F5E6E0" strokeWidth="0.8" opacity="0.4" fill="none" />
            </svg>
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold tracking-wider m-0"
            style={{ color: "#F5E6E0", fontFamily: "var(--font-inter), sans-serif" }}
          >
            CLAWD
          </h1>
          <p className="text-sm m-0 mt-1" style={{ color: "rgba(196, 30, 58, 0.6)" }}>
            Token on Base
          </p>
        </div>

        {/* Contract address */}
        <div className="mb-8">
          <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(245, 230, 224, 0.4)" }}>
            Contract Address
          </label>
          <div
            className="flex items-center gap-2 p-3 rounded-lg"
            style={{
              background: "rgba(10, 10, 15, 0.6)",
              border: "1px solid rgba(139, 26, 26, 0.2)",
            }}
          >
            <a
              href={BASESCAN_URL}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-xs md:text-sm break-all no-underline hover:opacity-80 transition-opacity"
              style={{ color: "#C41E3A", fontFamily: "var(--font-mono), monospace" }}
            >
              {CLAWD_ADDRESS}
            </a>
            <button
              onClick={handleCopy}
              className="shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: copied ? "rgba(74, 222, 128, 0.15)" : "rgba(139, 26, 26, 0.3)",
                color: copied ? "#4ade80" : "#F5E6E0",
                border: `1px solid ${copied ? "rgba(74, 222, 128, 0.3)" : "rgba(139, 26, 26, 0.3)"}`,
              }}
              title="Copy address to clipboard"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Price section */}
        <div className="text-center">
          <label className="block text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(245, 230, 224, 0.4)" }}>
            Live Price (USD)
          </label>

          {loading ? (
            <div className="flex justify-center items-center py-6">
              <div
                className="w-6 h-6 rounded-full animate-spin"
                style={{
                  border: "2px solid rgba(196, 30, 58, 0.2)",
                  borderTopColor: "#C41E3A",
                }}
              />
            </div>
          ) : error || !priceData ? (
            <div className="py-6">
              <p className="text-base m-0" style={{ color: "rgba(245, 230, 224, 0.5)" }}>
                Price unavailable
              </p>
            </div>
          ) : (
            <div className="py-2">
              <p
                className="text-4xl md:text-5xl font-bold m-0 mb-3 animate-price-glow"
                style={{
                  color: "#F5E6E0",
                  fontFamily: "var(--font-mono), monospace",
                }}
              >
                {formatPrice(priceData.priceUsd)}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span
                  className="text-lg font-semibold px-3 py-1 rounded-md"
                  style={{
                    color: isPositive ? "#4ade80" : "#C41E3A",
                    background: isPositive ? "rgba(74, 222, 128, 0.1)" : "rgba(196, 30, 58, 0.15)",
                    border: `1px solid ${isPositive ? "rgba(74, 222, 128, 0.2)" : "rgba(196, 30, 58, 0.3)"}`,
                    fontFamily: "var(--font-mono), monospace",
                  }}
                >
                  {isPositive ? "+" : ""}
                  {priceData.priceChange24h.toFixed(2)}%
                </span>
                <span className="text-xs" style={{ color: "rgba(245, 230, 224, 0.35)" }}>
                  24h
                </span>
              </div>
            </div>
          )}

          {/* Refresh indicator */}
          <p className="text-xs m-0 mt-6" style={{ color: "rgba(245, 230, 224, 0.2)" }}>
            Auto-refreshes every 30s
          </p>
        </div>
      </div>

      {/* BaseScan link below card */}
      <div className="mt-6">
        <a
          href={BASESCAN_URL}
          target="_blank"
          rel="noreferrer"
          className="text-xs no-underline hover:opacity-80 transition-opacity"
          style={{ color: "rgba(196, 30, 58, 0.5)" }}
        >
          View on BaseScan &rarr;
        </a>
      </div>
    </div>
  );
};

export default Home;
