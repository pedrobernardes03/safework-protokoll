import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollableFilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollableFilterBar({ children, className }: ScrollableFilterBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const canScrollLeft = el.scrollLeft > 4;
    const canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 4;
    setShowLeftArrow(canScrollLeft);
    setShowRightArrow(canScrollRight);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);

    const observer = new ResizeObserver(() => checkScroll());
    observer.observe(el);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [checkScroll, children]);

  const handleScroll = () => {
    checkScroll();
  };

  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    if (el.scrollWidth > el.clientWidth) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        checkScroll();
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsMouseDown(true);
    setIsDragging(false);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeft(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown) return;
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
      el.scrollLeft = scrollLeft - walk;
      checkScroll();
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setTimeout(() => setIsDragging(false), 50);
  };

  const handleMouseLeave = () => {
    if (isMouseDown) {
      setIsMouseDown(false);
      setIsDragging(false);
    }
  };

  return (
    <div className={cn("relative flex items-center min-w-0 flex-1 w-full max-w-full group/filterbar", className)}>
      {/* Left Arrow Button */}
      {showLeftArrow && (
        <button
          type="button"
          onClick={() => scrollByAmount(-220)}
          className="absolute left-1 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-border/80 bg-background/95 text-foreground shadow-md backdrop-blur-xs transition-all hover:bg-accent hover:scale-110 active:scale-95 focus:outline-hidden"
          title="Rolar para esquerda"
          aria-label="Rolar para esquerda"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {/* Left Fade Gradient */}
      {showLeftArrow && (
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-card via-card/80 to-transparent rounded-l-2xl" />
      )}

      {/* Scrollable Chips Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "flex items-center gap-1.5 overflow-x-auto py-1 px-1 min-w-0 flex-1 scroll-smooth select-none",
          isMouseDown ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
        }}
        onClickCapture={(e) => {
          if (isDragging) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
      >
        {children}
      </div>

      {/* Right Fade Gradient */}
      {showRightArrow && (
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-card via-card/80 to-transparent rounded-r-2xl" />
      )}

      {/* Right Arrow Button */}
      {showRightArrow && (
        <button
          type="button"
          onClick={() => scrollByAmount(220)}
          className="absolute right-1 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-border/80 bg-background/95 text-foreground shadow-md backdrop-blur-xs transition-all hover:bg-accent hover:scale-110 active:scale-95 focus:outline-hidden"
          title="Rolar para direita"
          aria-label="Rolar para direita"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
