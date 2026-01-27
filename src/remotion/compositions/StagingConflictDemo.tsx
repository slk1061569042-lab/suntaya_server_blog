import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { CodeTerminal } from '../components/CodeTerminal';
import { GitFlowAnimation } from '../components/GitFlowAnimation';

type StagingConflictDemoProps = {
  title: string;
};

export const StagingConflictDemo: React.FC<StagingConflictDemoProps> = ({ title }) => {
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

      {/* Pull 操作 (1.5-4秒) */}
      <Sequence from={1.5 * fps} durationInFrames={2.5 * fps}>
        <GitFlowAnimation
          command="pull"
          fromArea="remote"
          toArea="local"
          fileName="app.py"
        />
        <CodeTerminal
          command="git pull origin main"
          output="CONFLICT (content): Merge conflict in app.py"
          startFrame={1.5 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* 查看状态 (4-6秒) */}
      <Sequence from={4 * fps} durationInFrames={2 * fps}>
        <CodeTerminal
          command="git status"
          output={'Unmerged paths:\n  (use "git add <file>..." to mark resolution)\n    both modified:   app.py'}
          startFrame={4 * fps}
          durationInFrames={2 * fps}
        />
      </Sequence>

      {/* 解决冲突后添加到暂存区 (6-8.5秒) */}
      <Sequence from={6 * fps} durationInFrames={2.5 * fps}>
        <CodeTerminal
          command="git add app.py"
          output="冲突已解决，文件已添加到暂存区"
          startFrame={6 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* 提交 (8.5-11秒) */}
      <Sequence from={8.5 * fps} durationInFrames={2.5 * fps}>
        <CodeTerminal
          command="git commit -m 'Resolve conflict'"
          output="[main abc1234] Resolve conflict"
          startFrame={8.5 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* 总结 (11-12.5秒) */}
      <Sequence from={11 * fps} durationInFrames={1.5 * fps}>
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
              color: '#10B981',
              textAlign: 'center',
              opacity: interpolate(
                frame - 11 * fps,
                [0, 0.3 * fps, 1.2 * fps, 1.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            解决冲突 → git add → git commit
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
