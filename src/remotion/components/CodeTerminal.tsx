import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

type CodeTerminalProps = {
  command: string;
  output?: string;
  startFrame?: number;
};

export const CodeTerminal: React.FC<CodeTerminalProps> = ({
  command,
  output,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  const charsPerFrame = 2; // 每帧显示2个字符

  // 命令打字机效果
  const commandChars = Math.min(
    command.length,
    Math.floor((relativeFrame * charsPerFrame) / fps)
  );
  const displayedCommand = command.slice(0, commandChars);

  // 输出显示（命令完成后）
  const outputStartFrame = (command.length / charsPerFrame) * fps;
  const outputOpacity = interpolate(
    relativeFrame,
    [outputStartFrame, outputStartFrame + 0.5 * fps],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // 光标闪烁
  const cursorOpacity = Math.sin((relativeFrame / fps) * 10) > 0 ? 1 : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0E1A',
        padding: 40,
        fontFamily: 'monospace',
      }}
    >
      {/* 终端窗口 */}
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#0F172A',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* 终端标题栏 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#FF5F57',
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#FFBD2E',
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#28CA42',
            }}
          />
          <span style={{ marginLeft: 12, color: '#94A3B8', fontSize: 12 }}>
            Terminal
          </span>
        </div>

        {/* 命令提示符 */}
        <div style={{ color: '#3B82F6', fontSize: 16, marginBottom: 8 }}>
          $ {displayedCommand}
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 16,
              backgroundColor: '#3B82F6',
              marginLeft: 4,
              opacity: cursorOpacity,
            }}
          />
        </div>

        {/* 输出 */}
        {output && relativeFrame > outputStartFrame && (
          <div
            style={{
              color: '#10B981',
              fontSize: 16,
              opacity: outputOpacity,
              whiteSpace: 'pre-wrap',
              marginTop: 12,
            }}
          >
            {output}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
