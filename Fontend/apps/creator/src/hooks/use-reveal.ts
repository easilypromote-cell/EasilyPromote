import { useEffect } from "react";
import gsap from "gsap";

export function useReveal(step?: string | number) {
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const leftEls = document.querySelectorAll<HTMLElement>("[data-reveal-left]");
      const rightEls = document.querySelectorAll<HTMLElement>("[data-reveal]");

      leftEls.forEach((el) => gsap.killTweensOf(el));
      rightEls.forEach((el) => gsap.killTweensOf(el));

      if (leftEls.length) {
        gsap.fromTo(
          leftEls,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
            delay: 0.1,
          }
        );
      }

      if (rightEls.length) {
        const heading = Array.from(rightEls).filter(
          (el) => el.tagName === "H2"
        );
        const subtitle = Array.from(rightEls).filter(
          (el) => el.tagName === "P"
        );
        const otpGrid = Array.from(rightEls).filter((el) =>
          el.classList.contains("flex")
        );
        const rest = Array.from(rightEls).filter(
          (el) =>
            el.tagName !== "H2" &&
            el.tagName !== "P" &&
            !el.classList.contains("flex")
        );

        gsap.fromTo(
          heading,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );
        gsap.fromTo(
          subtitle,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            delay: 0.06,
          }
        );
        gsap.fromTo(
          otpGrid,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "power3.out",
            delay: 0.1,
          }
        );
        gsap.fromTo(
          rest,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power3.out",
            stagger: 0.08,
            delay: 0.12,
          }
        );
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      gsap.killTweensOf("[data-reveal]");
      gsap.killTweensOf("[data-reveal-left]");
    };
  }, [step]);
}
