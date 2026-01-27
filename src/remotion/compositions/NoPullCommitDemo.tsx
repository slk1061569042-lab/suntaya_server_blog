import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { CodeTerminal } from '../components/CodeTerminal';

type NoPullCommitDemoProps = {
  title: string;
};

export const NoPullCommitDemo: React.FC<NoPullCommitDemoProps> = ({ title }) => {
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

      {/* 场景：不 Pull 直接提交 (1.5-4秒) */}
      <Sequence from={1.5 * fps} durationInFrames={2.5 * fps}>
        <CodeTerminal
          command="git add . && git commit -m 'Update code'"
          output="[main abc1234] Update code\n 1 file changed, 5 insertions(+)"
          startFrame={1.5 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* Push 被拒绝 (4-6.5秒) */}
      <Sequence from={4 * fps} durationInFrames={2.5 * fps}>
        <CodeTerminal
          command="git push origin main"
          output="To github.com:user/repo.git\n ! [rejected]        main -> main (non-fast-forward)\n error: failed to push some refs to 'origin/main'"
          startFrame={4 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* 错误说明 (6.5-9秒) */}
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
              textAlign: 'center',
              opacity: interpolate(
                frame - 6.5 * fps,
                [0, 0.5 * fps, 2 * fps, 2.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 20 }}>
              服务器上有新提交，你的本地代码已过时
            </div>
            <div>
              必须先 Pull 再 Push
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 正确流程 (9-12秒) */}
      <Sequence from={9 * fps} durationInFrames={3 * fps}>
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
              opacity: interpolate(
                frame - 9 * fps,
                [0, 0.5 * fps, 2.5 * fps, 3 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 16, color: '#10B981' }}>
              正确流程：
            </div>
            <div style={{ marginBottom: 12, marginLeft: 20 }}>
              1. git pull（拉取最新代码）
            </div>
            <div style={{ marginBottom: 12, marginLeft: 20 }}>
              2. 解决冲突（如果有）
            </div>
            <div style={{ marginBottom: 12, marginLeft: 20 }}>
              3. git add . && git commit
            </div>
            <div style={{ marginLeft: 20 }}>
              4. git push
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
