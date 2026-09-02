'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration,
  className = ''
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Determine ideal smooth duration based on target value if duration is not explicitly set
  const animDuration = duration ?? (target > 5000 ? 2200 : target > 100 ? 1800 : 1200);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / animDuration, 1);
            
            // Smooth easeOutExpo for ultra-sleek, natural deceleration
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const currentVal = Math.round(eased * target);
            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, animDuration, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
