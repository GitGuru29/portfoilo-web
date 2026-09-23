import React from 'react';

/**
 * Section slug — riso press divider: hairline, giant numeral, poster serif,
 * misregistered ink. Quiet print chrome, loud type.
 */
export default function SectionBanner({
    id,
    chapter = '01',
    kicker = '',
    title = '',
    lede = '',
}) {
    if (!title && !lede) return null;

    return (
<div
            id={id ? `${id}-banner` : undefined}
            className="relative w-full overflow-hidden border-b border-ink/15 bg-[var(--color-quantum-dark)]"
        >
            <div className="absolute inset-0 noise-bg opacity-40 pointer-events-none" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-25 pointer-events-none select-none big-num leading-none pr-6">
                {chapter}
            </div>
            <div aria-hidden className="absolute left-0 top-0 bottom-0 w-px bg-ink/10 pointer-events-none" />
            <div aria-hidden className="absolute right-0 top-0 bottom-0 w-px bg-ink/10 pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-24">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="min-w-0">
                        <div className="mb-6 flex items-center gap-4">
                            <span className="meta-tag text-accent">[ {chapter} ]</span>
                            <span className="h-px w-14 md:w-24 bg-gradient-to-r from-accent to-transparent" />
                            {kicker && <span className="meta-tag text-cyanx truncate">{kicker}</span>}
                        </div>
                        <h2 className="poster-title text-balance">{title}</h2>
                    </div>
                    {lede && (
                        <p className="max-w-md md:text-right text-sm md:text-base leading-relaxed text-graphite font-light text-pretty md:pb-2 font-mono">
                            {lede}
                        </p>
                    )}
                </div>

                <div className="mt-12 flex items-center gap-3 relative">
                    <span className="h-px flex-1 bg-ink/15" />
                    <span className="stamp">verified {kicker || 'page'}</span>
                    <span className="h-px flex-1 bg-ink/15" />
                </div>
            </div>
        </div>
    );
}