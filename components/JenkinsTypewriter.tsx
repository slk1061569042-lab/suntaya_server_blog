'use client';

import { useEffect, useState } from 'react';

interface JenkinsTypewriterProps {
  className?: string;
  autoReplay?: boolean;
  replayDelay?: number;
}

const JENKINS_CONFIG = `pipeline {
    agent {
        docker {
            image 'node:20-alpine'
            args '-u root:root'
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
}`;

const JenkinsTypewriter = ({ 
  className = '',
  autoReplay = true,
  replayDelay = 3000
}: JenkinsTypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isReplaying, setIsReplaying] = useState(false);

  useEffect(() => {
    if (currentIndex < JENKINS_CONFIG.length) {
      const timer = setTimeout(() => {
        setDisplayedText(JENKINS_CONFIG.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30); // 打字速度：每30ms一个字符

      return () => clearTimeout(timer);
    } else if (autoReplay && !isReplaying) {
      // 完成打字后，等待一段时间后重新开始
      const replayTimer = setTimeout(() => {
        setIsReplaying(true);
        setDisplayedText('');
        setCurrentIndex(0);
        setIsReplaying(false);
      }, replayDelay);

      return () => clearTimeout(replayTimer);
    }
  }, [currentIndex, autoReplay, isReplaying, replayDelay]);

  // 光标闪烁效果
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorTimer);
  }, []);

  // 格式化代码显示（简单的语法高亮）
  const formatCode = (text: string) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    const lastLineIndex = lines.length - 1;
    
    return lines.map((line, lineIndex) => {
      // 简单的语法高亮
      let formattedLine = line;
      
      // 关键字高亮（蓝色）
      formattedLine = formattedLine.replace(
        /\b(pipeline|agent|docker|image|args|triggers|githubPush|stages|stage|steps|sh|npm)\b/g,
        '<span style="color: #3B82F6; font-weight: 600;">$1</span>'
      );
      
      // 字符串高亮（绿色）
      formattedLine = formattedLine.replace(
        /('node:20-alpine'|'root:root'|'npm ci'|'npm run build')/g,
        '<span style="color: #10B981;">$1</span>'
      );
      
      // 括号高亮（橙色）
      formattedLine = formattedLine.replace(
        /([{}])/g,
        '<span style="color: #F97316;">$1</span>'
      );

      return (
        <div key={lineIndex} className="font-mono text-sm leading-relaxed whitespace-pre">
          <span dangerouslySetInnerHTML={{ __html: formattedLine || ' ' }} />
          {lineIndex === lastLineIndex && showCursor && (
            <span className="inline-block w-2 h-5 bg-[#3B82F6] ml-1 animate-pulse" />
          )}
        </div>
      );
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Mac 风格窗口 */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/20">
        {/* Mac 窗口标题栏 */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#1E293B]/80 to-[#0F172A]/80 border-b border-white/10">
          {/* Mac 窗口控制按钮 */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28CA42]"></div>
          </div>
          {/* 窗口标题 */}
          <div className="flex-1 text-center">
            <span className="text-xs text-[#CBD5E1] font-medium">Jenkinsfile</span>
            <span className="ml-2 text-[#94A3B8] text-[10px]">●</span>
          </div>
        </div>

        {/* 代码区域 */}
        <div className="p-6 bg-gradient-to-br from-[#0F172A]/95 to-[#1E293B]/95 min-h-[300px] max-h-[400px] overflow-y-auto custom-scrollbar">
          <div className="space-y-1 text-[#E2E8F0] font-mono">
            {formatCode(displayedText) || (
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-5 bg-[#3B82F6] animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Mac 风格底部状态栏 */}
        <div className="px-4 py-2 bg-[#0F172A]/90 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></span>
              Groovy
            </span>
            <span className="text-[#3B82F6] font-medium">
              {displayedText.length > 0 ? Math.round((displayedText.length / JENKINS_CONFIG.length) * 100) : 0}%
            </span>
          </div>
          <div className="text-xs text-[#94A3B8] font-mono">
            {displayedText.length} / {JENKINS_CONFIG.length}
          </div>
        </div>
      </div>

      {/* 装饰性光效 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#3B82F6]/20 via-[#8B5CF6]/20 to-[#F97316]/20 rounded-2xl blur-xl opacity-50 -z-10"></div>
    </div>
  );
};

export default JenkinsTypewriter;
