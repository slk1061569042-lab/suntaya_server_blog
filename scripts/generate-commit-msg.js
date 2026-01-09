#!/usr/bin/env node
/**
 * 自动生成 Git Commit Message
 * 分析 git diff 并生成合适的 commit message
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

// 分析文件变更类型
function analyzeChanges(files) {
  const changes = {
    added: [],
    modified: [],
    deleted: [],
    renamed: [],
  };

  files.forEach(line => {
    const [status, ...fileParts] = line.split('\t');
    const file = fileParts.join('\t');
    const fileName = path.basename(file);

    switch (status[0]) {
      case 'A':
        changes.added.push(fileName);
        break;
      case 'M':
        changes.modified.push(fileName);
        break;
      case 'D':
        changes.deleted.push(fileName);
        break;
      case 'R':
        changes.renamed.push(fileName);
        break;
    }
  });

  return changes;
}

// 判断文件类型
function getFileType(fileName) {
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
  return 'other';
}

// 生成 commit message
function generateCommitMessage(changes) {
  const { added, modified, deleted } = changes;
  const allFiles = [...added, ...modified, ...deleted];
  const fileList = allFiles.slice(0, 5).join(', ');

  // 只有新增文件
  if (added.length > 0 && modified.length === 0 && deleted.length === 0) {
    const fileType = getFileType(added[0]);
    if (fileType === 'docs') {
      return `docs: 添加文档 - ${fileList}`;
    }
    if (fileType === 'code') {
      return `feat: 添加新功能 - ${fileList}`;
    }
    return `feat: 添加新文件 - ${fileList}`;
  }

  // 只有删除文件
  if (deleted.length > 0 && modified.length === 0 && added.length === 0) {
    return `refactor: 删除文件 - ${fileList}`;
  }

  // 有修改文件
  if (modified.length > 0) {
    const firstFile = modified[0];
    const fileType = getFileType(firstFile);

    if (fileType === 'docs') {
      return `docs: 更新文档 - ${fileList}`;
    }
    if (fileType === 'config') {
      return `config: 更新配置 - ${fileList}`;
    }
    if (fileType === 'style') {
      return `style: 更新样式 - ${fileList}`;
    }
    if (fileType === 'test') {
      return `test: 更新测试 - ${fileList}`;
    }
    if (firstFile.includes('fix') || firstFile.includes('bug') || firstFile.includes('error')) {
      return `fix: 修复问题 - ${fileList}`;
    }
    return `update: 更新代码 - ${fileList}`;
  }

  // 混合变更
  return `chore: 代码变更 - ${fileList}`;
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
