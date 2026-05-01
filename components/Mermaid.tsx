"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

// Initialize mermaid once with base config
if (typeof window !== "undefined") {
  mermaid.initialize({
    startOnLoad: false,
    theme: "neutral",
    securityLevel: "loose",
    fontFamily: "Inter, sans-serif",
  });
}

interface MermaidProps {
  chart: string;
  id?: string;
}

export default function Mermaid({ chart, id = "mermaid-diagram" }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (ref.current && chart) {
        try {
          // Clear previous content
          ref.current.innerHTML = "";

          // Determine orientation from chart definition
          const isHorizontal = chart.includes("graph LR");

          // Dynamically re-initialize with orientation-specific sizing
          mermaid.initialize({
            startOnLoad: false,
            theme: "neutral",
            securityLevel: "loose",
            fontFamily: "Inter, sans-serif",
            themeVariables: {
              fontSize: isHorizontal ? "36px" : "36px",
            },
            flowchart: {
              nodeSpacing: isHorizontal ? 120 : 280,
              rankSpacing: isHorizontal ? 120 : 280,
              padding: isHorizontal ? 16 : 40,
            }
          });

          // Generate unique ID for each render to avoid conflicts
          const uniqueId = `${id}-${Math.random().toString(36).substr(2, 9)}`;

          const { svg } = await mermaid.render(uniqueId, chart);
          ref.current.innerHTML = svg;
        } catch (error) {
          console.error("Mermaid rendering error:", error);
          ref.current.innerHTML = "<p class='text-red-500'>Error rendering diagram</p>";
        }
      }
    };

    renderChart();
  }, [chart, id]);

  return (
    <div
      ref={ref}
      className="flex justify-center bg-white p-4 rounded-xl [&>svg]:!max-w-none [&>svg]:!w-auto [&>svg]:!h-auto"
    />
  );
}
