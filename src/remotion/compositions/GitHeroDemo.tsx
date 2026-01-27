import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

type GitHeroDemoProps = {
  title?: string;
  description?: string;
  button1Text?: string;
  button2Text?: string;
  button1Link?: string;
  button2Link?: string;
};

export const GitHeroDemo: React.FC<GitHeroDemoProps> = ({
  title = 'Git 完整学习指南',
  description = '通过交互式可视化学习 Git 命令，掌握工作区、暂存区、本地仓库和远程仓库之间的数据流转',
  button1Text = '开始可视化练习',
  button2Text = '查看所有文档',
  button1Link = '/git-visualizer',
  button2Link = '/docs',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalDuration = 30 * fps; // 30秒总时长，900帧（0-899）
  
  // 最后15秒的帧范围（用于循环）
  const lastFifteenSecondsStartFrame = 15 * fps; // 450帧（15秒开始）
  const lastFifteenSecondsEndFrame = 30 * fps; // 900帧（30秒结束，实际最后一帧是899）
  
  // 当前帧：如果超过最后15秒，clamp 到最后15秒的结束
  const currentFrame = Math.min(frame, lastFifteenSecondsEndFrame - 1);
  
  // 循环帧：用于按钮闪烁等需要循环动画的元素
  // 如果 frame 在最后15秒范围内，直接使用 frame（因为 RemotionPlayer 会循环）
  // 如果 frame 超过最后15秒，使用最后15秒的结束帧
  const loopedFrame = frame >= lastFifteenSecondsStartFrame 
    ? (frame < lastFifteenSecondsEndFrame ? frame : lastFifteenSecondsEndFrame - 1)
    : frame;
  
  // 用于最后15秒循环的帧数（0到449，确保循环无缝）
  const loopCycleFrame = frame >= lastFifteenSecondsStartFrame
    ? ((frame - lastFifteenSecondsStartFrame) % (lastFifteenSecondsEndFrame - lastFifteenSecondsStartFrame))
    : 0;
  // 游动粒子用的“时间进度”：前15秒用 frame，后15秒用 loopCycleFrame，保证最后15秒可无缝循环
  const floatingCycleFrame = frame >= lastFifteenSecondsStartFrame
    ? loopCycleFrame
    : frame;
  const floatingCycleDuration = frame >= lastFifteenSecondsStartFrame
    ? lastFifteenSecondsEndFrame - lastFifteenSecondsStartFrame
    : lastFifteenSecondsStartFrame;
  
  // 动画时间轴
  const titleStartFrame = 1 * fps; // 1秒开始
  const titleGatherDuration = 2 * fps; // 标题粒子聚集时长2秒
  const titleEndFrame = titleStartFrame + titleGatherDuration; // 标题完成时间
  const titleVisibleFrame = titleStartFrame + titleGatherDuration * 0.85; // 85%时文字显示
  
  const descStartFrame = titleEndFrame + 0.5 * fps; // 标题完成后0.5秒开始描述
  const descGatherDuration = 1.5 * fps; // 描述粒子聚集时长1.5秒
  const descEndFrame = descStartFrame + descGatherDuration; // 描述完成时间
  const descVisibleFrame = descStartFrame + descGatherDuration * 0.85; // 85%时文字显示
  
  const btn1StartFrame = descEndFrame + 0.5 * fps; // 描述完成后0.5秒开始按钮1
  const btn1GatherDuration = 1 * fps; // 按钮1粒子聚集时长1秒
  const btn1EndFrame = btn1StartFrame + btn1GatherDuration; // 按钮1完成时间
  const btn1VisibleFrame = btn1StartFrame + btn1GatherDuration * 0.85; // 85%时文字显示
  
  const btn2StartFrame = btn1EndFrame + 0.3 * fps; // 按钮1完成后0.3秒开始按钮2
  const btn2GatherDuration = 1 * fps; // 按钮2粒子聚集时长1秒
  const btn2VisibleFrame = btn2StartFrame + btn2GatherDuration * 0.85; // 85%时文字显示

  // 计算文字位置（屏幕中心）
  // 注意：由于使用 flexbox 居中布局，实际位置需要考虑元素的实际高度和间距
  const screenCenterX = 50; // 50%
  const screenCenterY = 40; // 40%
  const titleY = screenCenterY - 8; // 标题位置
  
  // 描述位置：标题底部(约32px) + marginBottom(24px) + 描述文字中心(约12px)
  // 转换为百分比：(32 + 24 + 12) / 600 * 100 ≈ 11.3%
  // 从 screenCenterY - 8 开始，标题底部约在 screenCenterY - 8 + 5.3% = screenCenterY - 2.7%
  // 描述中心约在 screenCenterY - 2.7% + 11.3% = screenCenterY + 8.6%
  const descY = screenCenterY + 9; // 描述位置（调整，考虑多行文字的实际中心）
  
  // 按钮位置：描述底部(约12px) + marginBottom(40px) + 按钮中心
  // 描述文字可能是多行，实际高度可能更大
  // 按钮高度：padding(16px*2) + 字体高度(18px) ≈ 50px，中心约25px
  // 转换为百分比：(12 + 40 + 25) / 600 * 100 ≈ 12.8%
  // 从 screenCenterY + 9 开始，描述底部约在 screenCenterY + 11
  // 按钮中心约在 screenCenterY + 11 + 12.8% = screenCenterY + 23.8%
  // 考虑到描述可能是多行，实际位置更靠下，再增加
  const btnY = screenCenterY + 28; // 按钮位置（进一步调整，更靠下）

  // 生成字符周围的不规则团状分布点（为单个粒子生成目标位置）
  const getCharParticleTarget = (
    charIndex: number,
    textLength: number,
    fontSize: number,
    centerX: number,
    centerY: number,
    particleIndexInChar: number // 粒子在字符中的索引（0 到 particlesPerChar-1）
  ): { x: number; y: number } => {
    // 估算字符宽度和高度（中文字符）
    const charWidth = fontSize * 0.65;
    const charHeight = fontSize;
    const charX = centerX + ((charIndex - textLength / 2 + 0.5) * charWidth) / (1280 / 100);
    const charY = centerY;
    
    // 使用粒子索引和字符索引生成伪随机数，确保每次渲染位置一致
    const seed = (charIndex * 1000 + particleIndexInChar) * 137.508; // 黄金角度
    
    // 随机角度
    const angle = (seed % 360) * (Math.PI / 180);
    
    // 随机距离，使用径向分布（距离中心越远，密度越低）
    // 使用平方根分布让粒子更集中在中心附近
    const randomValue = ((seed * 7) % 10000) / 10000; // 使用不同的随机值
    const radiusFactor = Math.sqrt(randomValue); // 平方根分布，让粒子更集中在中心
    
    // 最大半径：字符宽度和高度，加上一些随机扩展
    const baseRadiusX = charWidth / 2 / (1280 / 100);
    const baseRadiusY = charHeight / 2 / (600 / 100);
    const randomExtension = ((seed * 11) % 10000) / 10000; // 另一个随机值用于扩展
    const maxRadiusX = baseRadiusX * (1 + 0.4 * randomExtension);
    const maxRadiusY = baseRadiusY * (1 + 0.4 * randomExtension);
    
    // 计算实际半径
    const radiusX = maxRadiusX * radiusFactor;
    const radiusY = maxRadiusY * radiusFactor;
    
    // 生成点位置
    return {
      x: charX + Math.cos(angle) * radiusX,
      y: charY + Math.sin(angle) * radiusY,
    };
  };

  // 生成粒子 - 为每个字符生成轮廓粒子
  const particlesPerChar = 20; // 每个字符20个粒子（分布在轮廓上）
  const titleParticles = title.length * particlesPerChar;
  const descParticles = description.length * particlesPerChar;
  const btn1Particles = button1Text.length * particlesPerChar;
  const btn2Particles = button2Text.length * particlesPerChar;
  const totalParticles = titleParticles + descParticles + btn1Particles + btn2Particles;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0E1A',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* 背景层：多层径向渐变 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 20% 30%, rgba(59,130,246,0.4), transparent 50%), ' +
            'radial-gradient(circle at 80% 70%, rgba(248,113,113,0.3), transparent 50%), ' +
            'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.2), transparent 60%), ' +
            'linear-gradient(to bottom right, #0A0E1A, #020617)',
        }}
      />

      {/* 火焰光晕层 - 底部橙红色渐变，带轻微呼吸 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 105%, rgba(249,115,22,0.35), transparent 55%), ' +
            'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(234,88,12,0.25), transparent 45%), ' +
            'radial-gradient(ellipse 100% 50% at 50% 110%, rgba(251,191,36,0.12), transparent 50%)',
          opacity: 0.85 + Math.sin(frame / 24) * 0.12,
          pointerEvents: 'none',
        }}
      />

      {/* 火星/余烬粒子 - 从底部缓慢上升，带闪烁与左右飘动 */}
      {Array.from({ length: 48 }).map((_, i) => {
        const seed = i * 6073;
        const cycleFrames = 9 * fps; // 约 9 秒完成一次上升
        const phase = (seed % 1000) / 1000 * cycleFrames;
        const t = (frame + phase) % cycleFrames;
        const progress = t / cycleFrames; // 0→1 从底到顶

        const baseX = 15 + ((seed * 31) % 70); // 15%～85% 横向分布
        const drift = Math.sin((frame + seed * 0.7) / 15 + i * 0.5) * 2; // 左右飘动
        const x = baseX + drift;

        const y = 100 - progress * 115; // 从底部升到略超出顶部，便于淡出

        const size = 1.2 + ((seed * 47) % 5) * 0.35; // 约 1.2～2.95px
        const colorIdx = (seed + Math.floor(frame / 20)) % 3;
        const colors = ['#F97316', '#FBBF24', '#EA580C'];
        const color = colors[colorIdx];

        const opacityUp = 1 - progress; // 越高越淡
        const flicker = 0.6 + 0.4 * Math.sin(frame * 0.5 + seed * 0.1); // 闪烁
        const opacity = Math.max(0, opacityUp * flicker * 0.7);

        return (
          <div
            key={`flame-${i}`}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: '50%',
              opacity,
              boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px rgba(251,191,36,0.4)`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* 网格线动画 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.6) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.3,
          transform: `translate(${interpolate(
            loopedFrame,
            [0, totalDuration],
            [0, 50],
            { extrapolateRight: 'clamp' }
          )}px, ${interpolate(
            loopedFrame,
            [0, totalDuration],
            [0, 50],
            { extrapolateRight: 'clamp' }
          )}px)`,
        }}
      />

      {/* 光晕效果 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${50 + Math.sin(loopedFrame / 30) * 10}% ${50 + Math.cos(loopedFrame / 30) * 10}%, rgba(59,130,246,0.15), transparent 70%)`,
        }}
      />

      {/* 游动粒子效果 - 从开头就显示（前2秒淡入），最后15秒全显并形成循环 */}
      {Array.from({ length: 80 }).map((_, i) => {
        // 使用粒子索引生成唯一的种子，确保位置可重复
        const particleSeed = i * 7919; // 使用大质数确保分布均匀

        // 基础位置（基于种子，确保每次渲染位置一致）
        const baseAngle = (particleSeed % 360) * (Math.PI / 180);
        const baseRadius = 30 + ((particleSeed * 7) % 40); // 30-70% 的半径范围
        const baseX = 50 + Math.cos(baseAngle) * baseRadius;
        const baseY = 50 + Math.sin(baseAngle) * baseRadius;

        // 游动动画参数：前15秒用 frame，后15秒用 loopCycleFrame，保证最后15秒可无缝循环
        const cycleProgress = floatingCycleDuration > 0
          ? floatingCycleFrame / floatingCycleDuration
          : 0;
        const cycleTime = cycleProgress * Math.PI * 2; // 0到2π，形成完整循环

        // 每个粒子有不同的游动速度和方向
        const speed = 0.3 + ((particleSeed * 13) % 20) / 100; // 0.3-0.5 的速度范围
        const direction = (particleSeed * 17) % 360; // 0-360度的方向
        const amplitude = 2 + ((particleSeed * 19) % 8); // 2-10% 的游动幅度

        // 计算游动偏移（使用正弦波形成平滑的循环运动）
        const offsetX = Math.cos(cycleTime * speed + direction * Math.PI / 180) * amplitude;
        const offsetY = Math.sin(cycleTime * speed * 1.3 + direction * Math.PI / 180) * amplitude;

        // 最终位置
        const finalX = baseX + offsetX;
        const finalY = baseY + offsetY;

        // 粒子大小和颜色（基于种子）
        const particleSize = 1.5 + ((particleSeed * 23) % 3) * 0.5; // 1.5-3px
        const colorIndex = (particleSeed * 29) % 3;
        const colors = ['#3B82F6', '#8B5CF6', '#F97316'];
        const particleColor = colors[colorIndex];

        // 透明度：基于位置（边缘更透明），且前约2秒淡入
        const distanceFromCenter = Math.sqrt(
          Math.pow(finalX - 50, 2) + Math.pow(finalY - 50, 2)
        );
        const maxDistance = 50; // 最大距离（屏幕中心到边缘）
        const baseOpacity = Math.max(0.2, 0.6 * (1 - distanceFromCenter / maxDistance));
        const fadeInFrames = 2 * fps; // 前2秒淡入
        const fadeInOpacity = frame < fadeInFrames
          ? interpolate(frame, [0, fadeInFrames], [0.15, 1], { extrapolateRight: 'clamp' })
          : 1;
        const opacity = baseOpacity * fadeInOpacity;

        return (
          <div
            key={`floating-${i}`}
            style={{
              position: 'absolute',
              left: `${finalX.toFixed(4)}%`,
              top: `${finalY.toFixed(4)}%`,
              width: `${particleSize}px`,
              height: `${particleSize}px`,
              backgroundColor: particleColor,
              borderRadius: '50%',
              opacity: opacity,
              boxShadow: `0 0 ${particleSize * 2}px ${particleColor}`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* 粒子效果 - 聚集到文字轮廓 */}
      {Array.from({ length: totalParticles }).map((_, i) => {
        let charIndex = 0;
        let textLength = 0;
        let fontSize = 64;
        let charStartFrame = 0;
        let charEndFrame = 0;
        let charVisibleFrame = 0; // 字符显示的时间点
        let particleColor = '#3B82F6';
        let particleIndexInChar = 0; // 粒子在字符中的索引
        let targetX = screenCenterX;
        let targetY = screenCenterY;

        // 确定粒子属于哪个文字元素和哪个字符
        if (i < titleParticles) {
          // 标题粒子
          charIndex = Math.floor(i / particlesPerChar);
          particleIndexInChar = i % particlesPerChar;
          textLength = title.length;
          fontSize = 64;
          particleColor = '#3B82F6';
          
          // 生成不规则团状目标位置
          const targetPoint = getCharParticleTarget(
            charIndex,
            textLength,
            fontSize,
            screenCenterX,
            titleY,
            particleIndexInChar
          );
          targetX = targetPoint.x;
          targetY = targetPoint.y;
          
          // 所有字符的粒子同时聚集
          charStartFrame = titleStartFrame;
          charEndFrame = titleStartFrame + titleGatherDuration * 0.85; // 85%时间聚集
          charVisibleFrame = titleVisibleFrame; // 文字显示时间点
        } else if (i < titleParticles + descParticles) {
          // 描述粒子
          const descIndex = i - titleParticles;
          charIndex = Math.floor(descIndex / particlesPerChar);
          particleIndexInChar = descIndex % particlesPerChar;
          textLength = description.length;
          fontSize = 24;
          particleColor = '#8B5CF6';
          
          // 生成不规则团状目标位置
          const targetPoint = getCharParticleTarget(
            charIndex,
            textLength,
            fontSize,
            screenCenterX,
            descY,
            particleIndexInChar
          );
          targetX = targetPoint.x;
          targetY = targetPoint.y;
          
          // 所有字符的粒子同时聚集
          charStartFrame = descStartFrame;
          charEndFrame = descStartFrame + descGatherDuration * 0.85;
          charVisibleFrame = descVisibleFrame;
        } else if (i < titleParticles + descParticles + btn1Particles) {
          // 按钮1粒子
          const btn1Index = i - titleParticles - descParticles;
          charIndex = Math.floor(btn1Index / particlesPerChar);
          particleIndexInChar = btn1Index % particlesPerChar;
          textLength = button1Text.length;
          fontSize = 18;
          particleColor = '#F97316';
          
          // 生成不规则团状目标位置
          const targetPoint = getCharParticleTarget(
            charIndex,
            textLength,
            fontSize,
            screenCenterX - 8,
            btnY,
            particleIndexInChar
          );
          targetX = targetPoint.x;
          targetY = targetPoint.y;
          
          // 所有字符的粒子同时聚集
          charStartFrame = btn1StartFrame;
          charEndFrame = btn1StartFrame + btn1GatherDuration * 0.85;
          charVisibleFrame = btn1VisibleFrame;
        } else {
          // 按钮2粒子
          const btn2Index = i - titleParticles - descParticles - btn1Particles;
          charIndex = Math.floor(btn2Index / particlesPerChar);
          particleIndexInChar = btn2Index % particlesPerChar;
          textLength = button2Text.length;
          fontSize = 18;
          particleColor = '#3B82F6';
          
          // 生成不规则团状目标位置
          const targetPoint = getCharParticleTarget(
            charIndex,
            textLength,
            fontSize,
            screenCenterX + 8,
            btnY,
            particleIndexInChar
          );
          targetX = targetPoint.x;
          targetY = targetPoint.y;
          
          // 所有字符的粒子同时聚集
          charStartFrame = btn2StartFrame;
          charEndFrame = btn2StartFrame + btn2GatherDuration * 0.85;
          charVisibleFrame = btn2VisibleFrame;
        }

        // 粒子的初始位置（随机分布在屏幕边缘）
        const seed = i * 137.508; // 使用黄金角度生成伪随机数
        const initialAngle = (seed % 360) * (Math.PI / 180);
        const initialDistance = 200 + (seed % 100);
        const initialX = screenCenterX + Math.cos(initialAngle) * (initialDistance / (1280 / 100));
        const initialY = screenCenterY + Math.sin(initialAngle) * (initialDistance / (600 / 100));

        // 粒子聚集和消失动画
        let particleX = initialX;
        let particleY = initialY;
        let opacity = 0;

        if (currentFrame < charStartFrame) {
          // 等待阶段 - 粒子在初始位置，不可见
          particleX = initialX;
          particleY = initialY;
          opacity = 0;
        } else if (currentFrame >= charStartFrame && currentFrame < charEndFrame) {
          // 聚集阶段 - 粒子聚集到轮廓点
          const progress = (currentFrame - charStartFrame) / (charEndFrame - charStartFrame);
          const easedProgress = Easing.out(Easing.cubic)(progress);
          particleX = initialX + (targetX - initialX) * easedProgress;
          particleY = initialY + (targetY - initialY) * easedProgress;
          opacity = interpolate(progress, [0, 0.2, 0.8], [0, 1, 1], { extrapolateRight: 'clamp' });
        } else if (currentFrame >= charEndFrame && currentFrame < charVisibleFrame) {
          // 聚集完成，等待字符显示（粒子停留在轮廓位置）
          particleX = targetX;
          particleY = targetY;
          opacity = 1;
        } else if (currentFrame >= charVisibleFrame) {
          // 字符显示，粒子淡出消失（文字固化），之后保持不可见
          if (currentFrame < charVisibleFrame + 0.15 * fps) {
            // 淡出阶段
            const fadeProgress = (currentFrame - charVisibleFrame) / (0.15 * fps); // 0.15秒淡出
            particleX = targetX;
            particleY = targetY;
            opacity = interpolate(fadeProgress, [0, 1], [1, 0], { extrapolateRight: 'clamp' });
          } else {
            // 淡出完成后，保持不可见
            opacity = 0;
            particleX = targetX;
            particleY = targetY;
          }
        } else {
          // 其他情况，粒子不可见
          opacity = 0;
        }

        const particleSize = 2 + (i % 3);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${particleX.toFixed(4)}%`,
              top: `${particleY.toFixed(4)}%`,
              width: `${particleSize}px`,
              height: `${particleSize}px`,
              backgroundColor: particleColor,
              borderRadius: '50%',
              opacity: opacity,
              boxShadow: `0 0 ${particleSize * 3}px ${particleColor}`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}

      {/* 主内容区域 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '80px 40px',
        }}
      >
        {/* 标题动画 - 从粒子汇聚中生长出来 */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: '#F1F5F9',
            marginBottom: 24,
            textAlign: 'center',
            opacity: interpolate(
              currentFrame,
              [titleVisibleFrame, titleVisibleFrame + 0.4 * fps],
              [0, 1],
              {
                easing: Easing.out(Easing.cubic),
                extrapolateRight: 'clamp',
              }
            ),
            transform: `scale(${interpolate(
              currentFrame,
              [titleVisibleFrame, titleVisibleFrame + 0.4 * fps],
              [0, 1],
              {
                easing: Easing.out(Easing.back(1.2)),
                extrapolateRight: 'clamp',
              }
            )})`,
            textShadow: `0 0 ${interpolate(
              currentFrame,
              [titleVisibleFrame, titleEndFrame, totalDuration],
              [20, 40, 40],
              { extrapolateRight: 'clamp' }
            )}px rgba(59,130,246,0.8)`,
          }}
        >
          {title}
        </div>

        {/* 描述文字动画 - 从粒子汇聚中生长出来 */}
        <div
          style={{
            fontSize: 24,
            color: '#CBD5E1',
            textAlign: 'center',
            maxWidth: 800,
            marginBottom: 40,
            lineHeight: 1.6,
            opacity: interpolate(
              currentFrame,
              [descVisibleFrame, descVisibleFrame + 0.4 * fps],
              [0, 1],
              {
                easing: Easing.out(Easing.cubic),
                extrapolateRight: 'clamp',
              }
            ),
            transform: `scale(${interpolate(
              currentFrame,
              [descVisibleFrame, descVisibleFrame + 0.4 * fps],
              [0, 1],
              {
                easing: Easing.out(Easing.back(1.2)),
                extrapolateRight: 'clamp',
              }
            )})`,
          }}
        >
          {description}
        </div>

        {/* 按钮容器 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {/* 按钮1：开始可视化练习 - 从粒子汇聚中生长出来 */}
          <div
            style={{
              opacity: interpolate(
                currentFrame,
                [btn1VisibleFrame, btn1VisibleFrame + 0.4 * fps],
                [0, 1],
                {
                  easing: Easing.out(Easing.cubic),
                  extrapolateRight: 'clamp',
                }
              ),
              transform: `scale(${interpolate(
                currentFrame,
                [btn1VisibleFrame, btn1VisibleFrame + 0.4 * fps],
                [0, 1],
                {
                  easing: Easing.out(Easing.back(1.2)),
                  extrapolateRight: 'clamp',
                }
              )})`,
            }}
          >
            <div
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = button1Link;
                }
              }}
              style={{
                padding: '16px 32px',
                backgroundColor: '#F97316',
                color: '#FFFFFF',
                borderRadius: 12,
                fontSize: 18,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: `0 0 ${20 + Math.sin(loopedFrame / 5) * 10}px rgba(249,115,22,0.6)`,
                border: 'none',
                transition: 'all 0.3s',
              }}
            >
              {button1Text} →
            </div>
          </div>

          {/* 按钮2：查看所有文档 - 从粒子汇聚中生长出来 */}
          <div
            style={{
              opacity: interpolate(
                currentFrame,
                [btn2VisibleFrame, btn2VisibleFrame + 0.4 * fps],
                [0, 1],
                {
                  easing: Easing.out(Easing.cubic),
                  extrapolateRight: 'clamp',
                }
              ),
              transform: `scale(${interpolate(
                currentFrame,
                [btn2VisibleFrame, btn2VisibleFrame + 0.4 * fps],
                [0, 1],
                {
                  easing: Easing.out(Easing.back(1.2)),
                  extrapolateRight: 'clamp',
                }
              )})`,
            }}
          >
            <div
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = button2Link;
                }
              }}
              style={{
                padding: '16px 32px',
                backgroundColor: 'transparent',
                color: '#3B82F6',
                borderRadius: 12,
                fontSize: 18,
                fontWeight: 600,
                cursor: 'pointer',
                border: '2px solid rgba(59,130,246,0.5)',
                boxShadow: `0 0 ${15 + Math.sin(loopedFrame / 5) * 8}px rgba(59,130,246,0.4)`,
                transition: 'all 0.3s',
              }}
            >
              {button2Text}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
