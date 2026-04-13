import React from "react";

export const Footer = () => {
  return (
    <div className="min-h-0 py-4 px-4">
      <div className="text-center">
        <p className="m-0 text-xs" style={{ color: "rgba(245, 230, 224, 0.3)" }}>
          CLAWD Token Dashboard &middot; Data from{" "}
          <a
            href="https://dexscreener.com/base/0x9f86dB9fc6f7c9408e8Fda3Ff8ce4e78ac7a6b07"
            target="_blank"
            rel="noreferrer"
            className="no-underline"
            style={{ color: "rgba(196, 30, 58, 0.5)" }}
          >
            DexScreener
          </a>
        </p>
      </div>
    </div>
  );
};
