import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TestInstances() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#00ff00] font-mono flex flex-col">
      {/* Terminal-like Navbar */}
      <div className="w-full bg-black border-b border-[#00ff00] p-3 flex items-center justify-between">
        <span className="tracking-widest">//da_test_instances</span>
        <Button
          variant="outline"
          size="sm"
          style={{
            background: "rgba(0,255,0,0.1)",
            color: "#00ff00",
            borderColor: "#00ff00",
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-lg mb-2">// Test Instances</div>
        <div className="text-xs opacity-70">
          This is a terminal-style test area. More features coming soon.
        </div>
      </div>
    </div>
  );
}