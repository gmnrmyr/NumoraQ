import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Animation configs (add more as needed)
const ANIMATIONS = [
  {
    label: "Black Hole",
    id: "db3DaP9gWVnnnr7ZevK7",
    size: { width: 2000, height: 900 },
  },
  {
    label: "Dark Dither",
    id: "h49sb4lMLFG1hJLyIzdq",
    size: { width: 1440, height: 900 },
  },
];

export default function TestInstances() {
  const [animIdx, setAnimIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const animRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Inject Unicorn Studio script once
  useEffect(() => {
    if (!window.UnicornStudio) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
      script.onload = () => {
        if (!window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      };
      document.head.appendChild(script);
    } else if (!window.UnicornStudio.isInitialized) {
      window.UnicornStudio.init();
      window.UnicornStudio.isInitialized = true;
    }
  }, []);

  // Pause/resume animation
  useEffect(() => {
    const el = animRef.current?.querySelector("div[data-us-project]");
    if (el) {
      (el as HTMLElement).style.animationPlayState = paused ? "paused" : "running";
    }
  }, [paused, animIdx]);

  const currentAnim = ANIMATIONS[animIdx];

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "#1a1a1a",
        color: "#00ff00",
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header with animation background */}
      <div
        className="relative w-full"
        style={{
          minHeight: 220,
          maxHeight: 400,
          textAlign: "center",
          padding: "48px 0 0 0",
          position: "relative",
        }}
      >
        {/* Animation background */}
        <div
          className="absolute inset-0 animation-bg"
          style={{
            zIndex: 0,
            opacity: 0.5,
            pointerEvents: "none",
            filter: "blur(0.5px)",
          }}
        >
          <div
            ref={animRef}
            data-us-project={currentAnim.id}
            style={{
              width: currentAnim.size.width,
              height: currentAnim.size.height,
              margin: "0 auto",
              pointerEvents: "none",
            }}
          />
        </div>
        {/* Terminal header text */}
        <div
          className="relative z-10"
          style={{
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            color: "#00ff00",
            fontSize: 20,
            letterSpacing: 1,
            textShadow: "0 0 4px #00ff00",
            padding: "0 0 8px 0",
          }}
        >
          ┌─ TEST INSTANCES ────────────────────────────────┐
          <br />
          │ FINANCIAL COMMAND CENTER // DEV TERMINAL │
          <br />
          └───────────────────────────────────────────────┘
        </div>
        {/* Animation controls */}
        <div
          className="absolute left-4 top-4 z-20 flex gap-2 items-center"
          style={{ pointerEvents: "auto" }}
        >
          <button
            className="play-pause"
            style={{
              background: "rgba(0,255,0,0.2)",
              color: "#000",
              border: "1px solid #00ff00",
              padding: "4px 12px",
              borderRadius: 4,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: 14,
            }}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? "Play" : "Pause"}
          </button>
          <button
            className="swap-anim"
            style={{
              background: "rgba(0,255,0,0.2)",
              color: "#000",
              border: "1px solid #00ff00",
              padding: "4px 12px",
              borderRadius: 4,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: 14,
            }}
            onClick={() => {
              setAnimIdx((idx) => (idx + 1) % ANIMATIONS.length);
              setPaused(false);
            }}
          >
            Swap Animation
          </button>
          <span
            style={{
              color: "#00ff00",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              marginLeft: 8,
              background: "rgba(0,0,0,0.7)",
              padding: "2px 8px",
              borderRadius: 4,
            }}
          >
            Animation ID: {currentAnim.id}
          </span>
        </div>
      </div>

      {/* Terminal-style panel */}
      <div
        className="w-full flex justify-center"
        style={{ marginTop: 40, marginBottom: 40 }}
      >
        <div
          className="terminal-panel"
          style={{
            width: "100%",
            maxWidth: 700,
            background: "rgba(20,20,20,0.85)",
            border: "2px solid #fff",
            borderRadius: 8,
            boxShadow: "0 4px 32px #000a",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: 32,
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            color: "#00ff00",
            fontSize: 16,
            letterSpacing: 1,
            minHeight: 180,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <span style={{ color: "#00ff00" }}>┌─ PANEL: DUMMY DATA ────────────────┐</span>
          </div>
          <div>
            <span style={{ color: "#00ff00" }}>
              │ This is a placeholder for test instance data.<br />
              │ You can edit this text or swap the animation above.<br />
              │ More features coming soon...
            </span>
          </div>
          <div style={{ marginTop: 12 }}>
            <span style={{ color: "#00ff00" }}>└───────────────────────────────────┘</span>
          </div>
        </div>
      </div>
    </div>
  );
}