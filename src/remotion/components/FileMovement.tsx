import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

type FileMovementProps = {
  files: string[];
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  startFrame?: number;
  durationInFrames?: number;
};

export const FileMovement: React.FC<FileMovementProps> = ({
  files,
  fromX,
  fromY,
  toX,
  toY,
  startFrame = 0,
  durationInFrames = 90,
}) => {
  const frame = useCurrentFrame();

  const relativeFrame = frame - startFrame;

  return (
    <AbsoluteFill>
      {files.map((file, index) => {
        const delay = index * 10; // 每个文件延迟10帧
        const fileProgress = interpolate(
          relativeFrame,
          [delay, delay + durationInFrames],
          [0, 1],
          {
            easing: Easing.out(Easing.cubic),
            extrapolateRight: 'clamp',
          }
        );

        const x = fromX + (toX - fromX) * fileProgress;
        const y = fromY + (toY - fromY) * fileProgress;

        const opacity = interpolate(
          relativeFrame,
          [delay, delay + 10, delay + durationInFrames - 10, delay + durationInFrames],
          [0, 1, 1, 0],
          { extrapolateRight: 'clamp' }
        );

        return (
          <div
            key={file}
            style={{
              position: 'absolute',
              left: x - 50,
              top: y - 15,
              width: 100,
              height: 30,
              backgroundColor: '#1E293B',
              border: '2px solid #3B82F6',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F1F5F9',
              fontSize: 12,
              fontWeight: '500',
              opacity,
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
            }}
          >
            {file}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
