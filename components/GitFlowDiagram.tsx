'use client';
/* eslint-disable react-hooks/static-components */

import { useState, useEffect } from 'react';

type FileEditState = {
  fileName: string;
  editLabel: string | null; // null 表示未编辑，'A', 'B', 'C' 等表示已编辑
};

type GitState = {
  workingDir: string[];
  stagingArea: string[];
  localRepo: string[];
  remoteRepo: string[];
  stash: string[];
  fileCounter: number;
  fileEditStates: FileEditState[]; // 文件编辑状态
};

type Operation = 'idle' | 'add' | 'add-all' | 'add-file' | 'commit' | 'commit-m' | 'push' | 'pull' | 'reset' | 'reset-soft' | 'reset-hard' | 'stash' | 'stash-pop' | 'status' | 'fetch' | 'restore';

const INITIAL_STATE: GitState = {
  workingDir: ['file1.txt', 'file2.txt', 'file3.txt'],
  stagingArea: [],
  localRepo: ['file1.txt', 'file2.txt'],
  remoteRepo: ['file1.txt', 'file2.txt'],
  stash: [],
  fileCounter: 4,
  fileEditStates: [
    { fileName: 'file1.txt', editLabel: null },
    { fileName: 'file2.txt', editLabel: null },
    { fileName: 'file3.txt', editLabel: null },
  ],
};

type CommandArea = 'working' | 'staging' | 'local' | 'remote' | 'other';

const COMMANDS_BY_AREA: Record<CommandArea, Array<{
  command: string;
  description: string;
  operation: Operation;
  params?: string;
  isCommon?: boolean;
  expandable?: boolean;
}>> = {
  working: [
    { command: 'git add -A', description: '添加所有更改到暂存区', operation: 'add-all', isCommon: true },
    { command: 'git add .', description: '添加当前目录所有文件', operation: 'add-all', expandable: true },
    { command: 'git add <file>', description: '添加指定文件', operation: 'add', expandable: true },
    { command: 'git status', description: '查看工作区状态', operation: 'status' },
    { command: 'git restore <file>', description: '撤销工作区修改', operation: 'restore', expandable: true },
  ],
  staging: [
    { command: 'git commit -m "msg"', description: '提交暂存区并添加信息', operation: 'commit-m', isCommon: true },
    { command: 'git commit', description: '提交暂存区（打开编辑器）', operation: 'commit', expandable: true },
    { command: 'git reset', description: '取消暂存（保留工作区）', operation: 'reset', expandable: true },
  ],
  local: [
    { command: 'git push', description: '推送到远程仓库', operation: 'push', isCommon: true },
    { command: 'git pull', description: '拉取并合并远程更新', operation: 'pull', isCommon: true },
    { command: 'git reset --soft HEAD~1', description: '撤销提交（保留暂存区）', operation: 'reset-soft', expandable: true },
    { command: 'git reset --hard HEAD~1', description: '完全撤销提交（危险）', operation: 'reset-hard', expandable: true },
    { command: 'git log', description: '查看提交历史', operation: 'status', expandable: true },
  ],
  remote: [
    // 远程仓库是服务端，命令如合并分支、切换分支等不适合基础演示
    // 这里留空，因为 push/pull 是从本地仓库操作的
  ],
  other: [
    { command: 'git stash', description: '暂存当前更改', operation: 'stash', expandable: true },
    { command: 'git stash pop', description: '恢复暂存的更改', operation: 'stash-pop', expandable: true },
  ],
};

export default function GitFlowDiagram() {
  const [state, setState] = useState<GitState>(INITIAL_STATE);
  const [currentOperation, setCurrentOperation] = useState<Operation>('idle');
  const [animatingFiles, setAnimatingFiles] = useState<Set<string>>(new Set());
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [editLabelCounter, setEditLabelCounter] = useState(0); // 用于生成 A, B, C, D...

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const animateFile = (fileName: string, duration: number = 1000) => {
    if (prefersReducedMotion) return;
    
    setAnimatingFiles(prev => new Set(prev).add(fileName));
    setTimeout(() => {
      setAnimatingFiles(prev => {
        const next = new Set(prev);
        next.delete(fileName);
        return next;
      });
    }, duration);
  };

  const addFileToWorkingDir = () => {
    if (!newFileName.trim()) return;
    const fileName = newFileName.trim().endsWith('.txt') ? newFileName.trim() : `${newFileName.trim()}.txt`;
    if (state.workingDir.includes(fileName)) return;
    
    setState(prev => ({
      ...prev,
      workingDir: [...prev.workingDir, fileName],
      fileCounter: prev.fileCounter + 1,
      fileEditStates: [...prev.fileEditStates, { fileName, editLabel: null }],
    }));
    setNewFileName('');
  };

  // 切换文件编辑状态（工作区、远程仓库、新文件都可以编辑）
  const toggleFileEditState = (fileName: string, area: 'working' | 'remote' = 'working') => {
    setState(prev => {
      const existingState = prev.fileEditStates.find(f => f.fileName === fileName);
      
      // 工作区：所有文件都可以编辑（包括新文件和已跟踪文件）
      // 远程仓库：可以编辑文件，模拟远端用户修改
      if (area === 'working' || area === 'remote') {
        if (existingState && existingState.editLabel !== null) {
          // 移除编辑状态
          return {
            ...prev,
            fileEditStates: prev.fileEditStates.map(f =>
              f.fileName === fileName ? { ...f, editLabel: null } : f
            ),
          };
        } else {
          // 添加编辑状态，使用下一个标签
          const nextLabel = String.fromCharCode(65 + editLabelCounter); // A, B, C, D...
          setEditLabelCounter(prev => prev + 1);
          // 如果文件状态不存在，先创建
          const fileStateExists = prev.fileEditStates.some(f => f.fileName === fileName);
          return {
            ...prev,
            fileEditStates: fileStateExists
              ? prev.fileEditStates.map(f =>
                  f.fileName === fileName ? { ...f, editLabel: nextLabel } : f
                )
              : [...prev.fileEditStates, { fileName, editLabel: nextLabel }],
          };
        }
      }
      return prev;
    });
  };

  // 添加单个文件到暂存区
  const handleAddFile = (fileName: string) => {
    if (currentOperation !== 'idle') return;
    if (state.stagingArea.includes(fileName)) return;
    if (!canAddToStaging(fileName)) return;
    
    setCurrentOperation('add');
    animateFile(fileName);
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        stagingArea: [...prev.stagingArea, fileName].filter((f, i, arr) => arr.indexOf(f) === i),
        // 添加到暂存区后，清除编辑状态
        fileEditStates: prev.fileEditStates.map(f =>
          f.fileName === fileName ? { ...f, editLabel: null } : f
        ),
      }));
      setCurrentOperation('idle');
    }, prefersReducedMotion ? 0 : 800);
  };

  // 获取文件的编辑状态
  const getFileEditState = (fileName: string): string | null => {
    const fileState = state.fileEditStates.find(f => f.fileName === fileName);
    return fileState?.editLabel || null;
  };

  // 检查文件是否可以添加到暂存区
  const canAddToStaging = (fileName: string): boolean => {
    // 文件必须在工作区中
    if (!state.workingDir.includes(fileName)) return false;
    // 文件不能在暂存区中
    if (state.stagingArea.includes(fileName)) return false;
    // 新文件（不在本地仓库）总是可以添加
    if (!state.localRepo.includes(fileName)) return true;
    // 已跟踪的文件必须有编辑状态才能添加
    const editState = getFileEditState(fileName);
    return editState !== null;
  };

  const simulateRemoteCommit = () => {
    const newFile = `remote-file-${state.fileCounter}.txt`;
    setState(prev => ({
      ...prev,
      remoteRepo: [...prev.remoteRepo, newFile].filter((f, i, arr) => arr.indexOf(f) === i),
      fileCounter: prev.fileCounter + 1,
      // 为新文件添加编辑状态记录
      fileEditStates: prev.fileEditStates.some(f => f.fileName === newFile)
        ? prev.fileEditStates
        : [...prev.fileEditStates, { fileName: newFile, editLabel: null }],
    }));
  };

  const executeCommand = (operation: Operation) => {
    if (currentOperation !== 'idle') return;
    
    setCurrentOperation(operation);

    switch (operation) {
      case 'add':
        handleAdd();
        break;
      case 'add-all':
        handleAddAll();
        break;
      case 'commit':
      case 'commit-m':
        handleCommit();
        break;
      case 'push':
        handlePush();
        break;
      case 'pull':
        handlePull();
        break;
      case 'reset':
        handleReset();
        break;
      case 'reset-soft':
        handleResetSoft();
        break;
      case 'reset-hard':
        handleResetHard();
        break;
      case 'stash':
        handleStash();
        break;
      case 'stash-pop':
        handleStashPop();
        break;
      case 'status':
        handleStatus();
        break;
      case 'fetch':
        handleFetch();
        break;
      case 'restore':
        handleRestore();
        break;
      default:
        // 处理所有 Operation 类型
        break;
    }
  };

  const handleAdd = () => {
    // git add 可以添加：
    // 1. 新文件（不在本地仓库的文件）
    // 2. 已跟踪但被修改的文件（在本地仓库且有编辑状态的文件）
    const newFiles = state.workingDir.filter(
      f => !state.stagingArea.includes(f) && !state.localRepo.includes(f)
    );
    const modifiedFiles = state.workingDir.filter(
      f => !state.stagingArea.includes(f) && state.localRepo.includes(f) && canAddToStaging(f)
    );
    const filesToAdd = [...newFiles, ...modifiedFiles];
    
    if (filesToAdd.length === 0) {
      setCurrentOperation('idle');
      return;
    }

    const fileToAdd = filesToAdd[0];
    animateFile(fileToAdd);
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        stagingArea: [...prev.stagingArea, fileToAdd].filter((f, i, arr) => arr.indexOf(f) === i),
        // 添加到暂存区后，清除编辑状态
        fileEditStates: prev.fileEditStates.map(f =>
          f.fileName === fileToAdd ? { ...f, editLabel: null } : f
        ),
      }));
      setCurrentOperation('idle');
    }, prefersReducedMotion ? 0 : 800);
  };

  const handleAddAll = () => {
    // git add -A 可以添加所有可添加的文件：
    // 1. 新文件（不在本地仓库的文件）
    // 2. 已跟踪但被修改的文件（在本地仓库且有编辑状态的文件）
    const filesToAdd = state.workingDir.filter(f => canAddToStaging(f));
    
    if (filesToAdd.length === 0) {
      setCurrentOperation('idle');
      return;
    }

    filesToAdd.forEach((file, index) => {
      animateFile(file);
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          stagingArea: [...prev.stagingArea, file].filter((f, i, arr) => arr.indexOf(f) === i),
          // 添加到暂存区后，清除编辑状态
          fileEditStates: prev.fileEditStates.map(f =>
            f.fileName === file ? { ...f, editLabel: null } : f
          ),
        }));
        if (index === filesToAdd.length - 1) {
          setCurrentOperation('idle');
        }
      }, prefersReducedMotion ? 0 : (index + 1) * 400);
    });
  };

  const handleCommit = () => {
    if (state.stagingArea.length === 0) {
      setCurrentOperation('idle');
      return;
    }
    
    const filesToCommit = [...state.stagingArea];
    
    filesToCommit.forEach((file, index) => {
      animateFile(file);
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          localRepo: [...prev.localRepo, file].filter((f, i, arr) => arr.indexOf(f) === i),
          stagingArea: prev.stagingArea.filter(f => f !== file),
        }));
        if (index === filesToCommit.length - 1) {
          setCurrentOperation('idle');
        }
      }, prefersReducedMotion ? 0 : (index + 1) * 400);
    });
  };

  const handlePush = () => {
    const filesToPush = state.localRepo.filter(f => !state.remoteRepo.includes(f));
    if (filesToPush.length === 0) {
      setCurrentOperation('idle');
      return;
    }
    
    filesToPush.forEach((file, index) => {
      animateFile(file);
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          remoteRepo: [...prev.remoteRepo, file].filter((f, i, arr) => arr.indexOf(f) === i),
        }));
        if (index === filesToPush.length - 1) {
          setCurrentOperation('idle');
        }
      }, prefersReducedMotion ? 0 : (index + 1) * 400);
    });
  };

  const handlePull = () => {
    // 找出远程仓库中有但本地仓库中没有的文件
    const filesToPull = state.remoteRepo.filter(f => !state.localRepo.includes(f));
    
    if (filesToPull.length === 0) {
      setCurrentOperation('idle');
      return;
    }
    
    // 顺畅的 pull：直接将远程文件添加到本地仓库和工作区
    setCurrentOperation('pull');
    
    filesToPull.forEach((file, index) => {
      animateFile(file);
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          localRepo: [...prev.localRepo, file].filter((f, i, arr) => arr.indexOf(f) === i),
          workingDir: [...prev.workingDir, file].filter((f, i, arr) => arr.indexOf(f) === i),
        }));
        if (index === filesToPull.length - 1) {
          setCurrentOperation('idle');
        }
      }, prefersReducedMotion ? 0 : (index + 1) * 400);
    });
  };

  const handleReset = () => {
    // git reset: 取消暂存，文件从暂存区移回工作区
    // 文件保留在工作区（如果文件不在工作区，应该添加回去）
    if (state.stagingArea.length === 0) {
      setCurrentOperation('idle');
      return;
    }
    
    const filesToReset = [...state.stagingArea];
    filesToReset.forEach((file, index) => {
      animateFile(file);
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          stagingArea: prev.stagingArea.filter(f => f !== file),
          // 确保文件保留在工作区
          workingDir: prev.workingDir.includes(file) 
            ? prev.workingDir 
            : [...prev.workingDir, file].filter((f, i, arr) => arr.indexOf(f) === i),
        }));
        if (index === filesToReset.length - 1) {
          setCurrentOperation('idle');
        }
      }, prefersReducedMotion ? 0 : (index + 1) * 300);
    });
  };

  const handleResetSoft = () => {
    if (state.localRepo.length === 0) {
      setCurrentOperation('idle');
      return;
    }
    
    const lastFile = state.localRepo[state.localRepo.length - 1];
    animateFile(lastFile);
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        localRepo: prev.localRepo.slice(0, -1),
        stagingArea: [...prev.stagingArea, lastFile],
      }));
      setCurrentOperation('idle');
    }, prefersReducedMotion ? 0 : 800);
  };

  const handleResetHard = () => {
    if (state.localRepo.length === 0) {
      setCurrentOperation('idle');
      return;
    }
    
    const lastFile = state.localRepo[state.localRepo.length - 1];
    animateFile(lastFile);
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        localRepo: prev.localRepo.slice(0, -1),
        stagingArea: prev.stagingArea.filter(f => f !== lastFile),
        workingDir: prev.workingDir.filter(f => f !== lastFile),
        // 清除编辑状态
        fileEditStates: prev.fileEditStates.map(f =>
          f.fileName === lastFile ? { ...f, editLabel: null } : f
        ),
      }));
      setCurrentOperation('idle');
    }, prefersReducedMotion ? 0 : 800);
  };

  const handleStash = () => {
    const filesToStash = [...state.stagingArea, ...state.workingDir.filter(f => !state.localRepo.includes(f))];
    if (filesToStash.length === 0) {
      setCurrentOperation('idle');
      return;
    }
    
    filesToStash.forEach((file, index) => {
      animateFile(file);
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          stagingArea: prev.stagingArea.filter(f => f !== file),
          workingDir: prev.workingDir.filter(f => f !== file),
          stash: [...prev.stash, file].filter((f, i, arr) => arr.indexOf(f) === i),
        }));
        if (index === filesToStash.length - 1) {
          setCurrentOperation('idle');
        }
      }, prefersReducedMotion ? 0 : (index + 1) * 300);
    });
  };

  const handleStashPop = () => {
    if (state.stash.length === 0) {
      setCurrentOperation('idle');
      return;
    }
    
    const fileToPop = state.stash[0];
    animateFile(fileToPop);
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        stash: prev.stash.filter(f => f !== fileToPop),
        workingDir: [...prev.workingDir, fileToPop].filter((f, i, arr) => arr.indexOf(f) === i),
      }));
      setCurrentOperation('idle');
    }, prefersReducedMotion ? 0 : 800);
  };

  const handleStatus = () => {
    setTimeout(() => {
      setCurrentOperation('idle');
    }, prefersReducedMotion ? 0 : 500);
  };


  const handleFetch = () => {
    // git fetch: 仅从远程拉取更新，不合并到工作区
    // 这里简化处理：模拟远程有新文件（实际 fetch 不会创建新文件，只是更新远程引用）
    // 为了演示效果，我们在远程仓库添加一个本地没有的文件
    const filesInRemoteButNotLocal = state.remoteRepo.filter(f => !state.localRepo.includes(f));
    
    if (filesInRemoteButNotLocal.length === 0) {
      // 如果没有差异，创建一个新文件模拟远程更新
      const newFile = `remote-file-${state.fileCounter}.txt`;
      setState(prev => ({
        ...prev,
        remoteRepo: [...prev.remoteRepo, newFile].filter((f, i, arr) => arr.indexOf(f) === i),
        fileCounter: prev.fileCounter + 1,
      }));
      setTimeout(() => {
        setCurrentOperation('idle');
      }, prefersReducedMotion ? 0 : 800);
    } else {
      // 已经有差异，fetch 只是更新远程引用（这里简化处理，不改变状态）
      setTimeout(() => {
        setCurrentOperation('idle');
      }, prefersReducedMotion ? 0 : 500);
    }
  };

  const handleRestore = () => {
    // git restore: 撤销工作区的修改，恢复到本地仓库的版本
    // 只能恢复已跟踪的文件（在本地仓库中存在的文件）
    // 对于新文件（不在本地仓库），restore 会删除它们
    // 对于已修改的文件（在本地仓库中），restore 会恢复到本地仓库版本（移除工作区修改和编辑状态）
    const newFiles = state.workingDir.filter(f => !state.localRepo.includes(f));
    const modifiedFiles = state.workingDir.filter(f => state.localRepo.includes(f) && getFileEditState(f) !== null);
    
    // restore 可以恢复新文件和已修改的文件
    const filesToRestore = [...newFiles, ...modifiedFiles];
    
    if (filesToRestore.length === 0) {
      setCurrentOperation('idle');
      return;
    }
    
    const fileToRestore = filesToRestore[0];
    animateFile(fileToRestore);
    setTimeout(() => {
      setState(prev => {
        // 如果是新文件，从工作区删除
        // 如果是已修改的文件，从工作区删除并清除编辑状态（恢复到本地仓库版本）
        const isNewFile = !prev.localRepo.includes(fileToRestore);
        // 如果是新文件，完全移除；如果是已修改的文件，清除编辑状态
        if (isNewFile) {
          return {
            ...prev,
            workingDir: prev.workingDir.filter(f => f !== fileToRestore),
            fileEditStates: prev.fileEditStates.filter(f => f.fileName !== fileToRestore),
          };
        } else {
          return {
            ...prev,
            workingDir: prev.workingDir.filter(f => f !== fileToRestore),
            fileEditStates: prev.fileEditStates.map(f =>
              f.fileName === fileToRestore ? { ...f, editLabel: null } : f
            ),
          };
        }
      });
      setCurrentOperation('idle');
    }, prefersReducedMotion ? 0 : 800);
  };


  const handleResetState = () => {
    setState(INITIAL_STATE);
    setCurrentOperation('idle');
    setAnimatingFiles(new Set());
    setEditLabelCounter(0);
  };

  const FileItem = ({ 
    fileName, 
    isAnimating,
    editLabel,
    canAdd,
    onToggleEdit,
    onAddFile,
    area
  }: { 
    fileName: string; 
    isAnimating: boolean;
    editLabel: string | null;
    canAdd: boolean;
    onToggleEdit: (fileName: string, area: 'working' | 'remote') => void;
    onAddFile: (fileName: string) => void;
    area: 'working' | 'staging' | 'local' | 'remote' | 'stash';
  }) => {
    const isClickable = (area === 'working' || area === 'remote') && !isAnimating;
    const canAddFile = area === 'working' && canAdd && !isAnimating;
    
    const handleClick = (e: React.MouseEvent) => {
      if (e.detail === 2 && canAddFile) {
        // 双击添加文件
        e.preventDefault();
        onAddFile(fileName);
      } else if (isClickable) {
        // 单击切换编辑状态
        onToggleEdit(fileName, area);
      }
    };
    
    return (
      <div
        onClick={handleClick}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all h-[36px] ${
          isAnimating
            ? 'bg-[#3B82F6] text-white scale-110 shadow-lg shadow-[#3B82F6]/50 ring-2 ring-[#3B82F6] ring-opacity-50'
            : isClickable
            ? canAdd && area === 'working'
              ? 'bg-[#1E293B] text-[#CBD5E1] border-2 border-[#10B981] cursor-pointer hover:bg-[#10B981]/10 hover:border-[#10B981]'
              : area === 'remote'
              ? 'bg-[#1E293B] text-[#CBD5E1] border border-[#8B5CF6] cursor-pointer hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6]'
              : 'bg-[#1E293B] text-[#64748B] border border-[#475569] cursor-pointer hover:bg-[#1E293B]/80 hover:border-[#64748B]'
            : canAdd && area === 'working'
            ? 'bg-[#1E293B] text-[#CBD5E1] border border-[#10B981]/50'
            : 'bg-[#1E293B] text-[#64748B] border border-[#334155] opacity-60'
        }`}
        style={{
          transition: prefersReducedMotion ? 'none' : 'all 0.3s ease-out',
          animation: isAnimating && !prefersReducedMotion ? 'pulse 0.6s ease-in-out' : 'none',
        }}
        title={
          canAddFile
            ? '单击：切换编辑状态 | 双击：添加到暂存区'
            : isClickable
            ? area === 'remote'
              ? '点击切换编辑状态（模拟远端修改）'
              : canAdd
              ? '点击切换编辑状态（已编辑）'
              : '点击添加编辑状态（未编辑）'
            : undefined
        }
      >
        <svg
          className={`w-4 h-4 flex-shrink-0 ${isAnimating ? 'text-white' : isClickable && canAdd ? 'text-[#10B981]' : 'text-[#64748B]'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="truncate flex-1">{fileName}</span>
        {editLabel && (
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${
            isAnimating
              ? 'bg-white/20 text-white'
              : 'bg-[#10B981] text-white'
          }`}>
            {editLabel}
          </span>
        )}
        {isClickable && !editLabel && (
          <span className="text-[10px] text-[#64748B] flex-shrink-0" title="点击添加编辑状态">
            ✏️
          </span>
        )}
      </div>
    );
  };

  const Arrow = ({ direction, isActive }: { direction: 'right' | 'down' | 'up'; isActive: boolean }) => {
    const baseClasses = 'transition-all duration-500';
    const activeClasses = isActive ? 'text-[#3B82F6] scale-110' : 'text-[#475569]';
    
    if (direction === 'right') {
      return (
        <svg
          className={`w-6 h-6 md:w-8 md:h-8 ${baseClasses} ${activeClasses}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{
            transition: prefersReducedMotion ? 'none' : 'all 0.5s ease-out',
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      );
    }
    
    return null;
  };

  const Section = ({ 
    title, 
    subtitle,
    files, 
    color = 'blue',
    area = 'working'
  }: { 
    title: string;
    subtitle?: string;
    files: string[]; 
    color?: 'blue' | 'green' | 'orange' | 'purple' | 'yellow';
    area?: 'working' | 'staging' | 'local' | 'remote' | 'stash';
  }) => {
    const colorClasses = {
      blue: 'border-[#3B82F6]/30 bg-[#3B82F6]/5',
      green: 'border-[#10B981]/30 bg-[#10B981]/5',
      orange: 'border-[#F97316]/30 bg-[#F97316]/5',
      purple: 'border-[#8B5CF6]/30 bg-[#8B5CF6]/5',
      yellow: 'border-[#FBBF24]/30 bg-[#FBBF24]/5',
    };

    return (
      <div className={`glass-card rounded-xl p-4 border-2 ${colorClasses[color]} h-[240px] flex flex-col`}>
        <h3 className="text-base font-semibold text-[#F1F5F9] mb-1 flex items-center gap-2">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-[#94A3B8] mb-3">{subtitle}</p>
        )}
        <div className="flex flex-wrap gap-1.5 overflow-y-auto flex-1">
          {files.length > 0 ? (
            files.map((file) => {
              const editLabel = getFileEditState(file);
              const canAdd = canAddToStaging(file);
              
              return (
                <FileItem 
                  key={file} 
                  fileName={file} 
                  isAnimating={animatingFiles.has(file)}
                  editLabel={editLabel}
                  canAdd={canAdd}
                  onToggleEdit={toggleFileEditState}
                  onAddFile={handleAddFile}
                  area={area}
                />
              );
            })
          ) : (
            <div className="text-xs text-[#64748B] italic">（空）</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="py-8 md:py-12 relative min-h-screen">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#F1F5F9] mb-2">
            Git 命令可视化学习
          </h2>
          <p className="text-sm md:text-base text-[#CBD5E1] max-w-2xl mx-auto">
            按功能区域学习 Git 命令，掌握基础命令链：add → commit → push → pull
          </p>
        </div>

        {/* 主布局：左侧基础命令 + 右侧流程图和进阶命令 */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧：基础命令区域 - 固定高度 */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="glass-card rounded-2xl p-5 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar pr-2">
              <h3 className="text-lg font-semibold text-[#F1F5F9] mb-4">基础命令</h3>
              <div className="space-y-3">
                {/* 工作区命令 */}
                <div>
                  <h4 className="text-sm font-semibold text-[#3B82F6] mb-2">工作区</h4>
                  <div className="space-y-2">
                    {COMMANDS_BY_AREA.working.filter(c => c.isCommon).map((cmd, idx) => (
                      <button
                        key={idx}
                        onClick={() => executeCommand(cmd.operation)}
                        disabled={currentOperation !== 'idle'}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all duration-200 ${
                          currentOperation === cmd.operation
                            ? 'bg-[#3B82F6]/20 border-2 border-[#3B82F6]'
                            : currentOperation !== 'idle'
                            ? 'bg-[#1E293B] text-[#64748B] cursor-not-allowed border border-[#334155]'
                            : 'bg-[#1E293B]/50 border border-[#334155] hover:border-[#3B82F6] hover:bg-[#3B82F6]/10 text-[#CBD5E1]'
                        }`}
                      >
                        <div className="text-[#3B82F6] font-semibold">{cmd.command}</div>
                        <div className="text-[#94A3B8] text-xs mt-0.5">{cmd.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 暂存区命令 */}
                <div>
                  <h4 className="text-sm font-semibold text-[#F97316] mb-2">暂存区</h4>
                  <div className="space-y-2">
                    {COMMANDS_BY_AREA.staging.filter(c => c.isCommon).map((cmd, idx) => (
                      <button
                        key={idx}
                        onClick={() => executeCommand(cmd.operation)}
                        disabled={currentOperation !== 'idle'}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all duration-200 ${
                          currentOperation === cmd.operation
                            ? 'bg-[#F97316]/20 border-2 border-[#F97316]'
                            : currentOperation !== 'idle'
                            ? 'bg-[#1E293B] text-[#64748B] cursor-not-allowed border border-[#334155]'
                            : 'bg-[#1E293B]/50 border border-[#334155] hover:border-[#F97316] hover:bg-[#F97316]/10 text-[#CBD5E1]'
                        }`}
                      >
                        <div className="text-[#F97316] font-semibold">{cmd.command}</div>
                        <div className="text-[#94A3B8] text-xs mt-0.5">{cmd.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 本地仓库命令 */}
                <div>
                  <h4 className="text-sm font-semibold text-[#10B981] mb-2">本地仓库</h4>
                  <div className="space-y-2">
                    {COMMANDS_BY_AREA.local.filter(c => c.isCommon).map((cmd, idx) => (
                      <button
                        key={idx}
                        onClick={() => executeCommand(cmd.operation)}
                        disabled={currentOperation !== 'idle'}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all duration-200 ${
                          currentOperation === cmd.operation
                            ? 'bg-[#10B981]/20 border-2 border-[#10B981]'
                            : currentOperation !== 'idle'
                            ? 'bg-[#1E293B] text-[#64748B] cursor-not-allowed border border-[#334155]'
                            : 'bg-[#1E293B]/50 border border-[#334155] hover:border-[#10B981] hover:bg-[#10B981]/10 text-[#CBD5E1]'
                        }`}
                      >
                        <div className="text-[#10B981] font-semibold">{cmd.command}</div>
                        <div className="text-[#94A3B8] text-xs mt-0.5">{cmd.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 其他命令 */}
                {COMMANDS_BY_AREA.other.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#FBBF24] mb-2">其他命令</h4>
                    <div className="space-y-2">
                      {COMMANDS_BY_AREA.other.map((cmd, idx) => (
                        <button
                          key={idx}
                          onClick={() => executeCommand(cmd.operation)}
                          disabled={currentOperation !== 'idle'}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all duration-200 ${
                            currentOperation === cmd.operation
                              ? 'bg-[#FBBF24]/20 border-2 border-[#FBBF24]'
                              : currentOperation !== 'idle'
                              ? 'bg-[#1E293B] text-[#64748B] cursor-not-allowed border border-[#334155]'
                              : 'bg-[#1E293B]/50 border border-[#334155] hover:border-[#FBBF24] hover:bg-[#FBBF24]/10 text-[#CBD5E1]'
                          }`}
                        >
                          <div className="text-[#FBBF24] font-semibold">{cmd.command}</div>
                          <div className="text-[#94A3B8] text-xs mt-0.5">{cmd.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：流程图和进阶命令 */}
          <div className="flex-1 min-w-0">
            {/* Git 流程图 - 固定在顶部 */}
            <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden mb-6 sticky top-4 z-10">
              {/* 文件管理工具 - 内嵌在流程图顶部 */}
              <div className="mb-6 pb-6 border-b border-[#1E293B]">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-semibold text-[#F1F5F9] mb-2">添加文件到工作区</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addFileToWorkingDir()}
                        placeholder="输入文件名"
                        className="flex-1 px-3 py-2 glass rounded-lg text-sm text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
                      />
                      <button
                        onClick={addFileToWorkingDir}
                        className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-sm font-semibold transition-all duration-200"
                      >
                        添加
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#F1F5F9] mb-2">模拟远程提交</label>
                    <button
                      onClick={simulateRemoteCommit}
                      className="px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg text-sm font-semibold transition-all duration-200"
                    >
                      模拟远程新文件
                    </button>
                  </div>
                </div>
              </div>

              {/* 基础命令链 - 内嵌在流程图中 */}
              <div className="mb-6 pb-6 border-b border-[#1E293B]">
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                  <button
                    onClick={() => executeCommand('add-all')}
                    disabled={
                      currentOperation !== 'idle' || 
                      state.workingDir.filter(f => 
                        !state.stagingArea.includes(f) && canAddToStaging(f)
                      ).length === 0
                    }
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-200 ${
                      currentOperation === 'add-all'
                        ? 'bg-[#3B82F6] text-white scale-105'
                        : currentOperation !== 'idle' || 
                          state.workingDir.filter(f => 
                            !state.stagingArea.includes(f) && canAddToStaging(f)
                          ).length === 0
                        ? 'bg-[#1E293B] text-[#64748B] cursor-not-allowed'
                        : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white hover:scale-105'
                    }`}
                  >
                    git add -A
                  </button>
                  <span className="text-[#CBD5E1] text-lg md:text-xl">→</span>
                  <button
                    onClick={() => executeCommand('commit-m')}
                    disabled={currentOperation !== 'idle' || state.stagingArea.length === 0}
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-200 ${
                      currentOperation === 'commit-m'
                        ? 'bg-[#10B981] text-white scale-105'
                        : currentOperation !== 'idle' || state.stagingArea.length === 0
                        ? 'bg-[#1E293B] text-[#64748B] cursor-not-allowed'
                        : 'bg-[#10B981] hover:bg-[#059669] text-white hover:scale-105'
                    }`}
                  >
                    git commit -m
                  </button>
                  <span className="text-[#CBD5E1] text-lg md:text-xl">→</span>
                  <button
                    onClick={() => executeCommand('push')}
                    disabled={currentOperation !== 'idle' || state.localRepo.filter(f => !state.remoteRepo.includes(f)).length === 0}
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-200 ${
                      currentOperation === 'push'
                        ? 'bg-[#F97316] text-white scale-105'
                        : currentOperation !== 'idle' || state.localRepo.filter(f => !state.remoteRepo.includes(f)).length === 0
                        ? 'bg-[#1E293B] text-[#64748B] cursor-not-allowed'
                        : 'bg-[#F97316] hover:bg-[#EA580C] text-white hover:scale-105'
                    }`}
                  >
                    git push
                  </button>
                  <span className="text-[#CBD5E1] text-lg md:text-xl">→</span>
                  <button
                    onClick={() => executeCommand('pull')}
                    disabled={currentOperation !== 'idle'}
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-200 ${
                      currentOperation === 'pull'
                        ? 'bg-[#8B5CF6] text-white scale-105'
                        : currentOperation !== 'idle'
                        ? 'bg-[#1E293B] text-[#64748B] cursor-not-allowed'
                        : 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white hover:scale-105'
                    }`}
                  >
                    git pull
                  </button>
                </div>
              </div>

              {/* Git 流程图 - 横向布局 */}
              <div className="mb-4">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                  {/* 工作区 */}
                  <div className="flex-1 w-full md:w-auto min-w-[200px]">
                    <Section 
                      title="工作区" 
                      subtitle="Working Directory"
                      files={state.workingDir} 
                      color="blue"
                      area="working"
                    />
                  </div>

                  {/* 向右箭头 */}
                  <div className="flex-shrink-0">
                    <Arrow direction="right" isActive={currentOperation === 'add' || currentOperation === 'add-all'} />
                  </div>

                  {/* 暂存区 */}
                  <div className="flex-1 w-full md:w-auto min-w-[200px]">
                    <Section 
                      title="暂存区" 
                      subtitle="Staging Area"
                      files={state.stagingArea} 
                      color="orange"
                      area="staging"
                    />
                  </div>

                  {/* 向右箭头 */}
                  <div className="flex-shrink-0">
                    <Arrow direction="right" isActive={currentOperation === 'commit' || currentOperation === 'commit-m'} />
                  </div>

                  {/* 本地仓库 */}
                  <div className="flex-1 w-full md:w-auto min-w-[200px]">
                    <Section 
                      title="本地仓库" 
                      subtitle="Local Repository"
                      files={state.localRepo} 
                      color="green"
                      area="local"
                    />
                  </div>

                  {/* 向右箭头 */}
                  <div className="flex-shrink-0">
                    <Arrow direction="right" isActive={currentOperation === 'push'} />
                  </div>

                  {/* 远程仓库 - 仅展示，无命令（服务端命令不适合基础演示） */}
                  <div className="flex-1 w-full md:w-auto min-w-[200px]">
                    <Section 
                      title="远程仓库" 
                      subtitle="Remote Repository"
                      files={state.remoteRepo} 
                      color="purple"
                      area="remote"
                    />
                  </div>
                </div>

                {/* Stash 区域 */}
                {state.stash.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-[#1E293B]">
                    <Section 
                      title="Stash 暂存" 
                      subtitle="Temporary Storage"
                      files={state.stash} 
                      color="yellow"
                      area="stash"
                    />
                  </div>
                )}
              </div>
              </div>

              {/* 重置按钮 */}
              <div className="text-center mb-6">
                <button
                  onClick={handleResetState}
                  disabled={currentOperation !== 'idle'}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    currentOperation !== 'idle'
                      ? 'bg-[#1E293B] text-[#64748B] cursor-not-allowed'
                      : 'glass-card text-[#CBD5E1] hover:text-[#F1F5F9] hover:scale-105 border border-[#334155]'
                  }`}
                >
                  重置所有状态
                </button>
              </div>

              {/* 高级可视化学习导航卡片 */}
              <div className="glass-card rounded-2xl p-6 border-2 border-[#8B5CF6]/30 bg-gradient-to-br from-[#8B5CF6]/10 to-[#3B82F6]/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-[#F1F5F9] mb-2">
                      高级可视化学习
                    </h3>
                    <p className="text-sm text-[#CBD5E1] mb-4">
                      探索更多 Git 高级功能，包括分支管理、合并策略、冲突解决等复杂场景的可视化演示。
                    </p>
                    <a
                      href="/git-visualizer/advanced"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#7C3AED] hover:to-[#2563EB] text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
                    >
                      <span>开始学习</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
