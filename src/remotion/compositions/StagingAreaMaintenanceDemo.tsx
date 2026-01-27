import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { CodeTerminal } from '../components/CodeTerminal';
import { FileMovement } from '../components/FileMovement';

type StagingAreaMaintenanceDemoProps = {
  title: string;
};

export const StagingAreaMaintenanceDemo: React.FC<StagingAreaMaintenanceDemoProps> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0E1A',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* 标题 (0-1.5秒) */}
      <Sequence from={0} durationInFrames={1.5 * fps}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: '#F1F5F9',
              opacity: interpolate(
                frame,
                [0, 0.5 * fps, 1 * fps, 1.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            {title}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 添加多个文件到暂存区 (1.5-3.5秒) */}
      <Sequence from={1.5 * fps} durationInFrames={2 * fps}>
        <CodeTerminal
          command="git add app.py utils.py config.py"
          output="文件已添加到暂存区"
          startFrame={1.5 * fps}
          durationInFrames={2 * fps}
        />
      </Sequence>

      {/* 查看暂存区状态 (3.5-5.5秒) */}
      <Sequence from={3.5 * fps} durationInFrames={2 * fps}>
        <CodeTerminal
          command="git status"
          output={'Changes to be committed:\n  modified:   app.py\n  modified:   utils.py\n  modified:   config.py'}
          startFrame={3.5 * fps}
          durationInFrames={2 * fps}
        />
      </Sequence>

      {/* 从暂存区移除单个文件 (5.5-8秒) */}
      <Sequence from={5.5 * fps} durationInFrames={2.5 * fps}>
        <FileMovement
          files={['config.py']}
          fromX={500}
          fromY={300}
          toX={200}
          toY={300}
          startFrame={5.5 * fps}
          durationInFrames={2.5 * fps}
        />
        <CodeTerminal
          command="git reset config.py"
          output="文件已从暂存区移除，但工作区修改保留"
          startFrame={5.5 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* 查看状态 (8-10秒) */}
      <Sequence from={8 * fps} durationInFrames={2 * fps}>
        <CodeTerminal
          command="git status"
          output={'Changes to be committed:\n  modified:   app.py\n  modified:   utils.py\n\nChanges not staged for commit:\n  modified:   config.py'}
          startFrame={8 * fps}
          durationInFrames={2 * fps}
        />
      </Sequence>

      {/* 说明 (10-12秒) */}
      <Sequence from={10 * fps} durationInFrames={2 * fps}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 80,
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: '#CBD5E1',
              textAlign: 'center',
              opacity: interpolate(
                frame - 10 * fps,
                [0, 0.5 * fps, 1.5 * fps, 2 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <code style={{ color: '#3B82F6' }}>git reset &lt;file&gt;</code>：从暂存区移除，保留工作区修改
            </div>
            <div>
              <code style={{ color: '#3B82F6' }}>git restore --staged &lt;file&gt;</code>：同样效果（新命令）
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
