import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { PipelineStage } from './PipelineStage';

type FlowStage = {
  name: string;
  icon: string;
  description?: string;
  startFrame: number;
  durationInFrames: number;
};

type FlowDiagramProps = {
  stages: FlowStage[];
  startFrame: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
};

export const FlowDiagram: React.FC<FlowDiagramProps> = ({
  stages,
  startFrame,
  width = 1280,
  height = 720,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  
  // 计算每个阶段的位置（水平排列）
  const stageWidth = width / (stages.length + 1);
  const centerY = height / 2;

  return (
    <AbsoluteFill>
      {/* 连接线 */}
      {stages.map((stage, index) => {
        if (index === stages.length - 1) return null;
        
        const currentX = (index + 1) * stageWidth;
        const nextX = (index + 2) * stageWidth;
        const lineStartFrame = stage.startFrame;
        const lineEndFrame = stages[index + 1].startFrame;
        
        const lineProgress = interpolate(
          relativeFrame,
          [lineStartFrame, lineEndFrame],
          [0, 1],
          {
            easing: Easing.out(Easing.cubic),
            extrapolateRight: 'clamp',
          }
        );

        const lineOpacity = interpolate(
          relativeFrame,
          [lineStartFrame - 0.2 * fps, lineStartFrame, lineEndFrame, lineEndFrame + 0.2 * fps],
          [0, 1, 1, 0],
          { extrapolateRight: 'clamp' }
        );

        return (
          <svg
            key={`line-${index}`}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            {/* 静态连接线 */}
            <line
              x1={currentX}
              y1={centerY}
              x2={nextX}
              y2={centerY}
              stroke="#475569"
              strokeWidth="2"
              opacity={lineOpacity * 0.3}
            />
            
            {/* 流动动画线 */}
            {lineProgress > 0 && (
              <line
                x1={currentX}
                y1={centerY}
                x2={currentX + (nextX - currentX) * lineProgress}
                y2={centerY}
                stroke="#3B82F6"
                strokeWidth="3"
                opacity={lineOpacity}
                strokeDasharray="10 5"
              />
            )}
          </svg>
        );
      })}

      {/* 阶段卡片 */}
      {stages.map((stage, index) => {
        const x = (index + 1) * stageWidth;
        const isActive = relativeFrame >= stage.startFrame && relativeFrame < stage.startFrame + stage.durationInFrames;
        const isCompleted = relativeFrame >= stage.startFrame + stage.durationInFrames;

        return (
          <PipelineStage
            key={stage.name}
            name={stage.name}
            icon={stage.icon}
            description={stage.description}
            startFrame={stage.startFrame}
            durationInFrames={stage.durationInFrames}
            x={x}
            y={centerY}
            isActive={isActive}
            isCompleted={isCompleted}
          />
        );
      })}
    </AbsoluteFill>
  );
};
