import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { CodeTerminal } from '../components/CodeTerminal';

type UnderstandConflictSidesDemoProps = {
  title: string;
};

export const UnderstandConflictSidesDemo: React.FC<UnderstandConflictSidesDemoProps> = ({ title }) => {
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

      {/* Pull 导致冲突 (1.5-3.5秒) */}
      <Sequence from={1.5 * fps} durationInFrames={2 * fps}>
        <CodeTerminal
          command="git pull origin main"
          output="CONFLICT (content): Merge conflict in app.py"
          startFrame={1.5 * fps}
          durationInFrames={2 * fps}
        />
      </Sequence>

      {/* 冲突文件内容说明 (3.5-7秒) */}
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
            <div style={{ color: '#F97316', marginBottom: 12, fontWeight: 'bold' }}>
              &lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (左边 - 你的代码)
            </div>
            <div style={{ marginLeft: 20, marginBottom: 12, color: '#3B82F6' }}>
              username = &quot;Alice&quot;
            </div>
            <div style={{ color: '#3B82F6', marginBottom: 12, fontWeight: 'bold' }}>
              =======
            </div>
            <div style={{ marginLeft: 20, marginBottom: 12, color: '#10B981' }}>
              name = &quot;Bob&quot;
            </div>
            <div style={{ color: '#F97316', fontWeight: 'bold' }}>
              &gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main (右边 - 服务器代码)
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 说明 (7-10秒) */}
      <Sequence from={7 * fps} durationInFrames={3 * fps}>
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
                frame - 7 * fps,
                [0, 0.5 * fps, 2.5 * fps, 3 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <span style={{ color: '#F97316' }}>左边 (HEAD)</span>：你本地的代码
            </div>
            <div style={{ marginBottom: 20 }}>
              <span style={{ color: '#10B981' }}>右边 (origin/main)</span>：服务器上的代码
            </div>
            <div>
              选择要保留的版本，删除冲突标记
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
