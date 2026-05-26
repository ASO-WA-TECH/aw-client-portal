import React from "react";

// Parses **bold** and [text](href) markers into JSX
export const parseContent = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, i) => {
    // **bold**
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      return <strong key={i}>{boldMatch[1]}</strong>;
    }

    // [text](href)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]}>
          {linkMatch[1]}
        </a>
      );
    }

    return part;
  });
};
