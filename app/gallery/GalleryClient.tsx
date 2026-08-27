'use client';

import { useState } from 'react';
import { readSiteContent } from '../lib/site-content/demo-site-content';

export function GalleryClient() {
  const gallery = readSiteContent().gallery;
  const [selectedImage, setSelectedImage] = useState<(typeof gallery)[0] | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 md:px-8">
      {/* Hero */}
      <section className="mb-16 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#05863a]">
          Фотографии
        </p>
        <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          Галерея
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-700">
          Моменты из жизни нашего центра: занятия, мероприятия и общинные дела.
        </p>
      </section>

      {/* Gallery Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className="group relative aspect-[4/3] overflow-hidden rounded-[28px] bg-zinc-100"
          >
            <img
              src={image.url}
              alt={image.caption}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full transition-transform group-hover:translate-y-0">
              <p className="text-sm font-bold text-white">{image.caption}</p>
              <p className="mt-1 text-xs text-white/70">{image.date}</p>
            </div>
          </button>
        ))}
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-[28px]">
            <img
              src={selectedImage.url}
              alt={selectedImage.caption}
              className="max-h-[85vh] w-auto object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <p className="text-lg font-bold text-white">{selectedImage.caption}</p>
              <p className="mt-1 text-sm text-white/70">{selectedImage.date}</p>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"
              aria-label="Закрыть"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="mt-16">
        <div className="rounded-[28px] border border-dashed border-zinc-300 bg-white p-8 md:p-12 text-center">
          <h2 className="text-2xl font-black">Хотите увидеть больше?</h2>
          <p className="mt-4 leading-7 text-zinc-600">
            Поддержите центр — и мы будем делиться моментами из жизни общины.
          </p>
          <a
            href="/#collections"
            className="mt-8 inline-block rounded-full bg-[#2f9f6b] px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#258a5d]"
          >
            Перейти к сборам →
          </a>
        </div>
      </section>
    </div>
  );
}
