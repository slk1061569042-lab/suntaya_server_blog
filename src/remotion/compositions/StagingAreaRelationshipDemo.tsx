import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { GitFlowAnimation } from '../components/GitFlowAnimation';
import { CodeTerminal } from '../components/CodeTerminal';

type StagingAreaRelationshipDemoProps = {
  title: string;
};

export const StagingAreaRelationshipDemo: React.FC<StagingAreaRelationshipDemoProps> = ({ title }) => {
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

      {/* 工作区修改文件 (1.5-3.5秒) */}
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
            <div style={{ marginBottom: 20, color: '#3B82F6' }}>
              工作区：你正在编辑的文件
            </div>
            <div>
              <code style={{ color: '#F97316' }}>app.py</code> - 已修改但未暂存
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 添加到暂存区 (3.5-6秒) */}
      <Sequence from={3.5 * fps} durationInFrames={2.5 * fps}>
        <GitFlowAnimation
          command="add"
          fromArea="working"
          toArea="staging"
          fileName="app.py"
        />
        <CodeTerminal
          command="git add app.py"
          output="文件已添加到暂存区（创建快照）"
          startFrame={3.5 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* 关键说明：暂存区是快照 (6-9秒) */}
      <Sequence from={6 * fps} durationInFrames={3 * fps}>
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
                frame - 6 * fps,
                [0, 0.5 * fps, 2.5 * fps, 3 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 20, color: '#F97316', fontWeight: 'bold' }}>
              暂存区是快照，不是引用
            </div>
            <div style={{ marginBottom: 16 }}>
              工作区继续修改文件，暂存区的快照不变
            </div>
            <div>
              只有再次 <code style={{ color: '#3B82F6' }}>git add</code> 才会更新快照
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 继续修改工作区 (9-11.5秒) */}
      <Sequence from={9 * fps} durationInFrames={2.5 * fps}>
        <CodeTerminal
          command="echo 'new code' >> app.py"
          output="工作区文件已修改，但暂存区快照未变"
          startFrame={9 * fps}
          durationInFrames={2.5 * fps}
        />
      </Sequence>

      {/* 查看状态 (11.5-13.5秒) */}
      <Sequence from={11.5 * fps} durationInFrames={2 * fps}>
        <CodeTerminal
          command="git status"
          output={'Changes to be committed:\n  modified:   app.py\n\nChanges not staged for commit:\n  modified:   app.py'}
          startFrame={11.5 * fps}
          durationInFrames={2 * fps}
        />
      </Sequence>

      {/* 总结 (13.5-15秒) */}
      <Sequence from={13.5 * fps} durationInFrames={1.5 * fps}>
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
                frame - 13.5 * fps,
                [0, 0.3 * fps, 1.2 * fps, 1.5 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            同一文件可以同时出现在暂存区和工作区
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
