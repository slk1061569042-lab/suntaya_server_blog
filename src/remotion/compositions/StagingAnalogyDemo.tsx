import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { CodeTerminal } from '../components/CodeTerminal';

type StagingAnalogyDemoProps = {
  title: string;
};

export const StagingAnalogyDemo: React.FC<StagingAnalogyDemoProps> = ({ title }) => {
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

      {/* 暂存区类比 (1.5-4秒) */}
      <Sequence from={1.5 * fps} durationInFrames={2.5 * fps}>
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
                [0, 0.5 * fps, 2 * fps, 2.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 20, color: '#F97316', fontWeight: 'bold' }}>
              暂存区 = 购物车
            </div>
            <div style={{ marginBottom: 16 }}>
              工作区 = 商店货架（所有商品）
            </div>
            <div style={{ marginBottom: 16 }}>
              暂存区 = 购物车（选中的商品）
            </div>
            <div>
              提交 = 结账（购物车里的商品）
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 强制推送警告 (4-7秒) */}
      <Sequence from={4 * fps} durationInFrames={3 * fps}>
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
                frame - 4 * fps,
                [0, 0.5 * fps, 2.5 * fps, 3 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 20, fontWeight: 'bold' }}>
              强制推送（--force）危险！
            </div>
            <div style={{ marginBottom: 16 }}>
              会覆盖服务器上的代码
            </div>
            <div>
              可能导致团队成员的代码丢失
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 安全替代方案 (7-9.5秒) */}
      <Sequence from={7 * fps} durationInFrames={2.5 * fps}>
        <CodeTerminal
          command="git push --force-with-lease"
          output="更安全的强制推送，会检查远程是否有新提交"
          startFrame={7 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
