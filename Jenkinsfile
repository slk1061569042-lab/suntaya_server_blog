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
        // 部署服务器信息（服务端渲染模式部署）
        DEPLOY_HOST = '115.190.54.220'
        DEPLOY_PORT = '22'
        DEPLOY_USER = 'root'
        DEPLOY_DIR  = '/www/wwwroot/next.sunyas.com'
        APP_PORT    = '3000'

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
                // 如果 Job 是 "Pipeline script from SCM"，Jenkins 会自动 checkout，这里再确认一下
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

        stage('Package for deployment') {
            steps {
                echo '正在打包部署文件...'
                sh '''
                  set -e
                  
                  # 检查构建输出
                  if [ ! -d ".next" ]; then
                    echo "错误：未找到 .next 目录，构建失败"
                    exit 1
                  fi
                  
                  # 检查 standalone 输出
                  if [ ! -d ".next/standalone" ]; then
                    echo "错误：未找到 .next/standalone 目录，请确保 next.config.ts 中配置了 output: 'standalone'"
                    exit 1
                  fi
                  
                  echo "===> 构建输出目录："
                  ls -la .next/standalone
                  
                  # 创建部署包
                  echo "===> 准备部署文件..."
                  mkdir -p deploy-package
                  
                  # 复制 standalone 文件
                  cp -r .next/standalone/* deploy-package/
                  
                  # 复制 .next 目录（Next.js 需要它来运行）
                  # standalone 模式仍然需要 .next 目录中的一些文件
                  mkdir -p deploy-package/.next
                  cp -r .next/standalone deploy-package/.next/
                  # 复制其他必要的 .next 文件
                  if [ -d ".next/static" ]; then
                    cp -r .next/static deploy-package/.next/
                  fi
                  if [ -f ".next/BUILD_ID" ]; then
                    cp .next/BUILD_ID deploy-package/.next/
                  fi
                  
                  # 复制必要的静态文件
                  if [ -d "public" ]; then
                    cp -r public deploy-package/
                  fi
                  
                  # 复制 package.json（用于 PM2 启动）
                  cp package.json deploy-package/
                  
                  echo "===> 部署包内容："
                  ls -la deploy-package
                '''
            }
        }

        stage('Deploy to next.sunyas.com') {
            steps {
                echo "正在通过 SSH 部署到 ${DEPLOY_DIR} ..."
                // 依赖 Jenkins 的 Publish Over SSH 插件
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            // 这里名字要和 Manage Jenkins → Configure System → Publish over SSH 里配置的 Server Name 一致
                            configName: 'main-server',
                            transfers: [
                                sshTransfer(
                                    // 要上传的本地文件（构建输出）
                                    sourceFiles: 'deploy-package/**',
                                    // 去掉路径前缀
                                    removePrefix: 'deploy-package',
                                    // 目标目录
                                    remoteDirectory: "${DEPLOY_DIR}",
                                    // 在上传前清空目标目录
                                    cleanRemote: true,
                                    // 上传完成后在远程服务器执行的命令
                                    execCommand: '''
                                      set -e
                                      cd '"${DEPLOY_DIR}"'
                                      
                                      echo "===> 部署完成，检查目录结构..."
                                      ls -la
                                      
                                      # 修复部署路径问题：如果文件被部署到了子目录，移动到正确位置
                                      if [ -d "www/wwwroot/next.sunyas.com" ]; then
                                        echo "===> 检测到文件在子目录中，正在移动到正确位置..."
                                        mv www/wwwroot/next.sunyas.com/* . 2>/dev/null || true
                                        mv www/wwwroot/next.sunyas.com/.* . 2>/dev/null || true
                                        rm -rf www
                                        echo "===> 文件已移动到正确位置"
                                      fi
                                      
                                      echo "===> 最终目录结构："
                                      ls -la
                                      
                                      # 验证必要文件是否存在
                                      if [ ! -f "server.js" ]; then
                                        echo "错误：未找到 server.js 文件"
                                        exit 1
                                      fi
                                      
                                      if [ ! -d ".next" ]; then
                                        echo "错误：未找到 .next 目录"
                                        exit 1
                                      fi
                                      
                                      echo "===> 检查 Node.js 版本："
                                      node -v || echo "Node.js 未安装，需要安装 Node.js"
                                      
                                      echo "===> 检查 PM2："
                                      pm2 -v || echo "PM2 未安装，需要安装 PM2"
                                      
                                      # 停止旧进程（如果存在）
                                      pm2 stop next-sunyas || echo "进程不存在，跳过停止"
                                      pm2 delete next-sunyas || echo "进程不存在，跳过删除"
                                      
                                      # 启动新进程
                                      echo "===> 启动 Next.js 应用..."
                                      pm2 start server.js --name next-sunyas --update-env || {
                                        echo "PM2 启动失败，尝试使用 node 直接启动"
                                        nohup node server.js > app.log 2>&1 &
                                        echo $! > app.pid
                                      }
                                      
                                      # 保存 PM2 配置
                                      pm2 save || echo "PM2 save 失败，跳过"
                                      
                                      echo "===> 部署完成！"
                                      echo "===> 应用运行在端口 '"${APP_PORT}"'"
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
            echo '✅ 构建和部署成功！已发布到 http://next.sunyas.com'
            echo '✅ Next.js 服务端应用已启动'
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
