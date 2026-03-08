import { useEffect, useRef, useState } from "react";

export default function LazySection({
  children,
  className = "",
  minHeight = 360,
  rootMargin = "320px 0px",
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(
    () => typeof window !== "undefined" && typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (isVisible) {
      return undefined;
    }

    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={isVisible ? undefined : { minHeight }}
    >
      {isVisible ? children : null}
    </div>
  );
}
