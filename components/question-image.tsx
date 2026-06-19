"use client"

import { useState } from "react"

type QuestionImageProps = {
  src?: string
  alt?: string
}

const PLACEHOLDER = "/images/placeholder.png"

export function QuestionImage({ src, alt }: QuestionImageProps) {
  const [errored, setErrored] = useState(false)
  const resolved = !src || errored ? PLACEHOLDER : src
  const isPlaceholder = resolved === PLACEHOLDER
  const isExternal = !!src && /^https?:\/\//.test(src)

  return (
    <figure className="relative overflow-hidden rounded-lg border border-border bg-black/40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolved || "/placeholder.svg"}
        alt={alt || "Radiology image for this question"}
        referrerPolicy="no-referrer"
        onError={() => setErrored(true)}
        className="mx-auto max-h-[48vh] w-full object-contain"
      />
      {isPlaceholder && src && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2 text-center text-xs text-muted-foreground">
          {isExternal
            ? `Could not load image from ${src} — the host may block hotlinking. Try downloading it into public/images instead.`
            : `Missing image — add it at public${src}`}
        </figcaption>
      )}
    </figure>
  )
}
