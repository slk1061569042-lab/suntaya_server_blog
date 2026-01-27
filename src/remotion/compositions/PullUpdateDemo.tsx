import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { GitFlowAnimation } from '../components/GitFlowAnimation';
import { CodeTerminal } from '../components/CodeTerminal';

type PullUpdateDemoProps = {
  title: string;
};

export const PullUpdateDemo: React.FC<PullUpdateDemoProps> = ({ title }) => {
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
          output="remote: Enumerating objects: 5, done.\nremote: Counting objects: 100% (5/5), done.\nUpdating abc1234..def5678\nFast-forward\n app.py | 5 +++++\n 1 file changed, 5 insertions(+)"
          startFrame={1.5 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* 更新工作区 (4-6.5秒) */}
      <Sequence from={4 * fps} durationInFrames={2.5 * fps}>
        <GitFlowAnimation
          command="checkout"
          fromArea="local"
          toArea="working"
          fileName="app.py"
        />
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
              color: '#10B981',
              opacity: interpolate(
                frame - 4 * fps,
                [0, 0.5 * fps, 2 * fps, 2.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            Pull 后，本地仓库已更新
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 查看状态 (6.5-8.5秒) */}
      <Sequence from={6.5 * fps} durationInFrames={2 * fps}>
        <CodeTerminal
          command="git status"
          output="On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean"
          startFrame={6.5 * fps}
          durationInFrames={2 * fps}
        />
      </Sequence>

      {/* 总结 (8.5-10秒) */}
      <Sequence from={8.5 * fps} durationInFrames={1.5 * fps}>
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
                frame - 8.5 * fps,
                [0, 0.3 * fps, 1.2 * fps, 1.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 16 }}>
              Pull = Fetch + Merge
            </div>
            <div>
              自动将远程更改合并到本地
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
