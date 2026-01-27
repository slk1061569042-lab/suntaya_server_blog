import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { CodeTerminal } from '../components/CodeTerminal';
import { GitFlowAnimation } from '../components/GitFlowAnimation';

type StagingConflictDetailsDemoProps = {
  title: string;
};

export const StagingConflictDetailsDemo: React.FC<StagingConflictDetailsDemoProps> = ({ title }) => {
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

      {/* Pull 前状态 (1.5-3.5秒) */}
      <Sequence from={1.5 * fps} durationInFrames={2 * fps}>
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
              opacity: interpolate(
                frame - 1.5 * fps,
                [0, 0.5 * fps, 1.5 * fps, 2 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 20, color: '#3B82F6', fontWeight: 'bold' }}>
              Pull 前：暂存区为空
            </div>
            <div style={{ marginLeft: 20 }}>
              工作区有修改，但未暂存
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Pull 操作 (3.5-6秒) */}
      <Sequence from={3.5 * fps} durationInFrames={2.5 * fps}>
        <GitFlowAnimation
          command="pull"
          fromArea="remote"
          toArea="local"
          fileName="app.py"
        />
        <CodeTerminal
          command="git pull origin main"
          output="CONFLICT (content): Merge conflict in app.py"
          startFrame={3.5 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* Pull 后状态 (6-8.5秒) */}
      <Sequence from={6 * fps} durationInFrames={2.5 * fps}>
        <CodeTerminal
          command="git status"
          output={'Unmerged paths:\n  both modified:   app.py\n\nChanges not staged for commit:\n  modified:   utils.py'}
          startFrame={6 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* 说明 (8.5-11秒) */}
      <Sequence from={8.5 * fps} durationInFrames={2.5 * fps}>
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
              fontSize: 18,
              color: '#CBD5E1',
              textAlign: 'center',
              opacity: interpolate(
                frame - 8.5 * fps,
                [0, 0.5 * fps, 2 * fps, 2.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 16 }}>
              Pull 后，冲突文件进入&quot;Unmerged&quot;状态
            </div>
            <div>
              需要手动解决冲突并标记
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
