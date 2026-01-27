import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { CodeTerminal } from '../components/CodeTerminal';

type ManualResolveDemoProps = {
  title: string;
};

export const ManualResolveDemo: React.FC<ManualResolveDemoProps> = ({ title }) => {
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

      {/* 步骤 1: 打开冲突文件 (1.5-3.5秒) */}
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
              opacity: interpolate(
                frame - 1.5 * fps,
                [0, 0.5 * fps, 1.5 * fps, 2 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 16, color: '#3B82F6', fontWeight: 'bold' }}>
              步骤 1：打开冲突文件
            </div>
            <div style={{ marginLeft: 20 }}>
              找到包含冲突标记的文件
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 步骤 2: 编辑冲突 (3.5-7秒) */}
      <Sequence from={3.5 * fps} durationInFrames={3.5 * fps}>
        <AbsoluteFill
          style={{
            padding: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '90%',
              height: '80%',
              backgroundColor: '#0F172A',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 12,
              padding: 24,
              fontFamily: 'monospace',
              fontSize: 14,
              color: '#E2E8F0',
              opacity: interpolate(
                frame - 3.5 * fps,
                [0, 0.5 * fps, 3 * fps, 3.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ color: '#F97316', marginBottom: 12, textDecoration: 'line-through', opacity: 0.5 }}>
              &lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
            </div>
            <div style={{ marginLeft: 20, marginBottom: 12, color: '#10B981' }}>
              username = &quot;Alice&quot;  ← 保留这个
            </div>
            <div style={{ color: '#3B82F6', marginBottom: 12, textDecoration: 'line-through', opacity: 0.5 }}>
              =======
            </div>
            <div style={{ marginLeft: 20, marginBottom: 12, textDecoration: 'line-through', opacity: 0.5 }}>
              name = &quot;Bob&quot;  ← 删除这个
            </div>
            <div style={{ color: '#F97316', textDecoration: 'line-through', opacity: 0.5 }}>
              &gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 步骤 3: 保存并提交 (7-10秒) */}
      <Sequence from={7 * fps} durationInFrames={3 * fps}>
        <CodeTerminal
          command="git add app.py && git commit -m 'Resolve conflict'"
          output="[main abc1234] Resolve conflict"
          startFrame={7 * fps}
          durationInFrames={3 * fps}
        />
      </Sequence>

      {/* 总结 (10-12秒) */}
      <Sequence from={10 * fps} durationInFrames={2 * fps}>
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
                frame - 10 * fps,
                [0, 0.5 * fps, 1.5 * fps, 2 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            手动编辑 → 删除标记 → 保存 → 提交
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
