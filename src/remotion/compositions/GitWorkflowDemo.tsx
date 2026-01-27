import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { GitFlowAnimation } from '../components/GitFlowAnimation';
import { CodeTerminal } from '../components/CodeTerminal';

type GitWorkflowDemoProps = {
  title: string;
};

export const GitWorkflowDemo: React.FC<GitWorkflowDemoProps> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0E1A',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* 标题动画 (0-2秒) */}
      <Sequence from={0} durationInFrames={2 * fps}>
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
                [0, 0.5 * fps, 1.5 * fps, 2 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#CBD5E1',
              marginTop: 20,
              opacity: interpolate(
                frame,
                [0.5 * fps, 1 * fps, 1.5 * fps, 2 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            Git 完整工作流程演示
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Git Add 动画 (2-5秒) */}
      <Sequence from={2 * fps} durationInFrames={3 * fps}>
        <GitFlowAnimation
          command="add"
          fromArea="working"
          toArea="staging"
          fileName="app.py"
        />
        <CodeTerminal
          command="git add app.py"
          output="文件已添加到暂存区"
          startFrame={2 * fps}
          durationInFrames={3 * fps}
        />
      </Sequence>

      {/* Git Commit 动画 (5-8秒) */}
      <Sequence from={5 * fps} durationInFrames={3 * fps}>
        <GitFlowAnimation
          command="commit"
          fromArea="staging"
          toArea="local"
          fileName="app.py"
        />
        <CodeTerminal
          command="git commit -m 'Update app'"
          output="[main abc1234] Update app\n 1 file changed, 5 insertions(+)"
          startFrame={5 * fps}
          durationInFrames={3 * fps}
        />
      </Sequence>

      {/* Git Push 动画 (8-11秒) */}
      <Sequence from={8 * fps} durationInFrames={3 * fps}>
        <GitFlowAnimation
          command="push"
          fromArea="local"
          toArea="remote"
          fileName="app.py"
        />
        <CodeTerminal
          command="git push origin main"
          output="Enumerating objects: 5, done.\nWriting objects: 100% (3/3), done.\nTo github.com:user/repo.git"
          startFrame={8 * fps}
          durationInFrames={3 * fps}
        />
      </Sequence>

      {/* 总结 (11-13秒) */}
      <Sequence from={11 * fps} durationInFrames={2 * fps}>
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
              fontSize: 36,
              fontWeight: 'bold',
              color: '#3B82F6',
              opacity: interpolate(
                frame - 11 * fps,
                [0, 0.5 * fps, 1.5 * fps, 2 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            工作区 → 暂存区 → 本地仓库 → 远程仓库
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
