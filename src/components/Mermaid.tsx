import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "Inter, sans-serif",
});

interface MermaidProps {
  chart: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgCode, setSvgCode] = useState<string>("");

  useEffect(() => {
    const renderChart = async () => {
      try {
        if (chart) {
          const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          setSvgCode(svg);
        }
      } catch (error) {
        console.error("Mermaid rendering error:", error);
      }
    };
    renderChart();
  }, [chart]);

  return (
    <div
      className="flex justify-center my-6 overflow-x-auto bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm"
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svgCode }}
    />
  );
};
