"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ContentImage } from "@/components/shared/content-image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TaskImageCarousel({ images }: { images: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: images.length > 1,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (!images.length) return null;

  return (
    <div className="rounded-3xl border border-border bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-muted">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((src, index) => (
              <div key={`${src}-${index}`} className="min-w-0 flex-[0_0_100%]">
                <div className="relative aspect-[16/10] w-full">
                  <ContentImage
                    src={src}
                    alt={`Gallery image ${index + 1} for verified business listing`}
                    fill
                    sizes="(max-width: 768px) 100vw, 900px"
                    quality={78}
                    className="object-cover"
                    intrinsicWidth={1440}
                    intrinsicHeight={900}
                    priority={index === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Previous image"
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 shadow-md backdrop-blur"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Next image"
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 shadow-md backdrop-blur"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-4 right-4 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6">
          {images.map((src, index) => {
            const isActive = index === selectedIndex;
            return (
              <button
                key={`${src}-thumb-${index}`}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className={`relative overflow-hidden rounded-2xl border transition ${
                  isActive
                    ? "border-sky-500 ring-2 ring-sky-200"
                    : "border-border opacity-80 hover:opacity-100"
                }`}
                aria-label={`Open gallery image ${index + 1}`}
              >
                <div className="relative aspect-square w-full bg-muted">
                  <ContentImage
                    src={src}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    sizes="120px"
                    quality={60}
                    className="object-cover"
                  />
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}




