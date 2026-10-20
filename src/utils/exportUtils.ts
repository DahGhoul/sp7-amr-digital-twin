// High-Resolution Figure & Table Export Engine (300 DPI PNG, SVG, CSV/Excel)

export interface FigureExportMeta {
  filename: string;
  title: string;
  subtitle: string;
  interpretability: string;
  explainability: string;
  sourceNote?: string;
}

/**
 * Exports an SVG inside a container (plus title, interpretability and explainability)
 * as an Ultra-HD 300 DPI Publication-Ready PNG image.
 */
export async function exportContainerSvgToHighResPng(
  containerId: string,
  meta: FigureExportMeta
): Promise<void> {
  const container = document.getElementById(containerId);
  if (!container) {
    alert("No se encontró el contenedor del gráfico para exportar.");
    return;
  }

  const svgElement = container.querySelector("svg");
  if (!svgElement) {
    alert("No se encontró el gráfico vectorial dentro del contenedor.");
    return;
  }

  // Clone SVG and inline computed styles so it renders crisply on canvas
  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
  const bbox = svgElement.getBoundingClientRect();
  const svgWidth = Math.max(bbox.width || 800, 750);
  const svgHeight = Math.max(bbox.height || 380, 340);

  clonedSvg.setAttribute("width", String(svgWidth));
  clonedSvg.setAttribute("height", String(svgHeight));
  clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clonedSvg);
  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.crossOrigin = "anonymous";

  return new Promise((resolve) => {
    img.onload = () => {
      // Scale 3x for ~300 DPI publication quality
      const scale = 3;
      const pad = 40;
      const headerHeight = 95;
      const footerHeight = 165;
      const totalWidth = svgWidth + pad * 2;
      const totalHeight = svgHeight + headerHeight + footerHeight + pad;

      const canvas = document.createElement("canvas");
      canvas.width = totalWidth * scale;
      canvas.height = totalHeight * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve();
        return;
      }

      ctx.scale(scale, scale);

      // 1. Pure white academic background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, totalWidth, totalHeight);

      // Subtle border
      ctx.strokeStyle = "#CBD5E1";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(12, 12, totalWidth - 24, totalHeight - 24);

      // 2. Header (Figure Title & Subtitle)
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 18px Inter, Segoe UI, Arial, sans-serif";
      ctx.fillText(meta.title, pad, pad + 18);

      ctx.fillStyle = "#475569";
      ctx.font = "13px Inter, Segoe UI, Arial, sans-serif";
      ctx.fillText(meta.subtitle, pad, pad + 42);

      // Divider line
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, pad + 56);
      ctx.lineTo(totalWidth - pad, pad + 56);
      ctx.stroke();

      // 3. Draw Chart SVG
      ctx.drawImage(img, pad, headerHeight, svgWidth, svgHeight);

      // 4. Footer Box: Interpretability & Explainability
      const footY = headerHeight + svgHeight + 16;
      ctx.fillStyle = "#F8FAFC";
      ctx.fillRect(pad, footY, totalWidth - pad * 2, footerHeight - 25);
      ctx.strokeStyle = "#CBD5E1";
      ctx.strokeRect(pad, footY, totalWidth - pad * 2, footerHeight - 25);

      const maxTextWidth = totalWidth - pad * 2 - 28;

      ctx.fillStyle = "#1E3A8A";
      ctx.font = "bold 12px Inter, Segoe UI, Arial, sans-serif";
      ctx.fillText("Interpretabilidad (Lectura de Datos):", pad + 14, footY + 22);

      ctx.fillStyle = "#1E293B";
      ctx.font = "11.5px Inter, Segoe UI, Arial, sans-serif";
      wrapText(ctx, meta.interpretability, pad + 14, footY + 40, maxTextWidth, 16);

      ctx.fillStyle = "#0F766E";
      ctx.font = "bold 12px Inter, Segoe UI, Arial, sans-serif";
      ctx.fillText(
        "Explicabilidad Causal (Mecanismo Biológico y Matemático):",
        pad + 14,
        footY + 82
      );

      ctx.fillStyle = "#1E293B";
      ctx.font = "11.5px Inter, Segoe UI, Arial, sans-serif";
      wrapText(ctx, meta.explainability, pad + 14, footY + 100, maxTextWidth, 16);

      // Source watermark
      ctx.fillStyle = "#64748B";
      ctx.font = "italic 10px Inter, Segoe UI, Arial, sans-serif";
      ctx.fillText(
        meta.sourceNote ||
          "Fuente: Generado por Gemelo Digital Híbrido SP-7 — Universidad Nacional de Trujillo (UNT, 2026) | Resolución 300 DPI",
        pad,
        totalHeight - 18
      );

      // Trigger PNG download
      canvas.toBlob((blob) => {
        if (blob) {
          const pngUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = pngUrl;
          a.download = `${meta.filename}_300DPI.png`;
          a.click();
          URL.revokeObjectURL(pngUrl);
        }
        URL.revokeObjectURL(url);
        resolve();
      }, "image/png", 1.0);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve();
    };

    img.src = url;
  });
}

/**
 * Exports SVG directly as a scalable vector file (.svg) for LaTeX / Publisher
 */
export function exportContainerSvgFile(containerId: string, filename: string): void {
  const container = document.getElementById(containerId);
  const svgElement = container?.querySelector("svg");
  if (!svgElement) return;

  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
  clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clonedSvg);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports structured table data (headers + rows + interpretability + explainability)
 * as a UTF-8 BOM CSV file (opens directly in Microsoft Excel with proper accents)
 */
export function exportTableToCsv(
  filename: string,
  title: string,
  headers: string[],
  rows: string[][],
  interpretability: string,
  explainability: string
): void {
  const escapeCsv = (val: string) => `"${(val || "").replace(/"/g, '""')}"`;

  const lines: string[] = [
    escapeCsv(title),
    "",
    headers.map(escapeCsv).join(","),
    ...rows.map((r) => r.map(escapeCsv).join(",")),
    "",
    `${escapeCsv("Interpretabilidad:")},${escapeCsv(interpretability)}`,
    `${escapeCsv("Explicabilidad Causal:")},${escapeCsv(explainability)}`,
    `${escapeCsv("Fuente:")},${escapeCsv(
      "Gemelo Digital Híbrido SP-7 - Universidad Nacional de Trujillo (UNT)"
    )}`,
  ];

  // Add BOM \uFEFF so Excel on Windows reads Spanish accents properly
  const csvContent = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Renders any table (headers + rows + interpretability + explainability) onto a
 * High-Resolution 300 DPI PNG Canvas and triggers download!
 */
export function exportTableToHighResPng(
  filename: string,
  title: string,
  subtitle: string,
  headers: string[],
  rows: string[][],
  interpretability: string,
  explainability: string
): void {
  const scale = 3; // 300 DPI
  const width = 1050;
  const pad = 36;
  const rowHeight = 46;
  const headerY = 95;
  const tableHeight = (rows.length + 1) * rowHeight;
  const footerHeight = 160;
  const totalHeight = headerY + tableHeight + footerHeight + 50;

  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = totalHeight * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.scale(scale, scale);

  // White background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, totalHeight);

  // Outer frame
  ctx.strokeStyle = "#CBD5E1";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(10, 10, width - 20, totalHeight - 20);

  // Title & Subtitle
  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 17px Inter, Segoe UI, Arial, sans-serif";
  ctx.fillText(title, pad, 44);

  ctx.fillStyle = "#475569";
  ctx.font = "12.5px Inter, Segoe UI, Arial, sans-serif";
  ctx.fillText(subtitle, pad, 66);

  const tableWidth = width - pad * 2;
  const colWidth = tableWidth / headers.length;

  // Draw Table Header (UNT Navy #1E3A8A)
  ctx.fillStyle = "#1E3A8A";
  ctx.fillRect(pad, headerY, tableWidth, rowHeight);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 12px Inter, Segoe UI, Arial, sans-serif";
  headers.forEach((h, i) => {
    ctx.fillText(
      truncateText(ctx, h, colWidth - 16),
      pad + i * colWidth + 10,
      headerY + 28
    );
  });

  // Draw Rows
  rows.forEach((row, rIdx) => {
    const y = headerY + (rIdx + 1) * rowHeight;
    ctx.fillStyle = rIdx % 2 === 0 ? "#FFFFFF" : "#F8FAFC";
    ctx.fillRect(pad, y, tableWidth, rowHeight);

    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 1;
    ctx.strokeRect(pad, y, tableWidth, rowHeight);

    ctx.fillStyle = "#1E293B";
    ctx.font = rIdx === rows.length - 1 ? "bold 11.5px Inter, Arial, sans-serif" : "11.5px Inter, Arial, sans-serif";
    row.forEach((cell, cIdx) => {
      ctx.fillText(
        truncateText(ctx, cell, colWidth - 16),
        pad + cIdx * colWidth + 10,
        y + 28
      );
    });
  });

  // Draw Interpretability & Explainability Footer
  const footY = headerY + tableHeight + 18;
  ctx.fillStyle = "#F1F5F9";
  ctx.fillRect(pad, footY, tableWidth, footerHeight - 20);
  ctx.strokeStyle = "#CBD5E1";
  ctx.strokeRect(pad, footY, tableWidth, footerHeight - 20);

  ctx.fillStyle = "#1E3A8A";
  ctx.font = "bold 12px Inter, Segoe UI, Arial, sans-serif";
  ctx.fillText("Interpretabilidad de la Tabla:", pad + 12, footY + 22);

  ctx.fillStyle = "#1E293B";
  ctx.font = "11.5px Inter, Segoe UI, Arial, sans-serif";
  wrapText(ctx, interpretability, pad + 12, footY + 40, tableWidth - 24, 15);

  ctx.fillStyle = "#0F766E";
  ctx.font = "bold 12px Inter, Segoe UI, Arial, sans-serif";
  ctx.fillText("Explicabilidad Científica y Metodológica:", pad + 12, footY + 80);

  ctx.fillStyle = "#1E293B";
  ctx.font = "11.5px Inter, Segoe UI, Arial, sans-serif";
  wrapText(ctx, explainability, pad + 12, footY + 98, tableWidth - 24, 15);

  ctx.fillStyle = "#64748B";
  ctx.font = "italic 10px Inter, Segoe UI, Arial, sans-serif";
  ctx.fillText(
    "Fuente: Generado por el Gemelo Digital Híbrido SP-7 — Universidad Nacional de Trujillo (UNT, 2026) | Calidad Editorial 300 DPI",
    pad,
    totalHeight - 16
  );

  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}_300DPI.png`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, "image/png", 1.0);
}

function truncateText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 0 && ctx.measureText(truncated + "...").width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + "...";
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + " ";
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, curY);
}

// Convenience wrappers used by ScientificFiguresView and ScientificTablesView
export async function exportContainerAsHighResPNG(
  containerId: string,
  filename: string,
  title: string,
  interpretability: string,
  explainability: string
): Promise<void> {
  const container = document.getElementById(containerId);
  const hasChartSvg = container?.querySelector(".recharts-wrapper svg");
  if (hasChartSvg) {
    return exportContainerSvgToHighResPng(containerId, {
      filename,
      title,
      subtitle: "Formato Revista Facultad de Ingeniería — Universidad de Antioquia (Redin)",
      interpretability,
      explainability,
    });
  }
  // Schematic diagram fallback (for Figure 1 Architecture & Figure 2 Sentinel Map)
  const scale = 3;
  const width = 1050;
  const height = 620;
  const pad = 36;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(scale, scale);

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#CBD5E1";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(12, 12, width - 24, height - 24);

  ctx.fillStyle = "#1E3A8A";
  ctx.font = "bold 17px Inter, Segoe UI, Arial, sans-serif";
  ctx.fillText(title, pad, 46);

  ctx.fillStyle = "#475569";
  ctx.font = "12.5px Inter, Segoe UI, Arial, sans-serif";
  ctx.fillText(
    "Formato Oficial: Revista Facultad de Ingeniería — Universidad de Antioquia (Redin) | Trujillo, Perú",
    pad,
    68
  );

  // Extract visible cards text inside container
  const textBlocks = Array.from(container?.querySelectorAll(".p-6 div") || [])
    .map((el) => (el as HTMLElement).innerText?.trim())
    .filter((t) => t && t.length > 15)
    .slice(0, 6);

  textBlocks.forEach((txt, idx) => {
    const boxY = 88 + idx * 54;
    ctx.fillStyle = idx % 2 === 0 ? "#EFF6FF" : "#F0FDFA";
    ctx.fillRect(pad, boxY, width - pad * 2, 46);
    ctx.strokeStyle = "#93C5FD";
    ctx.strokeRect(pad, boxY, width - pad * 2, 46);
    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 11.5px Inter, Segoe UI, Arial, sans-serif";
    wrapText(ctx, txt.replace(/\n+/g, " — "), pad + 12, boxY + 20, width - pad * 2 - 24, 15);
  });

  const footY = 425;
  ctx.fillStyle = "#F8FAFC";
  ctx.fillRect(pad, footY, width - pad * 2, 145);
  ctx.strokeStyle = "#CBD5E1";
  ctx.strokeRect(pad, footY, width - pad * 2, 145);

  ctx.fillStyle = "#1E3A8A";
  ctx.font = "bold 12px Inter, Segoe UI, Arial, sans-serif";
  ctx.fillText("Interpretabilidad (Lectura de Datos):", pad + 12, footY + 22);
  ctx.fillStyle = "#1E293B";
  ctx.font = "11.5px Inter, Segoe UI, Arial, sans-serif";
  wrapText(ctx, interpretability, pad + 12, footY + 40, width - pad * 2 - 24, 15);

  ctx.fillStyle = "#0F766E";
  ctx.font = "bold 12px Inter, Segoe UI, Arial, sans-serif";
  ctx.fillText("Explicabilidad Causal (Mecanismo Biofísico y Matemático):", pad + 12, footY + 82);
  ctx.fillStyle = "#1E293B";
  ctx.font = "11.5px Inter, Segoe UI, Arial, sans-serif";
  wrapText(ctx, explainability, pad + 12, footY + 100, width - pad * 2 - 24, 15);

  ctx.fillStyle = "#64748B";
  ctx.font = "italic 10px Inter, Segoe UI, Arial, sans-serif";
  ctx.fillText(
    "Fuente: Generado por Gemelo Digital Híbrido SP-7 — Universidad Nacional de Trujillo (UNT, 2026) | Resolución 300 DPI",
    pad,
    height - 20
  );

  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, "image/png", 1.0);
}

export function exportContainerAsSVG(
  containerId: string,
  filename: string,
  title: string,
  interpretability: string,
  explainability: string
): void {
  const container = document.getElementById(containerId);
  const svgEl = container?.querySelector(".recharts-wrapper svg");
  if (svgEl) {
    exportContainerSvgFile(containerId, filename);
    return;
  }
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="420" viewBox="0 0 1000 420">
    <rect width="1000" height="420" fill="#FFFFFF" stroke="#1E3A8A" stroke-width="2"/>
    <text x="30" y="45" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1E3A8A">${title}</text>
    <text x="30" y="90" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#1E3A8A">Interpretabilidad:</text>
    <text x="30" y="115" font-family="Arial, sans-serif" font-size="12" fill="#1E293B">${interpretability.slice(0, 135)}...</text>
    <text x="30" y="165" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0F766E">Explicabilidad Causal:</text>
    <text x="30" y="190" font-family="Arial, sans-serif" font-size="12" fill="#1E293B">${explainability.slice(0, 135)}...</text>
  </svg>`;
  const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportTableAsCSV(
  title: string,
  headers: string[],
  rows: string[][],
  interpretability: string,
  explainability: string,
  filename: string
): void {
  exportTableToCsv(filename, title, headers, rows, interpretability, explainability);
}

export function exportTableAsHighResPNG(
  title: string,
  headers: string[],
  rows: string[][],
  interpretability: string,
  explainability: string,
  filename: string
): void {
  exportTableToHighResPng(
    filename,
    title,
    "Formato Oficial: Revista Facultad de Ingeniería — Universidad de Antioquia (Redin)",
    headers,
    rows,
    interpretability,
    explainability
  );
}

