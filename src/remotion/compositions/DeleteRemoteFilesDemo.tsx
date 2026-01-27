import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { CodeTerminal } from '../components/CodeTerminal';

type DeleteRemoteFilesDemoProps = {
  title: string;
};

export const DeleteRemoteFilesDemo: React.FC<DeleteRemoteFilesDemoProps> = ({ title }) => {
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

      {/* 方法 1: 正常删除 (1.5-4.5秒) */}
      <Sequence from={1.5 * fps} durationInFrames={3 * fps}>
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
              color: '#3B82F6',
              fontWeight: 'bold',
              marginBottom: 20,
              opacity: interpolate(
                frame - 1.5 * fps,
                [0, 0.3 * fps, 2.7 * fps, 3 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            方法 1：正常删除（保留历史）
          </div>
        </AbsoluteFill>
        <CodeTerminal
          command="git rm secret.txt && git commit -m 'Remove secret.txt' && git push"
          output="文件已从工作区删除并提交"
          startFrame={1.5 * fps}
          durationInFrames={3 * fps}
        />
      </Sequence>

      {/* 说明 (4.5-6.5秒) */}
      <Sequence from={4.5 * fps} durationInFrames={2 * fps}>
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
                frame - 4.5 * fps,
                [0, 0.5 * fps, 1.5 * fps, 2 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 16 }}>
              文件从工作区删除，但历史记录中仍存在
            </div>
            <div>
              可以通过历史记录恢复
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 方法 2: 从历史中删除 (6.5-9秒) */}
      <Sequence from={6.5 * fps} durationInFrames={2.5 * fps}>
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
              color: '#F97316',
              fontWeight: 'bold',
              marginBottom: 20,
              opacity: interpolate(
                frame - 6.5 * fps,
                [0, 0.3 * fps, 2.2 * fps, 2.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            方法 2：从历史中删除（使用 filter-branch）
          </div>
        </AbsoluteFill>
        <CodeTerminal
          command="git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch secret.txt' --prune-empty --tag-name-filter cat -- --all"
          output="重写历史，完全删除文件"
          startFrame={6.5 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* 警告 (9-11秒) */}
      <Sequence from={9 * fps} durationInFrames={2 * fps}>
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
                frame - 9 * fps,
                [0, 0.5 * fps, 1.5 * fps, 2 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: 16 }}>
              危险操作！
            </div>
            <div>
              需要强制推送，团队成员需要重新克隆
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
