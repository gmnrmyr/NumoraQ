import React from "react";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "//da_portfolio", anchor: "#portfolio" },
  { label: "//da_income", anchor: "#income" },
  { label: "//da_expenses", anchor: "#expenses" },
  { label: "//da_assets", anchor: "#assets" },
  { label: "//da_debt", anchor: "#debts" },
  { label: "//da_back", anchor: "#back" },
];

export default function TestRemoteControl() {
  const navigate = useNavigate();
  const handleMenuClick = (anchor: string) => {
    if (anchor === "#back") {
      navigate("/test-instances");
    } else {
      const el = document.querySelector(anchor);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
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
      {/* Custom Terminal Navbar */}
      <div
        className="logo-navbar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          background: "#000",
          padding: 10,
          borderBottom: "1px solid #fff",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontWeight: "bold", letterSpacing: 2 }}>NEXLIFY</div>
        <div className="hamburger-menu" style={{ position: "relative" }}>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#00ff00",
              fontSize: 22,
              cursor: "pointer",
              padding: 4,
            }}
            onClick={() => {
              const menu = document.getElementById("test-remotecontrol-menu");
              if (menu) menu.classList.toggle("show");
            }}
            aria-label="Open menu"
          >
            ☰
          </button>
          <div
            id="test-remotecontrol-menu"
            className="menu-content"
            style={{
              display: "none",
              position: "absolute",
              top: 32,
              right: 0,
              background: "#000",
              border: "1px solid #fff",
              padding: 5,
              zIndex: 200,
              minWidth: 160,
              borderRadius: 6,
              boxShadow: "0 2px 16px #000a",
            }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.anchor}
                style={{
                  color: "#00ff00",
                  textDecoration: "none",
                  display: "block",
                  padding: 6,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 15,
                  borderRadius: 4,
                  marginBottom: 2,
                  background: "none",
                  cursor: "pointer",
                }}
                onClick={e => {
                  e.preventDefault();
                  handleMenuClick(link.anchor);
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      {/* Main content */}
      <div style={{ paddingTop: 70, textAlign: "center" }}>
        <div style={{ fontSize: 22, marginBottom: 16 }}>// Test RemoteControl</div>
        <div style={{ fontSize: 16, opacity: 0.7 }}>
          This is a simplified remote control interface.<br />
          More features coming soon.
        </div>
      </div>
    </div>
  );
}
