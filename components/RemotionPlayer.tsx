'use client';

import { Player, PlayerRef } from '@remotion/player';
import { useMemo, useRef, useEffect, useState } from 'react';
import { compositionComponents, compositionDefaultProps } from '@/src/remotion/Root';

const PERSIST_THROTTLE_FRAMES = 30; // 约 1 秒更新一次内存中的进度

// 仅在当前浏览器会话内记住进度：刷新会丢失，路由返回仍可恢复
const inMemoryFrameStore: Record<string, number> = {};

function getStoredFrame(persistKey: string | undefined): number | null {
  if (!persistKey) return null;
  return Object.prototype.hasOwnProperty.call(inMemoryFrameStore, persistKey)
    ? inMemoryFrameStore[persistKey]
    : null;
}

function setStoredFrame(persistKey: string | undefined, frame: number) {
  if (!persistKey) return;
  inMemoryFrameStore[persistKey] = frame;
}

type RemotionPlayerProps = {
  compositionId: string;
  className?: string;
  width?: number;
  height?: number;
  durationInFrames?: number;
  fps?: number;
  autoPlay?: boolean;
  /** 指定后，通过路由跳转离开再返回会从上次的帧继续播放（只在当前会话内记住，刷新会重新播放） */
  persistKey?: string;
};

export default function RemotionPlayer({
  compositionId,
  className = '',
  width = 1280,
  height = 720,
  durationInFrames = 600,
  fps = 30,
  autoPlay = false,
  persistKey,
}: RemotionPlayerProps) {
  const playerRef = useRef<PlayerRef>(null);
  const lastSavedFrameRef = useRef<number>(-1);

  // 计算最后15秒的帧范围：基于实际视频时长
  const lastFifteenSecondsStartFrame = Math.max(0, durationInFrames - (15 * fps)); // 最后15秒开始帧
  const lastFifteenSecondsEndFrame = durationInFrames - 1; // 视频最后一帧

  // 从内存中恢复的起始帧（仅本次会话内有效）
  const [restoredFrame] = useState<number | null>(() => getStoredFrame(persistKey));
  const [enableLoopRange, setEnableLoopRange] = useState(() =>
    restoredFrame != null && restoredFrame >= lastFifteenSecondsStartFrame
  );

  // 用于首帧与循环段的 initialFrame
  const initialFrame =
    restoredFrame != null
      ? Math.min(Math.max(0, restoredFrame), durationInFrames - 1)
      : enableLoopRange
        ? lastFifteenSecondsStartFrame
        : 0;

  // 使用 useEffect 持续监控播放状态（作为 onTimeUpdate 的补充）
  useEffect(() => {
    if (!playerRef.current) return;

    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentFrame = playerRef.current.getCurrentFrame();
        if (currentFrame >= lastFifteenSecondsStartFrame && !enableLoopRange) {
          playerRef.current.seekTo(lastFifteenSecondsStartFrame);
          setTimeout(() => setEnableLoopRange(true), 50);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [enableLoopRange, lastFifteenSecondsStartFrame, lastFifteenSecondsEndFrame, durationInFrames]);
  
  // 动态计算响应式尺寸
  const playerDimensions = useMemo(() => {
    if (typeof window === 'undefined') {
      return { width, height };
    }

    // 移动端适配
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const aspectRatio = width / height;
      const maxWidth = window.innerWidth - 32; // 减去 padding
      return {
        width: maxWidth,
        height: maxWidth / aspectRatio,
      };
    }

    // 桌面端：最大宽度 1280px
    const maxWidth = Math.min(1280, window.innerWidth - 64);
    const aspectRatio = width / height;
    return {
      width: maxWidth,
      height: maxWidth / aspectRatio,
    };
  }, [width, height]);

  // 获取对应的组件
  const Component = compositionComponents[compositionId];
  const defaultProps = compositionDefaultProps[compositionId] || {};

  if (!Component) {
    return (
      <div className={`relative ${className}`}>
        <div className="glass-card rounded-2xl p-8 text-center text-[#CBD5E1]">
          视频组件未找到: {compositionId}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Mac 风格容器 */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/20">
        {/* Mac 窗口标题栏 */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#1E293B]/80 to-[#0F172A]/80 border-b border-white/10">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28CA42]"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-[#CBD5E1] font-medium">视频演示</span>
          </div>
        </div>

        {/* 视频播放器 */}
        <div className="bg-gradient-to-br from-[#0F172A]/95 to-[#1E293B]/95 p-4">
          <Player
            key={enableLoopRange ? 'looping' : 'normal'} // 当启用循环范围时，重新渲染以应用 inFrame/outFrame
            ref={playerRef}
            component={Component}
            durationInFrames={durationInFrames}
            fps={fps}
            compositionWidth={width}
            compositionHeight={height}
            controls={false}
            autoPlay={enableLoopRange ? true : autoPlay} // 循环模式下自动播放
            loop={enableLoopRange} // 启用循环
            moveToBeginningWhenEnded={false} // 防止重置到0
            pauseWhenFinished={false} // 不自动暂停
            inFrame={enableLoopRange ? lastFifteenSecondsStartFrame : undefined} // 限制播放范围：从450帧开始
            outFrame={enableLoopRange ? lastFifteenSecondsEndFrame : undefined} // 限制播放范围：到899帧结束
            initialFrame={initialFrame}
            acknowledgeRemotionLicense={true}
            onTimeUpdate={(info) => {
              if (info.frame >= lastFifteenSecondsStartFrame && !enableLoopRange && playerRef.current) {
                playerRef.current.seekTo(lastFifteenSecondsStartFrame);
                setTimeout(() => setEnableLoopRange(true), 50);
              }
              if (persistKey) {
                const f = Math.round(info.frame);
                if (Math.abs(f - lastSavedFrameRef.current) >= PERSIST_THROTTLE_FRAMES) {
                  lastSavedFrameRef.current = f;
                  setStoredFrame(persistKey, f);
                }
              }
            }}
            onEnded={() => {
              console.log('[RemotionPlayer] 🏁 onEnded 触发 - 动画结束');
              console.log('[RemotionPlayer] 📊 当前状态 - enableLoopRange:', enableLoopRange, 
                'loop prop:', enableLoopRange,
                'inFrame:', enableLoopRange ? lastFifteenSecondsStartFrame : 'undefined',
                'outFrame:', enableLoopRange ? lastFifteenSecondsEndFrame : 'undefined');
              
              if (playerRef.current) {
                const currentFrame = playerRef.current.getCurrentFrame();
                console.log('[RemotionPlayer] 📊 当前帧:', currentFrame, '播放中:', playerRef.current.isPlaying());
                
                // 如果循环范围已启用，应该自动跳回 inFrame
                if (enableLoopRange) {
                  console.log('[RemotionPlayer] ⚠️ 循环范围已启用但 onEnded 触发，可能需要手动跳转');
                  if (currentFrame >= lastFifteenSecondsEndFrame) {
                    console.log('[RemotionPlayer] 🔄 手动跳转到', lastFifteenSecondsStartFrame);
                    playerRef.current.seekTo(lastFifteenSecondsStartFrame);
                    setTimeout(() => {
                      if (playerRef.current && !playerRef.current.isPlaying()) {
                        playerRef.current.play();
                        console.log('[RemotionPlayer] ▶️ 重新开始播放');
                      }
                    }, 10);
                  }
                }
              }
            }}
            style={{
              width: '100%',
              maxWidth: `${playerDimensions.width}px`,
              height: `${playerDimensions.height}px`,
            }}
            inputProps={defaultProps}
          />
        </div>
      </div>

      {/* 装饰性光效 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#3B82F6]/20 via-[#8B5CF6]/20 to-[#F97316]/20 rounded-2xl blur-xl opacity-50 -z-10"></div>
    </div>
  );
}
