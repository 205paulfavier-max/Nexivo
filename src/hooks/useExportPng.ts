import { useCallback, useState } from 'react';

/**
 * Serialise an SVG element to a PNG and trigger a download. Pure browser API,
 * no canvas library required.
 */
function svgToPngBlob(svg: SVGSVGElement, scale = 2): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const clone = svg.cloneNode(true) as SVGSVGElement;
    const bbox = svg.getBoundingClientRect();
    const width = bbox.width * scale;
    const height = bbox.height * scale;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const xml = new XMLSerializer().serializeToString(clone);
    const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }
      ctx.fillStyle = '#0a0a14';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob returned null'));
      }, 'image/png');
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err instanceof Event ? new Error('Image load failed') : err);
    };
    img.src = url;
  });
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function useExportPng(): {
  exporting: boolean;
  exportSvg: (selector: string, filename: string) => Promise<void>;
} {
  const [exporting, setExporting] = useState(false);

  const exportSvg = useCallback(async (selector: string, filename: string) => {
    setExporting(true);
    try {
      const el = document.querySelector(selector) as SVGSVGElement | null;
      if (!el) throw new Error(`Element ${selector} not found`);
      const blob = await svgToPngBlob(el, 2);
      triggerDownload(blob, filename);
    } catch (err) {
      console.error('PNG export failed', err);
    } finally {
      setExporting(false);
    }
  }, []);

  return { exporting, exportSvg };
}
