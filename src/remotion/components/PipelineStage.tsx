import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

type PipelineStageProps = {
  name: string;
  icon: string;
  description?: string;
  startFrame: number;
  durationInFrames: number;
  x: number;
  y: number;
  isActive?: boolean;
  isCompleted?: boolean;
};

export const PipelineStage: React.FC<PipelineStageProps> = ({
  name,
  icon,
  description,
  startFrame,
  durationInFrames,
  x,
  y,
  isActive = false,
  isCompleted = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  
  // 出现动画
  const opacity = interpolate(
    relativeFrame,
    [0, 0.3 * fps],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // 缩放动画
  const scale = interpolate(
    relativeFrame,
    [0, 0.3 * fps],
    [0.8, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateRight: 'clamp'
    }
  );

  // 高亮动画（如果激活）
  const glowIntensity = isActive
    ? interpolate(
        relativeFrame,
        [0, durationInFrames],
        [0.3, 0.6],
        {
          extrapolateRight: 'clamp'
        }
      )
    : isCompleted
    ? 0.2
    : 0;

  const borderColor = isActive
    ? '#3B82F6'
    : isCompleted
    ? '#10B981'
    : '#475569';

  const bgColor = isActive
    ? 'rgba(59, 130, 246, 0.1)'
    : isCompleted
    ? 'rgba(16, 185, 129, 0.1)'
    : 'rgba(30, 41, 59, 0.5)';

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: x - 80,
          top: y - 60,
          width: 160,
          height: 120,
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {/* 卡片 */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: bgColor,
            border: `2px solid ${borderColor}`,
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            boxShadow: `0 0 ${glowIntensity * 20}px ${borderColor}`,
            transition: 'all 0.3s',
          }}
        >
          {/* 图标 */}
          <div
            style={{
              fontSize: 32,
              marginBottom: 8,
              filter: isActive ? 'brightness(1.2)' : 'brightness(0.8)',
            }}
          >
            {icon}
          </div>
          
          {/* 名称 */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: isActive ? '#3B82F6' : isCompleted ? '#10B981' : '#CBD5E1',
              textAlign: 'center',
              marginBottom: 4,
            }}
          >
            {name}
          </div>
          
          {/* 描述 */}
          {description && (
            <div
              style={{
                fontSize: 10,
                color: '#94A3B8',
                textAlign: 'center',
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
