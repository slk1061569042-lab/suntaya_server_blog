export type VideoConfig = {
  compositionId: string;
  width: number;
  height: number;
  durationInFrames: number;
  fps: number;
  showInHeader?: boolean; // 是否在文档顶部显示
};

export const videoMappings: Record<string, VideoConfig> = {
  // 重要模块 - 在顶部显示
  'git-workflow': {
    compositionId: 'git-workflow-demo',
    width: 1280,
    height: 720,
    durationInFrames: 600,
    fps: 30,
    showInHeader: true,
  },
  'staging-area': {
    compositionId: 'staging-area-demo',
    width: 1280,
    height: 720,
    durationInFrames: 500,
    fps: 30,
    showInHeader: true,
  },
  'git-conflict-resolution': {
    compositionId: 'conflict-resolution-demo',
    width: 1280,
    height: 720,
    durationInFrames: 550,
    fps: 30,
    showInHeader: true,
  },
  'commit-files': {
    compositionId: 'commit-files-demo',
    width: 1280,
    height: 720,
    durationInFrames: 450,
    fps: 30,
    showInHeader: true,
  },
  'pull-update': {
    compositionId: 'pull-update-demo',
    width: 1280,
    height: 720,
    durationInFrames: 500,
    fps: 30,
    showInHeader: true,
  },
  'no-pull-commit': {
    compositionId: 'no-pull-commit-demo',
    width: 1280,
    height: 720,
    durationInFrames: 450,
    fps: 30,
    showInHeader: false,
  },
  'understand-conflict-sides': {
    compositionId: 'understand-conflict-sides-demo',
    width: 1280,
    height: 720,
    durationInFrames: 400,
    fps: 30,
    showInHeader: false,
  },
  'staging-area-maintenance': {
    compositionId: 'staging-area-maintenance-demo',
    width: 1280,
    height: 720,
    durationInFrames: 480,
    fps: 30,
    showInHeader: false,
  },
  'staging-area-relationship': {
    compositionId: 'staging-area-relationship-demo',
    width: 1280,
    height: 720,
    durationInFrames: 450,
    fps: 30,
    showInHeader: false,
  },
  'why-staging-area': {
    compositionId: 'why-staging-area-demo',
    width: 1280,
    height: 720,
    durationInFrames: 390,
    fps: 30,
    showInHeader: false,
  },
  'manual-resolve': {
    compositionId: 'manual-resolve-demo',
    width: 1280,
    height: 720,
    durationInFrames: 360,
    fps: 30,
    showInHeader: false,
  },
  'staging-conflict': {
    compositionId: 'staging-conflict-demo',
    width: 1280,
    height: 720,
    durationInFrames: 450,
    fps: 30,
    showInHeader: false,
  },
  'conflict-checklist': {
    compositionId: 'conflict-checklist-demo',
    width: 1280,
    height: 720,
    durationInFrames: 360,
    fps: 30,
    showInHeader: false,
  },
  'staging-conflict-details': {
    compositionId: 'staging-conflict-details-demo',
    width: 1280,
    height: 720,
    durationInFrames: 330,
    fps: 30,
    showInHeader: false,
  },
  'staging-analogy': {
    compositionId: 'staging-analogy-demo',
    width: 1280,
    height: 720,
    durationInFrames: 300,
    fps: 30,
    showInHeader: false,
  },
  'filter-branch': {
    compositionId: 'filter-branch-demo',
    width: 1280,
    height: 720,
    durationInFrames: 330,
    fps: 30,
    showInHeader: false,
  },
  'delete-remote-files': {
    compositionId: 'delete-remote-files-demo',
    width: 1280,
    height: 720,
    durationInFrames: 330,
    fps: 30,
    showInHeader: false,
  },
};

export function getVideoConfig(slug: string): VideoConfig | null {
  return videoMappings[slug] || null;
}

export function hasVideo(slug: string): boolean {
  return slug in videoMappings;
}
