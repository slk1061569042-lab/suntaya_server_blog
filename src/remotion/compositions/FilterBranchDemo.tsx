import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { CodeTerminal } from '../components/CodeTerminal';

type FilterBranchDemoProps = {
  title: string;
};

export const FilterBranchDemo: React.FC<FilterBranchDemoProps> = ({ title }) => {
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

      {/* 问题说明 (1.5-3.5秒) */}
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
              textAlign: 'center',
              opacity: interpolate(
                frame - 1.5 * fps,
                [0, 0.5 * fps, 1.5 * fps, 2 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 20, color: '#F97316', fontWeight: 'bold' }}>
              需要从 Git 历史中删除文件
            </div>
            <div>
              例如：误提交了敏感信息
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* filter-branch 命令 (3.5-6秒) */}
      <Sequence from={3.5 * fps} durationInFrames={2.5 * fps}>
        <CodeTerminal
          command="git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch secret.txt' --prune-empty --tag-name-filter cat -- --all"
          output="Rewrite abc1234 (1/10)\nRewrite def5678 (2/10)\n..."
          startFrame={3.5 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* 警告 (6-8.5秒) */}
      <Sequence from={6 * fps} durationInFrames={2.5 * fps}>
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
              color: '#F97316',
              textAlign: 'center',
              opacity: interpolate(
                frame - 6 * fps,
                [0, 0.5 * fps, 2 * fps, 2.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 16, fontWeight: 'bold' }}>
              警告：这会重写 Git 历史
            </div>
            <div>
              所有团队成员需要重新克隆仓库
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 推荐使用 filter-repo (8.5-11秒) */}
      <Sequence from={8.5 * fps} durationInFrames={2.5 * fps}>
        <CodeTerminal
          command="git filter-repo --path secret.txt --invert-paths"
          output="更快速、更安全的工具（需要单独安装）"
          startFrame={8.5 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
