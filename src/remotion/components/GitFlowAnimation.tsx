import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

type GitFlowAnimationProps = {
  command: 'add' | 'commit' | 'push' | 'pull' | 'checkout';
  fromArea: 'working' | 'staging' | 'local' | 'remote';
  toArea: 'staging' | 'local' | 'remote' | 'working';
  fileName: string;
};

export const GitFlowAnimation: React.FC<GitFlowAnimationProps> = ({
  command,
  fromArea,
  toArea,
  fileName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 区域位置定义
  const areas = {
    working: { x: 200, y: 200, label: '工作区', color: '#3B82F6' },
    staging: { x: 500, y: 200, label: '暂存区', color: '#F97316' },
    local: { x: 800, y: 200, label: '本地仓库', color: '#10B981' },
    remote: { x: 1100, y: 200, label: '远程仓库', color: '#8B5CF6' },
  };

  const from = areas[fromArea];
  const to = areas[toArea];

  // 文件移动动画（0-2秒）
  const moveProgress = interpolate(
    frame,
    [0, 2 * fps],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateRight: 'clamp',
    }
  );

  // 文件位置
  const fileX = from.x + (to.x - from.x) * moveProgress;
  const fileY = from.y + (to.y - from.y) * moveProgress;

  // 箭头动画（0.5-2秒）
  const arrowOpacity = interpolate(
    frame,
    [0.5 * fps, 2 * fps],
    [0, 1],
    {
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0E1A',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* 区域标签 */}
      {Object.entries(areas).map(([key, area]) => (
        <div
          key={key}
          style={{
            position: 'absolute',
            left: area.x - 60,
            top: area.y - 60,
            width: 120,
            height: 60,
            backgroundColor: `${area.color}20`,
            border: `2px solid ${area.color}`,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: area.color,
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          {area.label}
        </div>
      ))}

      {/* 箭头 */}
      {frame > 0.5 * fps && (
        <svg
          style={{
            position: 'absolute',
            left: from.x + 60,
            top: from.y + 10,
            width: to.x - from.x - 120,
            height: 40,
            opacity: arrowOpacity,
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill={to.color} />
            </marker>
          </defs>
          <line
            x1="0"
            y1="20"
            x2={to.x - from.x - 120}
            y2="20"
            stroke={to.color}
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
          />
        </svg>
      )}

      {/* 移动的文件 */}
      <div
        style={{
          position: 'absolute',
          left: fileX - 40,
          top: fileY - 15,
          width: 80,
          height: 30,
          backgroundColor: '#1E293B',
          border: `2px solid ${to.color}`,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F1F5F9',
          fontSize: 12,
          fontWeight: '500',
          boxShadow: `0 4px 12px ${to.color}40`,
        }}
      >
        {fileName}
      </div>

      {/* 命令提示 */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#CBD5E1',
          fontSize: 24,
          fontWeight: 'bold',
          fontFamily: 'monospace',
          opacity: interpolate(
            frame,
            [0, 0.3 * fps, 1.7 * fps, 2 * fps],
            [0, 1, 1, 0],
            { extrapolateRight: 'clamp' }
          ),
        }}
      >
        git {command}
      </div>
    </AbsoluteFill>
  );
};
