"use client";

import { useEffect, useRef, useState } from "react";

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * useReveal
 *
 * A custom React hook that powers every scroll-triggered animation on the page.
 * Uses IntersectionObserver with configurable threshold.
 *
 * Returns a ref (to attach to any element) and an isVisible boolean
 * (true once the element enters the viewport).
 *
 * Once triggered, it stays true — animations don't reverse on scroll-up.
 * This is the backbone of the reveal animation system.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {}
): [React.RefObject<T | null>, boolean] {
  const { threshold = 0.15, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // If triggerOnce is true, unobserve after first trigger
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}

export default useReveal;
