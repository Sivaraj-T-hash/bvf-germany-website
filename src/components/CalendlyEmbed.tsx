import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement; resize?: boolean }) => void;
    };
  }
}

interface CalendlyEmbedProps {
  url: string;
  className?: string;
}

export default function CalendlyEmbed({ url, className = '' }: CalendlyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!url || url.includes('your-username')) return;

    const mountWidget = () => {
      if (!containerRef.current || !window.Calendly?.initInlineWidget) return;
      containerRef.current.innerHTML = '';
      window.Calendly.initInlineWidget({
        url,
        parentElement: containerRef.current,
        resize: true,
      });
    };

    if (window.Calendly?.initInlineWidget) {
      mountWidget();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>('script[data-calendly-script="true"]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.dataset.calendlyScript = 'true';
      script.addEventListener('load', mountWidget);
      document.body.appendChild(script);
    } else {
      script.addEventListener('load', mountWidget);
    }

    return () => {
      script?.removeEventListener('load', mountWidget);
    };
  }, [url]);

  return <div ref={containerRef} className={className} />;
}
