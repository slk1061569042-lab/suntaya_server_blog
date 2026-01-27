import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { FlowDiagram } from '../components/FlowDiagram';
import { CodeHighlight } from '../components/CodeHighlight';

export const JenkinsPipelineDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0E1A',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* 场景 1: 问题引入 - 对比手动 vs 自动化 (0-3秒) */}
      <Sequence from={0} durationInFrames={3 * fps}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 80,
          }}
        >
          {/* 左侧：手动部署 */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: interpolate(
                frame,
                [0, 0.3 * fps, 2.7 * fps, 3 * fps],
                [0, 0.3, 0.3, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ fontSize: 24, color: '#94A3B8', marginBottom: 20 }}>
              传统手动部署
            </div>
            <div style={{ fontSize: 48, marginBottom: 10 }}>👨‍💻</div>
            <div style={{ fontSize: 32, marginBottom: 10 }}>→</div>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🔨</div>
            <div style={{ fontSize: 32, marginBottom: 10 }}>→</div>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🚀</div>
            <div style={{ fontSize: 18, color: '#F97316', marginTop: 20 }}>
              ❌ 容易出错，耗时费力
            </div>
          </div>

          {/* 中间分隔线 */}
          <div
            style={{
              width: 2,
              height: '60%',
              backgroundColor: '#475569',
              margin: '0 40px',
            }}
          />

          {/* 右侧：自动化 Pipeline */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: interpolate(
                frame,
                [0, 0.3 * fps, 2.7 * fps, 3 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ fontSize: 24, color: '#3B82F6', marginBottom: 20, fontWeight: 'bold' }}>
              Jenkins Pipeline
            </div>
            <div style={{ fontSize: 48, marginBottom: 10 }}>💻</div>
            <div style={{ fontSize: 32, marginBottom: 10, color: '#3B82F6' }}>⚡</div>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🤖</div>
            <div style={{ fontSize: 32, marginBottom: 10, color: '#3B82F6' }}>⚡</div>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🚀</div>
            <div style={{ fontSize: 18, color: '#10B981', marginTop: 20, fontWeight: 'bold' }}>
              ✅ 自动化，一键完成
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 场景 2: Pipeline 的核心价值 (3-7秒) */}
      <Sequence from={3 * fps} durationInFrames={4 * fps}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 80,
          }}
        >
          {[
            { icon: '⚙️', title: '自动化', desc: '代码提交即自动构建部署' },
            { icon: '📊', title: '可视化', desc: '清晰的构建流程和状态' },
            { icon: '🔄', title: '可重复', desc: '每次构建环境一致' },
          ].map((item) => {
            const cardStartFrame = 3 * fps + index * 0.8 * fps;
            const cardOpacity = interpolate(
              frame - cardStartFrame,
              [0, 0.3 * fps, 3.2 * fps - index * 0.8 * fps, 3.5 * fps - index * 0.8 * fps],
              [0, 1, 1, 0],
              { extrapolateRight: 'clamp' }
            );
            const cardScale = interpolate(
              frame - cardStartFrame,
              [0, 0.3 * fps],
              [0.8, 1],
              {
                easing: Easing.out(Easing.cubic),
                extrapolateRight: 'clamp',
              }
            );

            return (
              <div
                key={item.title}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  margin: '0 20px',
                  opacity: cardOpacity,
                  transform: `scale(${cardScale})`,
                }}
              >
                <div
                  style={{
                    width: 200,
                    height: 200,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    border: '2px solid #3B82F6',
                    borderRadius: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                  }}
                >
                  <div style={{ fontSize: 64, marginBottom: 16 }}>{item.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#3B82F6', marginBottom: 8 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 14, color: '#CBD5E1', textAlign: 'center' }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      </Sequence>

      {/* 场景 3: 从 Git 到 Jenkins 再到服务器的完整链路 (7-13秒) */}
      <Sequence from={7 * fps} durationInFrames={6 * fps}>
        <AbsoluteFill>
          {/* 炫酷背景：动态渐变 + 网格线 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 0% 0%, rgba(59,130,246,0.35), transparent 55%), ' +
                'radial-gradient(circle at 100% 100%, rgba(248,113,113,0.25), transparent 55%), ' +
                'linear-gradient(to bottom right, #020617, #020617)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(15,23,42,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.6) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              opacity: 0.4,
            }}
          />

          {/* 标题 */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: 32,
              fontWeight: 'bold',
              letterSpacing: 1,
              color: '#F1F5F9',
              textShadow: '0 0 18px rgba(59,130,246,0.7)',
              opacity: interpolate(
                frame - 7 * fps,
                [0, 0.3 * fps, 5.7 * fps, 6 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
              transform: `translateY(${interpolate(
                frame - 7 * fps,
                [0, 0.5 * fps],
                [-20, 0],
                { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
              )}px)`,
            }}
          >
            从 Git 提交到服务器上线的完整路径
          </div>
          <div
            style={{
              position: 'absolute',
              top: 82,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: 18,
              color: '#CBD5E1',
              opacity: interpolate(
                frame - 7.4 * fps,
                [0, 0.3 * fps, 5.4 * fps, 5.8 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            一次 <span style={{ color: '#38BDF8' }}>git push</span>，自动穿过 Jenkins，
            最终把新版本送到 <span style={{ color: '#22C55E' }}>生产服务器</span>
          </div>

          {/* Git → Jenkins → 服务器 全链路 FlowDiagram */}
          <FlowDiagram
            stages={[
              {
                name: '本地 Git 提交',
                icon: '👨‍💻',
                description: 'git add / git commit -m 记录代码快照',
                startFrame: 7.8 * fps,
                durationInFrames: 0.8 * fps,
              },
              {
                name: '推送到远程仓库',
                icon: '📤',
                description: 'git push 将提交同步到远程 Git 服务器',
                startFrame: 8.6 * fps,
                durationInFrames: 0.8 * fps,
              },
              {
                name: 'Webhook 通知 Jenkins',
                icon: '⚡',
                description: '远程仓库通过 Webhook 回调 Jenkins',
                startFrame: 9.4 * fps,
                durationInFrames: 0.8 * fps,
              },
              {
                name: 'Jenkins 检出代码',
                icon: '🤖',
                description: 'Jenkins 从远程仓库拉取最新代码',
                startFrame: 10.2 * fps,
                durationInFrames: 0.8 * fps,
              },
              {
                name: '安装依赖 & 构建',
                icon: '⚙️',
                description: '执行 npm ci / npm run build 生成产物',
                startFrame: 11 * fps,
                durationInFrames: 0.8 * fps,
              },
              {
                name: '打包 & 部署',
                icon: '📦',
                description: '打包镜像或制品并上传到服务器',
                startFrame: 11.8 * fps,
                durationInFrames: 0.8 * fps,
              },
              {
                name: '生产服务器上线',
                icon: '🖥️',
                description: 'Nginx / Docker 容器加载新版本服务',
                startFrame: 12.6 * fps,
                durationInFrames: 0.8 * fps,
              },
            ]}
            startFrame={7 * fps}
            durationInFrames={6 * fps}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 场景 4: Pipeline 关键组件详解 (13-19秒) */}
      <Sequence from={13 * fps} durationInFrames={6 * fps}>
        <AbsoluteFill
          style={{
            display: 'flex',
            padding: 60,
          }}
        >
          {/* 左侧：代码 */}
          <div
            style={{
              flex: 1,
              opacity: interpolate(
                frame - 13 * fps,
                [0, 0.3 * fps, 5.7 * fps, 6 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <CodeHighlight
              code={`pipeline {
    agent {
        docker {
            image 'node:20-alpine'
        }
    }
    
    triggers {
        githubPush()
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }
    }
}`}
              highlightedLines={[2, 3, 4, 5, 8, 9, 12, 13, 14, 15, 16]}
              startFrame={13 * fps}
              durationInFrames={6 * fps}
              x={0}
              y={0}
              width={500}
            />
          </div>

          {/* 右侧：组件说明 */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingLeft: 40,
              opacity: interpolate(
                frame - 13 * fps,
                [0, 0.3 * fps, 5.7 * fps, 6 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            {[
              {
                icon: '🐳',
                title: 'Agent',
                desc: '运行环境：Docker 容器',
                startFrame: 13.5 * fps,
              },
              {
                icon: '⚡',
                title: 'Triggers',
                desc: '自动触发：GitHub Push',
                startFrame: 15 * fps,
              },
              {
                icon: '📋',
                title: 'Stages',
                desc: '构建阶段：Build → Deploy',
                startFrame: 16.5 * fps,
              },
            ].map((item) => {
              const itemOpacity = interpolate(
                frame - item.startFrame,
                [0, 0.3 * fps, 1.5 * fps, 2 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              );

              return (
                <div
                  key={item.title}
                  style={{
                    marginBottom: 30,
                    opacity: itemOpacity,
                    transform: `translateX(${interpolate(
                      frame - item.startFrame,
                      [0, 0.3 * fps],
                      [-20, 0],
                      { extrapolateRight: 'clamp' }
                    )}px)`,
                  }}
                >
                  <div style={{ fontSize: 48, marginBottom: 10 }}>{item.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#3B82F6', marginBottom: 8 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 16, color: '#CBD5E1' }}>{item.desc}</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 场景 5: 系统视角 - Git、Jenkins、服务器角色关系 (19-25秒) */}
      <Sequence from={19 * fps} durationInFrames={6 * fps}>
        <AbsoluteFill>
          {/* 炫酷背景：旋转光环 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 10% 90%, rgba(56,189,248,0.35), transparent 55%), ' +
                'radial-gradient(circle at 90% 10%, rgba(244,114,182,0.3), transparent 55%), ' +
                'linear-gradient(to bottom, #020617, #020617)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '15%',
              borderRadius: '999px',
              border: '1px solid rgba(148,163,184,0.4)',
              boxShadow: '0 0 40px rgba(59,130,246,0.6)',
              transform: `rotate(${interpolate(
                frame - 19 * fps,
                [0, 6 * fps],
                [0, 8],
                { extrapolateRight: 'clamp' }
              )}deg)`,
              opacity: 0.6,
            }}
          />

          {/* 标题 */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: 32,
              fontWeight: 'bold',
              color: '#F1F5F9',
              textShadow: '0 0 16px rgba(56,189,248,0.9)',
              opacity: interpolate(
                frame - 19 * fps,
                [0, 0.3 * fps, 5.7 * fps, 6 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            系统视角：Git、Jenkins 与服务器
          </div>
          <div
            style={{
              position: 'absolute',
              top: 80,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: 18,
              color: '#CBD5E1',
              opacity: interpolate(
                frame - 19.4 * fps,
                [0, 0.3 * fps, 5.3 * fps, 5.7 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            一条流水线背后，其实是多个系统协同工作的结果
          </div>

          {/* 以系统为单位的 FlowDiagram */}
          <FlowDiagram
            stages={[
              {
                name: '开发者本地仓库',
                icon: '💻',
                description: '在本地通过 Git 管理代码并进行 commit',
                startFrame: 19.6 * fps,
                durationInFrames: 0.8 * fps,
              },
              {
                name: '远程 Git 仓库',
                icon: '🌐',
                description: 'GitHub / Gitea 存储代码，触发 Webhook',
                startFrame: 20.4 * fps,
                durationInFrames: 0.8 * fps,
              },
              {
                name: 'Jenkins 控制端',
                icon: '🤖',
                description: '接收触发，调度 Pipeline 和构建任务',
                startFrame: 21.2 * fps,
                durationInFrames: 0.8 * fps,
              },
              {
                name: 'Jenkins Agent 构建机',
                icon: '⚙️',
                description: '在 Docker / 物理机上执行构建与测试',
                startFrame: 22 * fps,
                durationInFrames: 0.8 * fps,
              },
              {
                name: '生产服务器',
                icon: '🖥',
                description: '拉取构建产物，重启服务或刷新容器',
                startFrame: 22.8 * fps,
                durationInFrames: 0.8 * fps,
              },
              {
                name: '终端用户访问',
                icon: '👥',
                description: '用户通过浏览器访问最新版本应用',
                startFrame: 23.6 * fps,
                durationInFrames: 0.8 * fps,
              },
            ]}
            startFrame={19 * fps}
            durationInFrames={6 * fps}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 场景 6: 总结和行动号召 (25-29秒) */}
      <Sequence from={25 * fps} durationInFrames={4 * fps}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: 80,
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 'bold',
              color: '#F1F5F9',
              marginBottom: 40,
              opacity: interpolate(
                frame - 25 * fps,
                [0, 0.5 * fps, 3.5 * fps, 4 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            Pipeline 核心价值
          </div>

          {[
            'Pipeline = 代码即配置',
            '自动化整个 CI/CD 流程',
            '可视化构建过程',
          ].map((text, index) => {
            const textStartFrame = 25.5 * fps + index * 0.8 * fps;
            const textOpacity = interpolate(
              frame - textStartFrame,
              [0, 0.3 * fps, 2.5 * fps - index * 0.8 * fps, 3 * fps - index * 0.8 * fps],
              [0, 1, 1, 0],
              { extrapolateRight: 'clamp' }
            );

            return (
              <div
                key={text}
                style={{
                  fontSize: 24,
                  color: '#3B82F6',
                  marginBottom: 20,
                  opacity: textOpacity,
                  transform: `translateX(${interpolate(
                    frame - textStartFrame,
                    [0, 0.3 * fps],
                    [-30, 0],
                    { extrapolateRight: 'clamp' }
                  )}px)`,
                }}
              >
                ✓ {text}
              </div>
            );
          })}

          <div
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#10B981',
              marginTop: 40,
              opacity: interpolate(
                frame - 27.5 * fps,
                [0, 0.5 * fps, 1.5 * fps, 2 * fps],
                [0, 1, 1, 0],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            开始使用 Jenkins Pipeline 🚀
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
