pipeline {
    // 使用 Docker 容器中的 Node 环境构建，避免在 Jenkins 宿主机装一堆东西
    agent {
        docker {
            image 'node:20-alpine'
            // 用 root 用户避免 node_modules 权限问题
            args '-u root:root'
        }
    }

    environment {
        // 部署服务器信息（静态导出后通过 SSH 发布到宝塔站点）
        DEPLOY_HOST = '115.190.54.220'
        DEPLOY_PORT = '22'
        DEPLOY_USER = 'root'
        DEPLOY_DIR  = '/www/wwwroot/next.sunyas.com'

        CI       = 'true'
        // 注意：不设置 NODE_ENV=production，因为 npm ci 在 NODE_ENV=production 时会跳过 devDependencies
        // 我们会在构建阶段单独设置 NODE_ENV
        // 跳过 npm prepare 脚本（避免 husky install 失败）
        npm_config_ignore_scripts = 'true'
    }

    options {
        // 保留最近 10 次构建
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // 单次构建最长 20 分钟
        timeout(time: 20, unit: 'MINUTES')
        // 控制台输出带时间戳
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                echo '正在检出代码...'
                // 如果 Job 是 “Pipeline script from SCM”，Jenkins 会自动 checkout，这里再确认一下
                checkout scm
                sh 'pwd && ls -la'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '正在安装依赖...'
                sh '''
                  set -e

                  echo "Node 版本:"
                  node -v
                  echo "NPM 版本:"
                  npm -v

                  # 临时取消 NODE_ENV=production，确保安装 devDependencies
                  unset NODE_ENV
                  
                  if [ -f package-lock.json ]; then
                    echo "===> 检测到 package-lock.json，使用 npm ci 安装依赖（包括 devDependencies）"
                    npm ci
                  else
                    echo "===> 未检测到 package-lock.json，使用 npm install 安装依赖（包括 devDependencies）"
                    npm install
                  fi
                  
                  # 验证 TypeScript 已安装（Next.js 需要它来加载 next.config.ts）
                  echo "===> 验证 TypeScript 安装..."
                  if [ ! -f node_modules/typescript/package.json ]; then
                    echo "===> TypeScript 未找到，显式安装..."
                    npm install typescript --save-dev
                  else
                    echo "===> TypeScript 已安装"
                  fi
                '''
            }
        }

        stage('Lint') {
            steps {
                echo '正在运行代码检查（lint）...'
                // lint 失败不阻塞整个构建
                sh '''
                  set +e
                  if npm run | grep -q "lint"; then
                    echo "===> 检测到 lint 脚本，开始执行"
                    npm run lint || echo "lint 失败，但不会中断构建"
                  else
                    echo "===> 未检测到 lint 脚本，跳过 lint"
                  fi
                '''
            }
        }

        stage('Build Next.js') {
            steps {
                echo '正在构建 Next.js 项目...'
                sh '''
                  set -e
                  # 设置生产环境变量（仅用于构建）
                  export NODE_ENV=production
                  npm run build
                '''
            }
        }

        stage('Export static site') {
            steps {
                echo '正在执行静态导出 npm run export...'
                sh '''
                  set -e
                  npm run export

                  if [ ! -d "out" ]; then
                    echo "错误：未找到 out 目录，静态导出失败"
                    exit 1
                  fi

                  echo "===> out 目录内容如下："
                  ls -la out
                '''
            }
        }

        stage('Deploy to next.sunyas.com') {
            steps {
                echo "正在通过 SSH 将静态文件部署到 ${DEPLOY_DIR} ..."
                // 依赖 Jenkins 的 Publish Over SSH 插件
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            // 这里名字要和 Manage Jenkins → Configure System → Publish over SSH 里配置的 Server Name 一致
                            // 比如你那里配的是 main-server，就写 main-server
                            configName: 'main-server',
                            transfers: [
                                sshTransfer(
                                    // 要上传的本地文件（构建输出）
                                    sourceFiles: 'out/**',
                                    // 去掉路径前缀，这样 out/index.html 会直接变成目标目录下的 index.html
                                    removePrefix: 'out',
                                    // 目标目录（宝塔站点根目录）
                                    remoteDirectory: "${DEPLOY_DIR}",
                                    // 在上传前清空目标目录（由插件完成，避免上传后自己 rm -rf 把新文件删掉）
                                    cleanRemote: true,
                                    // 上传完成后在远程服务器执行的命令（这里只做查看）
                                    execCommand: '''
                                      set -e
                                      echo "===> 部署完成，当前目录结构："
                                      ls -la '"${DEPLOY_DIR}"'
                                      # 如确实需要重载 Nginx，可按你宝塔的命令来，例如（请根据你实际环境调整或先注释掉）：
                                      # /etc/init.d/nginx reload
                                      # /www/server/panel/bt nginx reload
                                    '''
                                )
                            ],
                            usePromotionTimestamp: false,
                            useWorkspaceInPromotion: false,
                            verbose: true
                        )
                    ]
                )
            }
        }
    }

    post {
        success {
            echo '✅ 构建和静态部署成功！已发布到 http://next.sunyas.com'
        }
        failure {
            echo '❌ 构建或部署失败，请检查 Jenkins 控制台日志'
        }
        always {
            echo '清理工作空间...'
            cleanWs()
        }
    }
}