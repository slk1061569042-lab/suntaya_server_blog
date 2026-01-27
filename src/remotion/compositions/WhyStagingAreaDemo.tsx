import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { CodeTerminal } from '../components/CodeTerminal';

type WhyStagingAreaDemoProps = {
  title: string;
};

export const WhyStagingAreaDemo: React.FC<WhyStagingAreaDemoProps> = ({ title }) => {
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

      {/* 问题：为什么需要暂存区？ (1.5-3.5秒) */}
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
              fontSize: 24,
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
            为什么 Git 需要暂存区？
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 原因 1: 选择性提交 (3.5-6秒) */}
      <Sequence from={3.5 * fps} durationInFrames={2.5 * fps}>
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
                frame - 3.5 * fps,
                [0, 0.5 * fps, 2 * fps, 2.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 20, color: '#3B82F6', fontWeight: 'bold' }}>
              原因 1：选择性提交
            </div>
            <div style={{ marginLeft: 20 }}>
              可以只提交部分文件，而不是所有修改
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 原因 2: 预览提交内容 (6-8.5秒) */}
      <Sequence from={6 * fps} durationInFrames={2.5 * fps}>
        <CodeTerminal
          command="git diff --staged"
          output="查看暂存区的内容，确认要提交什么"
          startFrame={6 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* 原因 3: 分批提交 (8.5-11秒) */}
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
              fontSize: 20,
              color: '#CBD5E1',
              opacity: interpolate(
                frame - 8.5 * fps,
                [0, 0.5 * fps, 2 * fps, 2.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 20, color: '#10B981', fontWeight: 'bold' }}>
              原因 3：分批提交
            </div>
            <div style={{ marginLeft: 20 }}>
              可以分多次提交，每次提交一个功能
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 总结 (11-13秒) */}
      <Sequence from={11 * fps} durationInFrames={2 * fps}>
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
                frame - 11 * fps,
                [0, 0.5 * fps, 1.5 * fps, 2 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            暂存区让你有更多控制权
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
