import React from "react";

interface SplitTextProps {
  children: string;
  className?: string;
  wordClassName?: string;
  charClassName?: string;
}

export function SplitText({
  children,
  className = "",
  wordClassName = "",
  charClassName = "",
}: SplitTextProps) {
  const words = children.split(" ");

  return (
    <span className={`inline-block ${className}`} aria-label={children}>
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className={`inline-block overflow-hidden ${wordClassName}`}
          style={{ whiteSpace: "pre" }}
        >
          {word.split("").map((char, charIndex) => (
            <span
              key={charIndex}
              className={`inline-block ${charClassName}`}
              style={{ willChange: "transform" }}
            >
              {char}
            </span>
          ))}
          {wordIndex < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
