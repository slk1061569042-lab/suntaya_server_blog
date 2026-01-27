import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

type CodeHighlightProps = {
  code: string;
  highlightedLines?: number[];
  startFrame: number;
  durationInFrames: number;
  x?: number;
  y?: number;
  width?: number;
  fontSize?: number;
};

export const CodeHighlight: React.FC<CodeHighlightProps> = ({
  code,
  highlightedLines = [],
  startFrame,
  durationInFrames,
  x = 100,
  y = 100,
  width = 600,
  fontSize = 14,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;

  const opacity = interpolate(
    relativeFrame,
    [0, 0.3 * fps, durationInFrames - 0.3 * fps, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateRight: 'clamp' }
  );

  const lines = code.split('\n');

  // 简单的语法高亮
  const highlightCode = (line: string, lineNum: number) => {
    let highlighted = line;
    const isHighlighted = highlightedLines.includes(lineNum);

    // 关键字高亮
    highlighted = highlighted.replace(
      /\b(pipeline|agent|docker|image|stages|stage|steps|triggers|githubPush|sh|npm)\b/g,
      '<span style="color: #3B82F6; font-weight: 600;">$1</span>'
    );

    // 字符串高亮
    highlighted = highlighted.replace(
      /(['"])([^'"]+)\1/g,
      '<span style="color: #10B981;">$1$2$1</span>'
    );

    // 注释高亮
    highlighted = highlighted.replace(
      /(\/\/.*)/g,
      '<span style="color: #94A3B8; font-style: italic;">$1</span>'
    );

    return {
      html: highlighted,
      isHighlighted,
    };
  };

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width,
          opacity,
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 8,
          padding: 20,
          fontFamily: 'monospace',
          fontSize,
          lineHeight: 1.6,
          color: '#E2E8F0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        {lines.map((line, index) => {
          const { html, isHighlighted } = highlightCode(line, index + 1);
          return (
            <div
              key={index}
              style={{
                backgroundColor: isHighlighted ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                padding: '2px 8px',
                margin: '2px 0',
                borderRadius: 4,
                borderLeft: isHighlighted ? '3px solid #3B82F6' : '3px solid transparent',
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: html || ' ' }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
