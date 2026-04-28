"use client";

import { useEffect, useState } from "react";
import { ContentImage } from "@/components/shared/content-image";

const normalizeImageKey = (value: string) =>
  value
    .trim()
    .replace(/[?#].*$/, "")
    .replace(/\/+$/, "")
    .toLowerCase();

const getImageFingerprint = (value: string) => {
  const normalized = normalizeImageKey(value);
  const parts = normalized.split("/");
  const fileName = parts[parts.length - 1] || normalized;
  const withoutExtension = fileName.replace(/\.[a-z0-9]+$/i, "");
  const cleanedStem = withoutExtension
    .replace(/-\d{2,4}x\d{2,4}$/i, "")
    .replace(/[-_](copy|edited|final|new|compressed|large|small|thumb|thumbnail)$/i, "")
    .replace(/[-_]\d+$/i, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleanedStem || withoutExtension || fileName || normalized;
};

const getVisualFingerprint = (src: string) =>
  new Promise<string>((resolve) => {
    if (typeof window === "undefined") {
      resolve(getImageFingerprint(src));
      return;
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 12;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(getImageFingerprint(src));
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        let hash = "";
        for (let i = 0; i < data.length; i += 16) {
          const avg = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
          hash += avg.toString(16).padStart(2, "0");
        }
        resolve(`${img.naturalWidth}x${img.naturalHeight}-${hash}`);
      } catch {
        resolve(getImageFingerprint(src));
      }
    };

    img.onerror = () => resolve(getImageFingerprint(src));
    img.src = src;
  });

export function DedupedImageGallery({
  images,
  title,
  cardClassName,
  excludeSrc,
}: {
  images: string[];
  title: string;
  cardClassName: string;
  excludeSrc?: string;
}) {
  const [uniqueImages, setUniqueImages] = useState<string[]>(images);

  useEffect(() => {
    let cancelled = false;

    const dedupe = async () => {
      const seen = new Set<string>();
      const next: string[] = [];

      if (excludeSrc) {
        const heroVisualKey = await getVisualFingerprint(excludeSrc);
        const heroFileKey = getImageFingerprint(excludeSrc);
        seen.add(heroVisualKey);
        seen.add(heroFileKey);
      }

      for (const image of images) {
        const visualKey = await getVisualFingerprint(image);
        const fileKey = getImageFingerprint(image);
        if (seen.has(visualKey) || seen.has(fileKey)) continue;
        seen.add(visualKey);
        seen.add(fileKey);
        next.push(image);
      }

      if (!cancelled) {
        setUniqueImages(next);
      }
    };

    dedupe();
    return () => {
      cancelled = true;
    };
  }, [excludeSrc, images]);

  if (!uniqueImages.length) return null;

  return (
    <div className="mt-8">
      <p className="text-sm font-semibold text-foreground">Gallery</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {uniqueImages.map((image, index) => (
          <div key={`${image}-${index}`} className={cardClassName}>
            <div className="relative aspect-[4/5]">
              <ContentImage
                src={image}
                alt={`${title} gallery image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
