#!/usr/bin/env node
/**
 * AI 智能生成 Git Commit Message
 * 分析代码变更内容，生成有意义的 commit message
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 获取暂存区的文件变更
function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-status', { encoding: 'utf-8' });
    return output.trim().split('\n').filter(line => line.trim());
  } catch (error) {
    return [];
  }
}

// 获取文件的实际 diff 内容
function getFileDiff(filePath) {
  try {
    const output = execSync(`git diff --cached "${filePath}"`, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
    return output;
  } catch (error) {
    return '';
  }
}

// 分析代码变更内容
function analyzeCodeChanges(diff) {
  const addedLines = (diff.match(/^\+[^+]/gm) || []).length;
  const deletedLines = (diff.match(/^-[^-]/gm) || []).length;
  const addedCode = diff.match(/^\+(?!\+)(?!-)(.*)$/gm) || [];
  const deletedCode = diff.match(/^-(?!-)(?!\+)(.*)$/gm) || [];
  
  // 提取关键信息
  const keywords = {
    function: /(function|const|let|var)\s+(\w+)/g,
    import: /^import\s+/gm,
    export: /^export\s+/gm,
    component: /(Component|function\s+\w+Component)/g,
    hook: /(use[A-Z]\w+|useState|useEffect)/g,
    api: /(api|fetch|axios|request)/gi,
    config: /(config|setting|option)/gi,
    fix: /(fix|bug|error|issue|problem)/gi,
    feature: /(feat|feature|add|new|create)/gi,
    refactor: /(refactor|optimize|improve|update)/gi,
  };

  const detected = {};
  const allCode = [...addedCode, ...deletedCode].join('\n');
  
  for (const [key, pattern] of Object.entries(keywords)) {
    if (pattern.test(allCode)) {
      detected[key] = true;
    }
  }

  return {
    addedLines,
    deletedLines,
    netChange: addedLines - deletedLines,
    detected,
  };
}

// 分析文件变更类型
function analyzeChanges(files) {
  const changes = {
    added: [],
    modified: [],
    deleted: [],
    renamed: [],
    fileDetails: [],
  };

  files.forEach(line => {
    const [status, ...fileParts] = line.split('\t');
    const file = fileParts.join('\t');
    const fileName = path.basename(file);
    const filePath = file;

    const fileInfo = {
      path: filePath,
      name: fileName,
      status: status[0],
    };

    switch (status[0]) {
      case 'A':
        changes.added.push(fileName);
        fileInfo.type = 'added';
        break;
      case 'M':
        changes.modified.push(fileName);
        fileInfo.type = 'modified';
        // 分析代码变更
        const diff = getFileDiff(filePath);
        fileInfo.codeAnalysis = analyzeCodeChanges(diff);
        break;
      case 'D':
        changes.deleted.push(fileName);
        fileInfo.type = 'deleted';
        break;
      case 'R':
        changes.renamed.push(fileName);
        fileInfo.type = 'renamed';
        break;
    }

    changes.fileDetails.push(fileInfo);
  });

  return changes;
}

// 判断文件类型
function getFileType(fileName, filePath = '') {
  const fullPath = filePath || fileName;
  
  if (fileName.endsWith('.md') || fileName.endsWith('.mdc')) {
    return 'docs';
  }
  if (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) {
    return 'code';
  }
  if (fileName.endsWith('.css') || fileName.endsWith('.scss')) {
    return 'style';
  }
  if (fileName.includes('test') || fileName.includes('spec')) {
    return 'test';
  }
  if (fileName.includes('config') || fileName === 'package.json' || fileName === 'tsconfig.json') {
    return 'config';
  }
  if (fullPath.includes('hook') || fullPath.includes('hooks')) {
    return 'hook';
  }
  if (fullPath.includes('component') || fullPath.includes('components')) {
    return 'component';
  }
  if (fullPath.includes('api') || fullPath.includes('route')) {
    return 'api';
  }
  if (fullPath.includes('util') || fullPath.includes('lib') || fullPath.includes('helper')) {
    return 'util';
  }
  return 'other';
}

// 生成文件描述（去除编码问题，使用更友好的名称）
function getFileDescription(fileInfo) {
  const fileName = fileInfo.name;
  // 处理编码问题，提取可读部分
  let desc = fileName;
  
  // 如果是中文文件名，尝试提取有意义的部分
  if (fileName.includes('.md') || fileName.includes('.mdc')) {
    // 提取文件名（不含扩展名）作为描述
    desc = fileName.replace(/\.(md|mdc)$/, '');
  } else {
    // 对于代码文件，使用文件名
    desc = fileName;
  }
  
  return desc;
}

// AI 智能生成 commit message
function generateCommitMessage(changes) {
  const { added, modified, deleted, fileDetails } = changes;
  
  // 分析主要变更
  const mainChange = fileDetails[0];
  if (!mainChange) {
    return 'chore: 代码变更';
  }

  const fileType = getFileType(mainChange.name, mainChange.path);
  const fileDesc = getFileDescription(mainChange);
  
  // 分析代码变更内容
  let codeAnalysis = null;
  if (mainChange.codeAnalysis) {
    codeAnalysis = mainChange.codeAnalysis;
  }

  // 生成智能描述
  let type = 'chore';
  let description = '';

  // 新增文件
  if (mainChange.type === 'added') {
    if (fileType === 'docs') {
      type = 'docs';
      description = `添加文档: ${fileDesc}`;
    } else if (fileType === 'component') {
      type = 'feat';
      description = `新增组件: ${fileDesc}`;
    } else if (fileType === 'hook') {
      type = 'feat';
      description = `新增自定义 Hook: ${fileDesc}`;
    } else if (fileType === 'api') {
      type = 'feat';
      description = `新增 API 接口: ${fileDesc}`;
    } else if (fileType === 'util') {
      type = 'feat';
      description = `新增工具函数: ${fileDesc}`;
    } else if (fileType === 'code') {
      type = 'feat';
      description = `新增功能: ${fileDesc}`;
    } else if (fileType === 'config') {
      type = 'config';
      description = `添加配置: ${fileDesc}`;
    } else {
      type = 'feat';
      description = `添加新文件: ${fileDesc}`;
    }
  }
  // 修改文件
  else if (mainChange.type === 'modified') {
    if (codeAnalysis) {
      const { addedLines, deletedLines, netChange, detected } = codeAnalysis;
      
      // 根据代码分析生成更智能的描述
      if (detected.fix) {
        type = 'fix';
        description = `修复问题: ${fileDesc}`;
      } else if (detected.feature) {
        type = 'feat';
        description = `新增功能: ${fileDesc}`;
      } else if (detected.refactor) {
        type = 'refactor';
        description = `重构优化: ${fileDesc}`;
      } else if (detected.hook) {
        type = 'feat';
        description = `更新 Hook: ${fileDesc}`;
      } else if (detected.component) {
        type = 'feat';
        description = `更新组件: ${fileDesc}`;
      } else if (detected.api) {
        type = 'feat';
        description = `更新 API: ${fileDesc}`;
      } else if (fileType === 'docs') {
        type = 'docs';
        description = `更新文档: ${fileDesc}`;
      } else if (fileType === 'config') {
        type = 'config';
        description = `更新配置: ${fileDesc}`;
      } else if (fileType === 'style') {
        type = 'style';
        description = `更新样式: ${fileDesc}`;
      } else if (netChange > 50) {
        type = 'feat';
        description = `新增功能: ${fileDesc} (+${netChange} 行)`;
      } else if (netChange < -20) {
        type = 'refactor';
        description = `代码优化: ${fileDesc} (减少 ${Math.abs(netChange)} 行)`;
      } else {
        type = 'update';
        description = `更新代码: ${fileDesc}`;
      }
    } else {
      // 没有代码分析，使用文件类型判断
      if (fileType === 'docs') {
        type = 'docs';
        description = `更新文档: ${fileDesc}`;
      } else if (fileType === 'config') {
        type = 'config';
        description = `更新配置: ${fileDesc}`;
      } else if (fileType === 'style') {
        type = 'style';
        description = `更新样式: ${fileDesc}`;
      } else {
        type = 'update';
        description = `更新: ${fileDesc}`;
      }
    }
  }
  // 删除文件
  else if (mainChange.type === 'deleted') {
    type = 'refactor';
    description = `删除文件: ${fileDesc}`;
  }

  // 如果有多个文件，添加文件数量信息
  const totalFiles = added.length + modified.length + deleted.length;
  if (totalFiles > 1) {
    const fileCount = totalFiles > 3 ? `等 ${totalFiles} 个文件` : '';
    return `${type}: ${description}${fileCount}`;
  }

  return `${type}: ${description}`;
}

// 主函数
function main() {
  const commitMsgFile = process.argv[2];
  const commitSource = process.argv[3];

  // 如果已经有 message（不是空提交），则跳过
  if (commitSource && commitSource !== 'message' && commitSource !== 'template') {
    return;
  }

  const stagedFiles = getStagedFiles();
  if (stagedFiles.length === 0) {
    return;
  }

  const changes = analyzeChanges(stagedFiles);
  const message = generateCommitMessage(changes);

  // 写入 commit message
  if (commitMsgFile) {
    try {
      // 检查文件是否已有内容（用户可能已经输入了）
      const existingContent = fs.existsSync(commitMsgFile) 
        ? fs.readFileSync(commitMsgFile, 'utf-8').trim() 
        : '';
      
      // 如果文件为空或只有注释，则写入生成的 message
      if (!existingContent || existingContent.startsWith('#')) {
        fs.writeFileSync(commitMsgFile, message, 'utf-8');
      }
    } catch (error) {
      // 如果写入失败，至少输出到控制台
      console.error('Error writing commit message:', error.message);
      console.log(message);
    }
  } else {
    console.log(message);
  }
}

main();
