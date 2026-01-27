import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { FileMovement } from '../components/FileMovement';
import { CodeTerminal } from '../components/CodeTerminal';

type CommitFilesDemoProps = {
  title: string;
};

export const CommitFilesDemo: React.FC<CommitFilesDemoProps> = ({ title }) => {
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

      {/* 工作区文件 (1.5-3秒) */}
      <Sequence from={1.5 * fps} durationInFrames={1.5 * fps}>
        <AbsoluteFill
          style={{
            padding: 80,
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: '#CBD5E1',
              opacity: interpolate(
                frame - 1.5 * fps,
                [0, 0.3 * fps, 1.2 * fps, 1.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 20 }}>工作区文件：</div>
            <div style={{ marginLeft: 20, color: '#3B82F6' }}>
              • app.py (已修改)
            </div>
            <div style={{ marginLeft: 20, color: '#3B82F6' }}>
              • utils.py (已修改)
            </div>
            <div style={{ marginLeft: 20, color: '#94A3B8' }}>
              • config.json (未修改)
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 添加到暂存区 (3-5秒) */}
      <Sequence from={3 * fps} durationInFrames={2 * fps}>
        <FileMovement
          files={['app.py', 'utils.py']}
          fromX={200}
          fromY={300}
          toX={500}
          toY={300}
          startFrame={3 * fps}
          durationInFrames={2 * fps}
        />
        <CodeTerminal
          command="git add app.py utils.py"
          output="文件已添加到暂存区"
          startFrame={3 * fps}
          durationInFrames={2 * fps}
        />
      </Sequence>

      {/* 查看暂存区状态 (5-7秒) */}
      <Sequence from={5 * fps} durationInFrames={2 * fps}>
        <CodeTerminal
          command="git status"
          output="Changes to be committed:\n  modified:   app.py\n  modified:   utils.py\n\nUntracked files:\n  config.json"
          startFrame={5 * fps}
          durationInFrames={2 * fps}
        />
      </Sequence>

      {/* Commit 说明 (7-9秒) */}
      <Sequence from={7 * fps} durationInFrames={2 * fps}>
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
                frame - 7 * fps,
                [0, 0.3 * fps, 1.7 * fps, 2 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <strong style={{ color: '#F97316' }}>只有暂存区的文件</strong>会被提交
            </div>
            <div>
              config.json 不会被提交（未添加到暂存区）
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Commit 操作 (9-11秒) */}
      <Sequence from={9 * fps} durationInFrames={2 * fps}>
        <FileMovement
          files={['app.py', 'utils.py']}
          fromX={500}
          fromY={300}
          toX={800}
          toY={300}
          startFrame={9 * fps}
          durationInFrames={2 * fps}
        />
        <CodeTerminal
          command="git commit -m 'Update app and utils'"
          output="[main abc1234] Update app and utils\n 2 files changed, 10 insertions(+)"
          startFrame={9 * fps}
          durationInFrames={2 * fps}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
