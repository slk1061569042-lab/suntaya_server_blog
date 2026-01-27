import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { CodeTerminal } from '../components/CodeTerminal';

type ConflictResolutionDemoProps = {
  title: string;
};

export const ConflictResolutionDemo: React.FC<ConflictResolutionDemoProps> = ({ title }) => {
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

      {/* Pull 操作导致冲突 (1.5-4秒) */}
      <Sequence from={1.5 * fps} durationInFrames={2.5 * fps}>
        <CodeTerminal
          command="git pull origin main"
          output="Auto-merging app.py\nCONFLICT (content): Merge conflict in app.py\nAutomatic merge failed; fix conflicts and then commit the result."
          startFrame={1.5 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* 冲突文件内容 (4-7秒) */}
      <Sequence from={4 * fps} durationInFrames={3 * fps}>
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
                frame - 4 * fps,
                [0, 0.5 * fps, 2.5 * fps, 3 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ color: '#F97316', marginBottom: 12 }}>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</div>
            <div style={{ marginLeft: 20, marginBottom: 12 }}>你的代码版本</div>
            <div style={{ color: '#3B82F6', marginBottom: 12 }}>=======</div>
            <div style={{ marginLeft: 20, marginBottom: 12 }}>服务器上的代码版本</div>
            <div style={{ color: '#F97316' }}>&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main</div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 解决冲突步骤 (7-10秒) */}
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
            <div style={{ marginBottom: 16 }}>
              1. 编辑冲突文件，选择要保留的代码
            </div>
            <div style={{ marginBottom: 16 }}>
              2. 删除冲突标记（&lt;&lt;&lt;&lt;&lt;&lt;&lt;、=======、&gt;&gt;&gt;&gt;&gt;&gt;&gt;）
            </div>
            <div>
              3. 保存文件并提交
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 提交解决后的代码 (10-12.5秒) */}
      <Sequence from={10 * fps} durationInFrames={2.5 * fps}>
        <CodeTerminal
          command="git add app.py && git commit -m 'Resolve merge conflict'"
          output="[main abc1234] Resolve merge conflict"
          startFrame={10 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
