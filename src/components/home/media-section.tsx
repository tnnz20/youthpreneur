import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';

import { ExternalLink, FileDown, Newspaper, Play, Video } from 'lucide-react';

const YOUTUBE_ID = 'Ltv9_yjR93w';
const RADAR_BANJARMASIN_URL =
  'https://radarbanjarmasin.jawapos.com/banua/2609170014/tapin-youthpreneur-dispora-dorong-pemuda-naik-kelas-jadi-wirausaha-mandiri#goog_rewarded';
const PERBUP_PDF_URL = '/documents/perbup-tapin-no-22-tahun-2026-kewirausahaan.pdf';

export function MediaSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="media-liputan" className="border-t border-black/10 py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className="border-brand-dark bg-brand-yellow-light text-brand-dark inline-flex h-auto items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-wide uppercase shadow-xs"
          >
            <Video className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
            Dokumentasi &amp; Sorotan Media
          </Badge>
        </div>

        <div className="mx-auto mt-4 max-w-3xl text-center">
          <h2 className="text-brand-dark text-3xl font-black tracking-tight sm:text-4xl lg:text-[40px] lg:leading-tight">
            Inovasi Daerah yang Berdampak Nyata
          </h2>
          <p className="text-brand-muted mt-3 text-sm leading-relaxed font-normal sm:text-base">
            Saksikan profil perjalanan pembinaan wirausaha muda Kabupaten Tapin serta liputan resmi
            media nasional atas komitmen inovasi BADAPATAN Dispora Tapin.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6">
          {/* Column 1: YouTube Video Player with Lazy Load */}
          <div className="border-brand-dark shadow-solid flex flex-col justify-between overflow-hidden rounded-3xl border-2 bg-white lg:col-span-7">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`}
                  title="Video Dokumentasi Youthpreneur Tapin Dispora"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  aria-label="Putar video dokumentasi Youthpreneur Tapin"
                  className="group relative block h-full w-full cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
                >
                  {/* Background Thumbnail Image - absolute fill */}
                  <img
                    src={`https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`}
                    onError={(event) => {
                      event.currentTarget.src = `https://img.youtube.com/vi/${YOUTUBE_ID}/hqdefault.jpg`;
                    }}
                    alt="Thumbnail Video Dokumentasi Youthpreneur Tapin"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />

                  {/* Tactile Play Button - Perfectly Centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-brand-dark bg-brand-yellow shadow-solid text-brand-dark group-hover:bg-brand-yellow-light flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-300 group-hover:scale-110 active:scale-95 sm:h-18 sm:w-18">
                      <Play
                        className="fill-brand-dark ml-0.5 h-6 w-6 sm:h-7 sm:w-7"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Bottom Bar Info Overlay */}
                  <div className="absolute right-4 bottom-3 left-4 z-10 flex items-center justify-between text-left text-white">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold tracking-wide uppercase sm:text-sm">
                        Dokumentasi Resmi Program
                      </p>
                      <p className="truncate text-[11px] text-white/80 sm:text-xs">
                        Inkubasi &amp; Pengembangan Kewirausahaan Pemuda Tapin
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold backdrop-blur-xs">
                      Putar Video
                    </span>
                  </div>
                </button>
              )}
            </div>

            <div className="flex flex-col justify-between gap-2 p-4 sm:flex-row sm:items-center sm:p-5">
              <div>
                <h3 className="text-brand-dark text-sm font-bold sm:text-base">
                  Video Profil Inkubasi Wirausaha Pemuda Tapin
                </h3>
                <p className="text-brand-muted text-xs">
                  Dinas Pemuda dan Olahraga Kabupaten Tapin • Program BADAPATAN
                </p>
              </div>

              <a
                href={`https://youtu.be/${YOUTUBE_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-dark inline-flex shrink-0 items-center gap-1.5 text-xs font-bold transition-colors hover:text-black hover:underline"
              >
                <span>Buka di YouTube</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Column 2: Media Coverage & Legal Basis Perbup */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            {/* Radar Banjarmasin Coverage Card */}
            <div className="border-brand-dark shadow-solid hover:shadow-solid-lg relative flex flex-col justify-between rounded-3xl border-2 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-800 uppercase">
                    <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
                    Radar Banjarmasin • Jawa Pos
                  </span>
                  <span className="text-brand-muted text-[11px] font-semibold">17 Sep 2026</span>
                </div>

                <h3 className="text-brand-dark mt-2.5 text-base leading-snug font-black sm:text-lg">
                  Tapin Youthpreneur, Dispora Dorong Pemuda Naik Kelas Jadi Wirausaha Mandiri
                </h3>

                <p className="text-brand-muted mt-2 text-xs leading-relaxed">
                  Inovasi program kewirausahaan pemuda yang diinisiasi Dispora Tapin diliput media
                  sebagai terobosan nyata dalam mencetak wirausaha muda mandiri dari desa hingga
                  kota.
                </p>
              </div>

              <div className="mt-4 border-t border-black/10 pt-3">
                <a
                  href={RADAR_BANJARMASIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${buttonVariants({ variant: 'neo' })} w-full justify-center gap-2 rounded-xl py-2.5 text-xs font-bold`}
                >
                  <span>Baca Liputan di Radar Banjarmasin</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Legal Basis / Perbup Download Card */}
            <div className="border-brand-dark shadow-solid bg-brand-yellow-light/60 flex flex-col justify-between rounded-3xl border-2 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400 bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900 uppercase">
                    <FileDown className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
                    Landasan Hukum Resmi
                  </span>
                </div>

                <h4 className="text-brand-dark mt-2 text-sm leading-snug font-black sm:text-base">
                  Peraturan Bupati Tapin Nomor 22 Tahun 2026
                </h4>

                <p className="text-brand-muted mt-1.5 text-xs leading-relaxed">
                  Fasilitasi penumbuhan Wirausaha Muda Pemula (WMP), inkubasi bisnis daerah, serta
                  kemudahan legalitas dan akses pembiayaan di 12 kecamatan.
                </p>
              </div>

              <div className="mt-4">
                <a
                  href={PERBUP_PDF_URL}
                  download="Perbup-Tapin-No-22-Tahun-2026-Kewirausahaan.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${buttonVariants({ variant: 'neoOutline' })} w-full justify-center gap-2 rounded-xl bg-white py-2 text-xs font-bold`}
                >
                  <FileDown className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
                  <span>Unduh Salinan Dokumen Perbup (PDF)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
