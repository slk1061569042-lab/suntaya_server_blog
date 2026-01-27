import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { CodeTerminal } from '../components/CodeTerminal';

type ConflictChecklistDemoProps = {
  title: string;
};

export const ConflictChecklistDemo: React.FC<ConflictChecklistDemoProps> = ({ title }) => {
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

      {/* 检查清单 (1.5-8秒) */}
      <Sequence from={1.5 * fps} durationInFrames={6.5 * fps}>
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
                [0, 0.5 * fps, 6 * fps, 6.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 20, color: '#3B82F6', fontWeight: 'bold', fontSize: 24 }}>
              冲突解决检查清单
            </div>
            <div style={{ marginBottom: 16, marginLeft: 20 }}>
              ✓ 1. 识别冲突文件
            </div>
            <div style={{ marginBottom: 16, marginLeft: 20 }}>
              ✓ 2. 理解左右版本含义
            </div>
            <div style={{ marginBottom: 16, marginLeft: 20 }}>
              ✓ 3. 编辑冲突文件，选择保留的代码
            </div>
            <div style={{ marginBottom: 16, marginLeft: 20 }}>
              ✓ 4. 删除所有冲突标记
            </div>
            <div style={{ marginBottom: 16, marginLeft: 20 }}>
              ✓ 5. 保存文件
            </div>
            <div style={{ marginBottom: 16, marginLeft: 20 }}>
              ✓ 6. git add 标记已解决
            </div>
            <div style={{ marginLeft: 20 }}>
              ✓ 7. git commit 完成合并
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 验证步骤 (8-10.5秒) */}
      <Sequence from={8 * fps} durationInFrames={2.5 * fps}>
        <CodeTerminal
          command="git status"
          output={'On branch main\nAll conflicts fixed but you are still merging.\n(use "git commit" to conclude merge)'}
          startFrame={8 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* 完成 (10.5-12秒) */}
      <Sequence from={10.5 * fps} durationInFrames={1.5 * fps}>
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
              color: '#10B981',
              fontWeight: 'bold',
              opacity: interpolate(
                frame - 10.5 * fps,
                [0, 0.3 * fps, 1.2 * fps, 1.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            ✓ 所有步骤完成
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
