import React from 'react';
import { Composition } from 'remotion';
import { GitWorkflowDemo } from './compositions/GitWorkflowDemo';
import { StagingAreaDemo } from './compositions/StagingAreaDemo';
import { ConflictResolutionDemo } from './compositions/ConflictResolutionDemo';
import { CommitFilesDemo } from './compositions/CommitFilesDemo';
import { PullUpdateDemo } from './compositions/PullUpdateDemo';
import { NoPullCommitDemo } from './compositions/NoPullCommitDemo';
import { UnderstandConflictSidesDemo } from './compositions/UnderstandConflictSidesDemo';
import { StagingAreaMaintenanceDemo } from './compositions/StagingAreaMaintenanceDemo';
import { StagingAreaRelationshipDemo } from './compositions/StagingAreaRelationshipDemo';
import { WhyStagingAreaDemo } from './compositions/WhyStagingAreaDemo';
import { ManualResolveDemo } from './compositions/ManualResolveDemo';
import { StagingConflictDemo } from './compositions/StagingConflictDemo';
import { ConflictChecklistDemo } from './compositions/ConflictChecklistDemo';
import { StagingConflictDetailsDemo } from './compositions/StagingConflictDetailsDemo';
import { StagingAnalogyDemo } from './compositions/StagingAnalogyDemo';
import { FilterBranchDemo } from './compositions/FilterBranchDemo';
import { DeleteRemoteFilesDemo } from './compositions/DeleteRemoteFilesDemo';
import { GitHeroDemo } from './compositions/GitHeroDemo';

// 用于 Remotion Studio 的根组件
export const RemotionRoot = () => {
  return (
    <>
      {/* Git 工作流程演示 */}
      <Composition
        id="git-workflow-demo"
        component={GitWorkflowDemo}
        durationInFrames={600}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: 'Git 工作流程完全解析',
        }}
      />

      {/* 暂存区详解演示 */}
      <Composition
        id="staging-area-demo"
        component={StagingAreaDemo}
        durationInFrames={500}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: '暂存区详解',
        }}
      />

      {/* 冲突解决演示 */}
      <Composition
        id="conflict-resolution-demo"
        component={ConflictResolutionDemo}
        durationInFrames={550}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: 'Git 冲突解决完全指南',
        }}
      />

      {/* Commit 文件演示 */}
      <Composition
        id="commit-files-demo"
        component={CommitFilesDemo}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: 'Commit 时包含哪些文件',
        }}
      />

      {/* Pull 更新演示 */}
      <Composition
        id="pull-update-demo"
        component={PullUpdateDemo}
        durationInFrames={500}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: 'Pull 后如何更新本地代码',
        }}
      />

      {/* 不 Pull 直接提交演示 */}
      <Composition
        id="no-pull-commit-demo"
        component={NoPullCommitDemo}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: '不 Pull 直接提交会发生什么',
        }}
      />

      {/* 理解冲突左右版本演示 */}
      <Composition
        id="understand-conflict-sides-demo"
        component={UnderstandConflictSidesDemo}
        durationInFrames={400}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: '理解冲突中的左右版本',
        }}
      />

      {/* 暂存区数据维护演示 */}
      <Composition
        id="staging-area-maintenance-demo"
        component={StagingAreaMaintenanceDemo}
        durationInFrames={480}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: '暂存区数据维护指南',
        }}
      />

      {/* 暂存区和工作区关系演示 */}
      <Composition
        id="staging-area-relationship-demo"
        component={StagingAreaRelationshipDemo}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: '暂存区和工作区的关系',
        }}
      />

      {/* 为什么需要暂存区演示 */}
      <Composition
        id="why-staging-area-demo"
        component={WhyStagingAreaDemo}
        durationInFrames={390}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: '为什么需要暂存区',
        }}
      />

      {/* 手动解决冲突演示 */}
      <Composition
        id="manual-resolve-demo"
        component={ManualResolveDemo}
        durationInFrames={360}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: '手动解决冲突步骤',
        }}
      />

      {/* 暂存区冲突演示 */}
      <Composition
        id="staging-conflict-demo"
        component={StagingConflictDemo}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: '暂存区有冲突代码怎么办',
        }}
      />

      {/* 冲突检查清单演示 */}
      <Composition
        id="conflict-checklist-demo"
        component={ConflictChecklistDemo}
        durationInFrames={360}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: '解决冲突的检查清单',
        }}
      />

      {/* 暂存区冲突详情演示 */}
      <Composition
        id="staging-conflict-details-demo"
        component={StagingConflictDetailsDemo}
        durationInFrames={330}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: '暂存区冲突的实际情况',
        }}
      />

      {/* 暂存区类比演示 */}
      <Composition
        id="staging-analogy-demo"
        component={StagingAnalogyDemo}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: '暂存区类比修正和强制推送',
        }}
      />

      {/* filter-branch 演示 */}
      <Composition
        id="filter-branch-demo"
        component={FilterBranchDemo}
        durationInFrames={330}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: 'filter-branch 和 filter-repo 的工作原理',
        }}
      />

      {/* 删除远程文件演示 */}
      <Composition
        id="delete-remote-files-demo"
        component={DeleteRemoteFilesDemo}
        durationInFrames={330}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: '删除远程服务器上的文件',
        }}
      />

      {/* Git Hero Section 动画 */}
      <Composition
        id="git-hero-demo"
        component={GitHeroDemo}
        durationInFrames={900}
        fps={30}
        width={1280}
        height={600}
        defaultProps={{
          title: 'Git 完整学习指南',
          description: '通过交互式可视化学习 Git 命令，掌握工作区、暂存区、本地仓库和远程仓库之间的数据流转',
          button1Text: '开始可视化练习',
          button2Text: '查看所有文档',
          button1Link: '/git-visualizer',
          button2Link: '/docs',
        }}
      />

    </>
  );
};

// 组件映射，用于 Player
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const compositionComponents: Record<string, React.ComponentType<any>> = {
  'git-workflow-demo': GitWorkflowDemo,
  'staging-area-demo': StagingAreaDemo,
  'conflict-resolution-demo': ConflictResolutionDemo,
  'commit-files-demo': CommitFilesDemo,
  'pull-update-demo': PullUpdateDemo,
  'no-pull-commit-demo': NoPullCommitDemo,
  'understand-conflict-sides-demo': UnderstandConflictSidesDemo,
  'staging-area-maintenance-demo': StagingAreaMaintenanceDemo,
  'staging-area-relationship-demo': StagingAreaRelationshipDemo,
  'why-staging-area-demo': WhyStagingAreaDemo,
  'manual-resolve-demo': ManualResolveDemo,
  'staging-conflict-demo': StagingConflictDemo,
  'conflict-checklist-demo': ConflictChecklistDemo,
  'staging-conflict-details-demo': StagingConflictDetailsDemo,
  'staging-analogy-demo': StagingAnalogyDemo,
  'filter-branch-demo': FilterBranchDemo,
  'delete-remote-files-demo': DeleteRemoteFilesDemo,
  'git-hero-demo': GitHeroDemo,
};

// 默认 props 映射
export const compositionDefaultProps: Record<string, Record<string, unknown>> = {
  'git-workflow-demo': { title: 'Git 工作流程完全解析' },
  'staging-area-demo': { title: '暂存区详解' },
  'conflict-resolution-demo': { title: 'Git 冲突解决完全指南' },
  'commit-files-demo': { title: 'Commit 时包含哪些文件' },
  'pull-update-demo': { title: 'Pull 后如何更新本地代码' },
  'no-pull-commit-demo': { title: '不 Pull 直接提交会发生什么' },
  'understand-conflict-sides-demo': { title: '理解冲突中的左右版本' },
  'staging-area-maintenance-demo': { title: '暂存区数据维护指南' },
  'staging-area-relationship-demo': { title: '暂存区和工作区的关系' },
  'why-staging-area-demo': { title: '为什么需要暂存区' },
  'manual-resolve-demo': { title: '手动解决冲突步骤' },
  'staging-conflict-demo': { title: '暂存区有冲突代码怎么办' },
  'conflict-checklist-demo': { title: '解决冲突的检查清单' },
  'staging-conflict-details-demo': { title: '暂存区冲突的实际情况' },
  'staging-analogy-demo': { title: '暂存区类比修正和强制推送' },
  'filter-branch-demo': { title: 'filter-branch 和 filter-repo 的工作原理' },
  'delete-remote-files-demo': { title: '删除远程服务器上的文件' },
  'git-hero-demo': {
    title: 'Git 完整学习指南',
    description: '通过交互式可视化学习 Git 命令，掌握工作区、暂存区、本地仓库和远程仓库之间的数据流转',
    button1Text: '开始可视化练习',
    button2Text: '查看所有文档',
    button1Link: '/git-visualizer',
    button2Link: '/docs',
  },
};
