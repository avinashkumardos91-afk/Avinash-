"use client";

import { useState } from "react";

/*
  A framed image slot for the editorial sections. Shows the photo when the
  file exists in /public, otherwise the styled gradient placeholder + label.
*/
export default function Shot({
  src,
  label,
  title,
  className = "",
}: {
  src?: string;
  label: string;
  title: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className={`shot ${className}`}>
      {src && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={title}
          className="absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: loaded ? 1 : 0 }}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
      {loaded && (
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: "linear-gradient(180deg, rgba(12,10,9,0.1), rgba(12,10,9,0.72))" }}
        />
      )}
      <div className="shot__label relative z-[2]">
        <small>{label}</small>
        <span className="serif">{title}</span>
      </div>
    </div>
  );
}
