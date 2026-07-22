import { useEffect } from "react";
import gsap from "gsap";

let hasPlayed = false;

export function useWriteReveal() {
  useEffect(() => {
    if (hasPlayed) return;

    const raf = requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>("[data-write-reveal]");
      if (!el) return;

      hasPlayed = true;

      const text = el.textContent || "";
      el.innerHTML = "";
      el.style.opacity = "1";

      const chars = text.split("");
      chars.forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.style.clipPath = "inset(0 100% 0 0)";
        el.appendChild(span);
      });

      const spans = el.querySelectorAll("span");
      gsap.to(spans, {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.4,
        stagger: 0.035,
        ease: "power2.out",
      });
    });

    return () => cancelAnimationFrame(raf);
  }, []);
}
