import React from "react";

const imageRegex = /!\[[^\]]*\]\((\/uploads\/[^)\s]+)\)/g;

export default function RenderRichContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-3 text-sm leading-7">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        const matched = trimmed.match(/^!\[[^\]]*\]\((\/uploads\/[^)\s]+)\)$/);
        if (matched) {
          return <img key={`img-${idx}`} src={matched[1]} alt="본문 이미지" className="max-h-[460px] w-full rounded-lg object-contain" />;
        }

        const hasInlineImage = imageRegex.test(line);
        imageRegex.lastIndex = 0;
        if (!hasInlineImage) {
          return (
            <p key={`line-${idx}`} className="whitespace-pre-wrap">
              {line}
            </p>
          );
        }

        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        line.replace(imageRegex, (match, src, offset) => {
          if (offset > lastIndex) parts.push(line.slice(lastIndex, offset));
          parts.push(<img key={`${idx}-${offset}`} src={src} alt="본문 이미지" className="my-2 max-h-64 rounded object-contain" />);
          lastIndex = offset + match.length;
          return match;
        });
        if (lastIndex < line.length) parts.push(line.slice(lastIndex));

        return <div key={`mixed-${idx}`}>{parts}</div>;
      })}
    </div>
  );
}
