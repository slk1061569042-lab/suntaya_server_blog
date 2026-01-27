import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { GitFlowAnimation } from '../components/GitFlowAnimation';
import { CodeTerminal } from '../components/CodeTerminal';

type StagingAreaDemoProps = {
  title: string;
};

export const StagingAreaDemo: React.FC<StagingAreaDemoProps> = ({ title }) => {
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

      {/* 暂存区位置说明 (1.5-3秒) */}
      <Sequence from={1.5 * fps} durationInFrames={1.5 * fps}>
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
              fontSize: 24,
              color: '#CBD5E1',
              textAlign: 'center',
              opacity: interpolate(
                frame - 1.5 * fps,
                [0, 0.3 * fps, 1.2 * fps, 1.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 20 }}>
              暂存区位置：<code style={{ color: '#F97316' }}>.git/index</code>
            </div>
            <div>
              作用：准备提交的文件快照
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 添加到暂存区演示 (3-5.5秒) */}
      <Sequence from={3 * fps} durationInFrames={2.5 * fps}>
        <GitFlowAnimation
          command="add"
          fromArea="working"
          toArea="staging"
          fileName="file1.txt"
        />
        <CodeTerminal
          command="git add file1.txt"
          output="文件已添加到暂存区"
          startFrame={3 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* 查看暂存区状态 (5.5-7.5秒) */}
      <Sequence from={5.5 * fps} durationInFrames={2 * fps}>
        <CodeTerminal
          command="git status"
          output={'Changes to be committed:\n  (use "git reset HEAD <file>" to unstage)\n\n\tmodified:   file1.txt'}
          startFrame={5.5 * fps}
          durationInFrames={2 * fps}
        />
      </Sequence>

      {/* 暂存区 vs 本地仓库 (7.5-10秒) */}
      <Sequence from={7.5 * fps} durationInFrames={2.5 * fps}>
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
                frame - 7.5 * fps,
                [0, 0.5 * fps, 2 * fps, 2.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <strong style={{ color: '#F97316' }}>暂存区</strong>：临时存储，可以修改
            </div>
            <div>
              <strong style={{ color: '#10B981' }}>本地仓库</strong>：永久存储，已提交
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
